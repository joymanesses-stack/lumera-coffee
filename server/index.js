const crypto = require('node:crypto');
const http = require('node:http');
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { Server } = require('socket.io');

if (getApps().length === 0) initializeApp({ credential: applicationDefault() });

const firestore = getFirestore();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const port = Number(process.env.PORT || 3001);
const sessionSecret = process.env.SESSION_SECRET || process.env.TURN_SHARED_SECRET;
if (!sessionSecret) throw new Error('Set SESSION_SECRET to a long random secret for backend sessions.');
const stunUrls = (process.env.STUN_URLS || 'stun:stun.l.google.com:19302')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);
const turnUrls = (process.env.TURN_URLS || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  throw new Error('Set ALLOWED_ORIGINS to the HTTPS origin(s) allowed to use call signaling.');
}

function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }
function sign(payload) {
  const body = encode(payload);
  const signature = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url');
  return `${body}.${signature}`;
}
function verifySession(token) {
  if (typeof token !== 'string') throw new Error('Sign in is required.');
  const [body, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', sessionSecret).update(body || '').digest();
  let supplied;
  try { supplied = Buffer.from(signature || '', 'base64url'); } catch { supplied = Buffer.alloc(0); }
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) throw new Error('Backend session is invalid.');
  const session = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (session.exp < Date.now() / 1000) throw new Error('Backend session has expired.');
  return session;
}
async function resolveSession(token) {
  const session = verifySession(token);
  const user = await getAuth().getUser(session.uid);
  const claims = user.customClaims || {};
  const email = (user.email || '').toLowerCase();
  let agent = claims.agent === true;
  if (!agent) {
    const memberships = await Promise.all([firestore.collection('agent').doc(user.uid).get(), firestore.collection('agents').doc(user.uid).get()]);
    agent = memberships.some((item) => item.exists && item.data().active === true);
  }
  const admin = claims.admin === true || email === 'sgahimbare20@gmail.com';
  return { uid: user.uid, email: user.email || '', agent, admin };
}
async function readBody(request) {
  let raw = '';
  for await (const chunk of request) { raw += chunk; if (raw.length > 100000) throw new Error('Request body is too large.'); }
  return raw ? JSON.parse(raw) : {};
}
function send(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': response.allowedOrigin || '', 'vary': 'Origin' });
  response.end(JSON.stringify(value));
}
const httpServer = http.createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins.includes(origin)) response.allowedOrigin = origin;
  if (request.method === 'OPTIONS' && response.allowedOrigin) {
    response.writeHead(204, { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS', 'access-control-allow-headers': 'content-type,authorization', 'vary': 'Origin' }); response.end(); return;
  }
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/health') return send(response, 200, { status: 'ok' });
    if (url.pathname === '/v1/auth/firebase' && request.method === 'POST') {
      const { idToken } = await readBody(request);
      if (typeof idToken !== 'string') return send(response, 400, { error: 'Firebase ID token is required.' });
      const decoded = await getAuth().verifyIdToken(idToken);
      const user = await getAuth().getUser(decoded.uid);
      const session = { uid: user.uid, exp: Math.floor(Date.now() / 1000) + 3600 };
      return send(response, 200, { token: sign(session), expiresIn: 3600 });
    }
    if (url.pathname === '/v1/inquiries' && request.method === 'POST') {
      const data = await readBody(request);
      if (!String(data.contactName || '').trim() || !String(data.email || '').includes('@') || String(data.message || '').length > 4000) return send(response, 400, { error: 'Please provide a contact name, valid email, and a message under 4,000 characters.' });
      const ref = await firestore.collection('inquiries').add({ ...data, status: 'new', createdAt: new Date() });
      io.emit('queue-updated');
      return send(response, 201, { id: ref.id });
    }
    const bearer = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : null;
    const actor = await resolveSession(bearer);
    if (url.pathname === '/v1/conversations' && request.method === 'POST') {
      const existing = await firestore.collection('conversations').where('userUid', '==', actor.uid).where('status', '==', 'open').limit(1).get();
      if (!existing.empty) return send(response, 200, { conversation: { id: existing.docs[0].id, ...existing.docs[0].data() } });
      const ref = await firestore.collection('conversations').add({ userUid: actor.uid, customerEmail: actor.email || '', agentUid: null, status: 'open', createdAt: new Date(), updatedAt: new Date() });
      io.emit('queue-updated');
      return send(response, 201, { conversation: { id: ref.id, userUid: actor.uid, status: 'open' } });
    }
    const conversationMatch = url.pathname.match(/^\/v1\/conversations\/([^/]+)(?:\/messages)?$/);
    if (conversationMatch) {
      const ref = firestore.collection('conversations').doc(conversationMatch[1]);
      let snapshot = await ref.get();
      if (url.pathname.endsWith('/messages') && !snapshot.exists && request.method === 'POST') {
        await ref.set({ userUid: actor.uid, agentUid: null, status: 'open', createdAt: new Date(), updatedAt: new Date() });
        snapshot = await ref.get();
      }
      if (!snapshot.exists) return send(response, 404, { error: 'Conversation not found.' });
      const conversation = snapshot.data();
      const allowed = actor.admin || actor.agent || conversation.userUid === actor.uid;
      if (!allowed) return send(response, 403, { error: 'You cannot access this conversation.' });
      if (url.pathname.endsWith('/messages') && request.method === 'GET') {
        const messages = await ref.collection('messages').orderBy('createdAt', 'asc').limit(200).get();
        return send(response, 200, { messages: messages.docs.map((d) => ({ id: d.id, ...d.data() })) });
      }
      if (url.pathname.endsWith('/messages') && request.method === 'POST') {
        const { text: messageText } = await readBody(request);
        if (typeof messageText !== 'string' || !messageText.trim() || messageText.length > 4000) return send(response, 400, { error: 'Message must contain 1 to 4,000 characters.' });
        const message = { senderUid: actor.uid, senderRole: actor.agent || actor.admin ? 'agent' : 'customer', text: messageText.trim(), createdAt: new Date() };
        const messageRef = await ref.collection('messages').add(message);
        const conversationUpdate = { updatedAt: new Date(), lastMessage: message.text };
        if (!actor.agent && !actor.admin && actor.email && !conversation.customerEmail) conversationUpdate.customerEmail = actor.email;
        await ref.update(conversationUpdate);
        const payload = { id: messageRef.id, ...message };
        io.to(`conversation:${ref.id}`).emit('chat-message', payload);
        return send(response, 201, { message: payload });
      }
    }
    if (url.pathname === '/v1/calls' && request.method === 'POST') {
      const { mode } = await readBody(request);
      if (!['voice', 'video'].includes(mode)) return send(response, 400, { error: 'Call mode must be voice or video.' });
      const channel = `lumera-${crypto.randomUUID()}`;
      const ref = await firestore.collection('calls').add({ mode, channel, callerUid: actor.uid, status: 'ringing', createdAt: new Date() });
      io.emit('queue-updated');
      return send(response, 201, { call: { id: ref.id, mode, channel, callerUid: actor.uid, status: 'ringing' } });
    }
    const callMatch = url.pathname.match(/^\/v1\/calls\/([^/]+)(?:\/(end|accept))?$/);
    if (callMatch) {
      const ref = firestore.collection('calls').doc(callMatch[1]);
      const snap = await ref.get();
      if (!snap.exists) return send(response, 404, { error: 'Call not found.' });
      const call = snap.data();
      if (!actor.agent && !actor.admin && call.callerUid !== actor.uid) return send(response, 403, { error: 'You cannot access this call.' });
      if (request.method === 'POST' && callMatch[2] === 'accept') {
        if (!actor.agent) return send(response, 403, { error: 'Agent access is required.' });
        await ref.update({ status: 'accepted', agentUid: actor.uid, acceptedAt: new Date() });
        return send(response, 200, { ok: true });
      }
      if (request.method === 'POST' && callMatch[2] === 'end') {
        await ref.update({ status: 'ended', endedAt: new Date() }); return send(response, 200, { ok: true });
      }
      if (request.method === 'GET' && !callMatch[2]) return send(response, 200, { call: { id: snap.id, ...call } });
    }
    if (url.pathname === '/v1/agent/dashboard' || url.pathname === '/v1/agent/calls' || url.pathname === '/v1/agent/inquiries') {
      if (!actor.agent && !actor.admin) return send(response, 403, { error: 'Agent access is required.' });
      const [calls, inquiries, conversations] = await Promise.all([
        firestore.collection('calls').where('status', '==', 'ringing').limit(50).get(),
        firestore.collection('inquiries').orderBy('createdAt', 'desc').limit(50).get(),
        firestore.collection('conversations').where('status', '==', 'open').limit(100).get(),
      ]);
      const result = { calls: calls.docs.map((d) => ({ id: d.id, ...d.data() })), inquiries: inquiries.docs.map((d) => ({ id: d.id, ...d.data() })), conversations: conversations.docs.map((d) => ({ id: d.id, ...d.data() })) };
      return send(response, 200, url.pathname.endsWith('/calls') ? { calls: result.calls } : url.pathname.endsWith('/inquiries') ? { inquiries: result.inquiries } : result);
    }
    const inquiryMatch = url.pathname.match(/^\/v1\/agent\/inquiries\/([^/]+)$/);
    if (inquiryMatch && request.method === 'PATCH') {
      if (!actor.agent && !actor.admin) return send(response, 403, { error: 'Agent access is required.' });
      const { status } = await readBody(request);
      if (!['new', 'in_progress', 'contacted', 'closed'].includes(status)) return send(response, 400, { error: 'Invalid inquiry status.' });
      await firestore.collection('inquiries').doc(inquiryMatch[1]).update({ status, updatedAt: new Date() });
      return send(response, 200, { ok: true });
    }
    if (url.pathname === '/v1/dashboard/user' && request.method === 'GET') {
      const calls = await firestore.collection('calls').where('callerUid', '==', actor.uid).limit(100).get();
      const conversations = await firestore.collection('conversations').where('userUid', '==', actor.uid).limit(100).get();
      return send(response, 200, { calls: calls.docs.map((d) => ({ id: d.id, ...d.data() })), conversations: conversations.docs.map((d) => ({ id: d.id, ...d.data() })) });
    }
    if (url.pathname === '/v1/dashboard/admin' && request.method === 'GET') {
      if (!actor.admin) return send(response, 403, { error: 'Admin access is required.' });
      const [users, agents, calls, inquiries] = await Promise.all([getAuth().listUsers(1000), firestore.collection('agent').get(), firestore.collection('calls').get(), firestore.collection('inquiries').get()]);
      return send(response, 200, { users: users.users.map((u) => ({ uid: u.uid, email: u.email || '', displayName: u.displayName || '', disabled: u.disabled, role: u.customClaims?.admin ? 'admin' : u.customClaims?.agent ? 'agent' : 'customer' })), agents: agents.docs.map((d) => ({ uid: d.id, ...d.data() })), calls: calls.docs.map((d) => ({ id: d.id, ...d.data() })), inquiries: inquiries.docs.map((d) => ({ id: d.id, ...d.data() })) });
    }
    const roleMatch = url.pathname.match(/^\/v1\/admin\/users\/([^/]+)\/role$/);
    if (roleMatch && request.method === 'PATCH') {
      if (!actor.admin) return send(response, 403, { error: 'Admin access is required.' });
      const { role } = await readBody(request);
      if (!['customer', 'agent', 'admin'].includes(role)) return send(response, 400, { error: 'Role must be customer, agent, or admin.' });
      const user = await getAuth().getUser(roleMatch[1]);
      const claims = { ...(user.customClaims || {}) };
      delete claims.agent; delete claims.admin;
      if (role === 'agent') claims.agent = true;
      if (role === 'admin') claims.admin = true;
      await getAuth().setCustomUserClaims(user.uid, claims);
      await firestore.collection('agent').doc(user.uid).set({ active: role === 'agent', updatedAt: new Date() }, { merge: true });
      return send(response, 200, { ok: true });
    }
    return send(response, 404, { error: 'Endpoint not found.' });
  } catch (error) {
    const status = /sign in|session|authentication|token/i.test(error.message) ? 401 : 500;
    return send(response, status, { error: error.message || 'Request failed.' });
  }
});

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
  allowRequest: (request, callback) => {
    const origin = request.headers.origin;
    callback(null, typeof origin === 'string' && allowedOrigins.includes(origin));
  },
  maxHttpBufferSize: 1e6,
  transports: ['websocket', 'polling'],
});

