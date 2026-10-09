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

const httpServer = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  response.writeHead(404);
  response.end();
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
    if (typeof token !== 'string') throw new Error('Firebase sign-in is required.');
    socket.data.user = await getAuth().verifyIdToken(token);
    next();
  } catch (error) {
    next(new Error(`Call authentication failed: ${error.message}`));
  }
});

io.on('connection', (socket) => {
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
      const { uid, agent: isAgent } = socket.data.user;
      const allowed = role === 'caller'
        ? call.callerUid === uid
        : isAgent === true && call.agentUid === uid;

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