function makeIceServers(uid) {
  const servers = [{ urls: stunUrls }];
  const sharedSecret = process.env.TURN_SHARED_SECRET;
  if (turnUrls.length > 0 && sharedSecret) {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
    const username = `${expiresAt}:${uid}`;
    const credential = crypto.createHmac('sha1', sharedSecret).update(username).digest('base64');
    servers.push({ urls: turnUrls, username, credential });
  }
  return servers;
}

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    socket.data.user = await resolveSession(token);
    next();
  } catch (error) {
    next(new Error(`Call authentication failed: ${error.message}`));
  }
});

io.on('connection', (socket) => {
  socket.on('join-conversation', async ({ conversationId } = {}) => {
    try {
      if (typeof conversationId !== 'string') throw new Error('Invalid conversation.');
      const snapshot = await firestore.collection('conversations').doc(conversationId).get();
      if (!snapshot.exists) throw new Error('Conversation not found.');
      const conversation = snapshot.data();
      const actor = socket.data.user;
      if (!actor.admin && !actor.agent && conversation.userUid !== actor.uid) throw new Error('You are not authorized for this conversation.');
      await socket.join(`conversation:${conversationId}`);
    } catch (error) { socket.emit('chat-error', { message: error.message }); }
  });
  socket.on('join-call', async ({ callId, role } = {}) => {
    try {
      if (typeof callId !== 'string' || !['caller', 'agent'].includes(role)) {
        throw new Error('Invalid call room or participant role.');
      }
      if (socket.data.callId && socket.data.callId !== callId) {
        throw new Error('This connection is already assigned to another call.');
      }

      const callSnapshot = await firestore.collection('calls').doc(callId).get();
      if (!callSnapshot.exists) throw new Error('This call request does not exist.');
      const call = callSnapshot.data();
      const { uid, agent: isAgent, admin } = socket.data.user;
      const allowed = role === 'caller'
        ? call.callerUid === uid
        : (isAgent === true || admin === true) && call.agentUid === uid;

      if (!allowed) throw new Error('You are not authorized to join this call.');
      if (call.status !== 'accepted') throw new Error('The agent must accept this call before either party can join.');

      const room = `call:${callId}`;
      const roomSockets = await io.in(room).fetchSockets();
      const alreadyJoined = socket.rooms.has(room);
      if (roomSockets.some((member) => member.data.role === role && member.data.user.uid !== uid)) {
        throw new Error('Another participant is already using this call role.');
      }
      if (roomSockets.length >= 2 && !alreadyJoined) throw new Error('This call already has two participants.');

      socket.data.callId = callId;
      socket.data.role = role;
      await socket.join(room);
      socket.emit('ice-server-config', makeIceServers(uid));
      socket.emit('room-ready', { peerCount: roomSockets.length + (alreadyJoined ? 0 : 1) });
      socket.to(room).emit('peer-joined', { role });
    } catch (error) {
      socket.emit('call-error', { message: error.message || 'Could not join the call.' });
    }
  });

  for (const eventName of ['offer', 'answer', 'ice-candidate']) {
    socket.on(eventName, (payload = {}) => {
      const callId = socket.data.callId;
      if (!callId || !socket.rooms.has(`call:${callId}`)) return;
      const value = eventName === 'ice-candidate' ? payload.candidate : payload.description;
      if (!value || typeof value !== 'object') return;
      socket.to(`call:${callId}`).emit(eventName, payload);
    });
  }

  socket.on('disconnecting', () => {
    const callId = socket.data.callId;
    if (callId) socket.to(`call:${callId}`).emit('peer-left');
  });
});

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Lumera call signaling server listening on port ${port}`);
});
