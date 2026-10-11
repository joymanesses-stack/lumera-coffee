import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { apiRequest, backendSession, backendUrl, getBackendToken } from '../lib/api';

type Conversation = { id: string; status?: string; updatedAt?: string; lastMessage?: string };
type Message = { id: string; senderRole: string; text: string; createdAt?: string; deletedAt?: string };
const isDeletedMessage = (message: Message) => Boolean(message.deletedAt) || message.text === '[Message deleted]' || message.text === 'This message was deleted.';

const panelClass = 'rounded-2xl border border-[#252D27] bg-[#111412] p-6';
const fieldClass = 'mt-2 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2.5 text-sm text-white';

export const CustomerDashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!auth) { setAuthReady(true); return; }
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);
      setAuthReady(true);
      setError('');
      if (!current) {
        setConversations([]); setConversationId(''); setMessages([]);
        return;
      }
      try {
        await backendSession(current);
        const data = await apiRequest<{ conversations: Conversation[] }>('/v1/dashboard/user');
        setConversations(data.conversations);
        setConversationId(data.conversations[0]?.id ?? '');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load your dashboard.');
      }
    });
  }, []);

  useEffect(() => {
    if (!conversationId || !getBackendToken()) return;
    let active = true;
    let requestVersion = 0;
    const load = async () => {
      const version = ++requestVersion;
      try {
        const data = await apiRequest<{ messages: Message[] }>(`/v1/conversations/${encodeURIComponent(conversationId)}/messages`);
        if (active && version === requestVersion) setMessages(data.messages.filter((message) => !isDeletedMessage(message)));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Could not load conversation history.');
      }
    };
    void load();
    const socket = io(backendUrl(''), { auth: { token: getBackendToken() }, transports: ['websocket', 'polling'] });
    socket.on('connect', () => socket.emit('join-conversation', { conversationId }));
    socket.on('conversation:ready', () => void load());
    socket.on('chat-message', (message: Message) => {
      if (isDeletedMessage(message)) {
        setMessages((items) => items.filter((item) => item.id !== message.id));
        void load();
      } else setMessages((items) => items.some((item) => item.id === message.id) ? items.map((item) => item.id === message.id ? message : item) : [...items, message]);
    });
    socket.on('chat-message-deleted', ({ id }: { id: string }) => {
      setMessages((items) => items.filter((item) => item.id !== id));
      void load();
    });
    socket.on('conversation:message-preview-updated', ({ conversationId: updatedId, lastMessage }: { conversationId: string; lastMessage: string }) => setConversations((items) => items.map((item) => item.id === updatedId ? { ...item, lastMessage } : item)));
    socket.on('chat-error', (e: { message: string }) => setError(e.message));
    return () => { active = false; socket.disconnect(); };
  }, [conversationId]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    const data = await apiRequest<{ conversation: Conversation }>('/v1/conversations', { method: 'POST', body: '{}' });
    setConversations((items) => items.some((item) => item.id === data.conversation.id) ? items : [data.conversation, ...items]);
    setConversationId(data.conversation.id);
    return data.conversation.id;
  };

  const startConversation = async () => {
    setError('');
    try { await ensureConversation(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not start a conversation.'); }
  };

  const openMessageCenter = async () => {
    setMessageCenterOpen(true);
    if (conversationId) return;
    await startConversation();
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || sendingMessage) return;
    const text = draft.trim();
    setError(''); setSendingMessage(true);
    try {
      const activeConversationId = await ensureConversation();
      const { message } = await apiRequest<{ message: Message }>(`/v1/conversations/${encodeURIComponent(activeConversationId)}/messages`, { method: 'POST', body: JSON.stringify({ text }) });
      setMessages((items) => items.some((item) => item.id === message.id) ? items : [...items, message]);
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your message.');
    } finally { setSendingMessage(false); }
  };

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!auth) { setError('Sign-in is not configured. Please contact Lumera.'); return; }
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not sign in.'); }
  };

  return (
    <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2]">
      <div className={`mx-auto ${messageCenterOpen ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <h1 className="text-3xl font-bold text-white">{messageCenterOpen ? 'Message center' : 'Customer support center'}</h1>
        {!messageCenterOpen && <p className="mt-2 text-sm text-[#A8A498]">Sign in to access your Lumera call center and message center.</p>}
        {!authReady && <p className="mt-6 text-sm text-[#A8A498]">Checking your sign-in…</p>}
        {authReady && !user && (
          <form onSubmit={handleAuth} className={`${panelClass} mx-auto mt-8 max-w-md`}>
            <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
            <label className="mt-5 block text-xs text-[#CFC8B8]">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} /></label>
            <label className="mt-4 block text-xs text-[#CFC8B8]">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} /></label>
            {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <button disabled={!auth} className="rounded bg-[#C5A059] px-4 py-2.5 text-xs font-bold uppercase text-black disabled:opacity-50">Sign in</button>
              <button type="button" disabled={!auth} onClick={async () => { setError(''); try { if (auth) await createUserWithEmailAndPassword(auth, email, password); } catch (e) { setError(e instanceof Error ? e.message : 'Could not create account.'); } }} className="rounded border border-[#3A493D] px-4 py-2.5 text-xs font-bold uppercase text-emerald-200 disabled:opacity-50">Create account</button>
              <button type="button" disabled={!auth} onClick={async () => { setError(''); try { if (auth) await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { setError(e instanceof Error ? e.message : 'Google sign-in failed.'); } }} className="rounded border border-[#303831] px-4 py-2.5 text-xs text-white disabled:opacity-50">Continue with Google</button>
            </div>
          </form>
        )}
        {user && <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#252D27] bg-[#111412] px-5 py-3 text-sm">
            <span>Signed in as <strong className="text-white">{user.email}</strong></span>
            <button onClick={() => auth && void signOut(auth)} className="text-xs font-bold uppercase tracking-wide text-[#C5A059]">Sign out</button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          {!messageCenterOpen && <section className={`${panelClass} mt-6`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="text-xl font-semibold text-white">Call center</h2><p className="mt-1 text-sm text-[#A8A498]">Start a secure voice or video call with a Lumera agent.</p></div>
              <Link to="/instant-call" className="rounded bg-[#C5A059] px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">Open call center</Link>
            </div>
          </section>}
          {!messageCenterOpen && <section className={`${panelClass} mt-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">Message center</h2><p className="mt-1 text-sm text-[#A8A498]">Chat with the Lumera team and continue a conversation anytime.</p></div><button onClick={() => void openMessageCenter()} className="rounded bg-[#C5A059] px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">Open message center</button></div>
          </section>}
          {messageCenterOpen && <section className="mt-6 grid h-[70vh] min-h-[520px] max-h-[760px] overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412] md:grid-cols-[280px_1fr]">
            <aside className="flex min-h-0 flex-col overflow-hidden border-b border-[#252D27] md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-[#252D27] p-4"><div><h2 className="font-semibold text-white">Chats</h2><p className="mt-1 text-xs text-[#858177]">Lumera support</p></div><button onClick={() => setMessageCenterOpen(false)} className="text-xs font-semibold uppercase text-[#C5A059]">Back</button></div>
              <button onClick={() => void startConversation()} className="m-3 rounded bg-[#C5A059] px-3 py-2.5 text-xs font-bold uppercase text-black">New message</button>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {conversations.map((item) => <button key={item.id} onClick={() => setConversationId(item.id)} className={`w-full border-t border-[#252D27] px-4 py-4 text-left transition-colors ${conversationId === item.id ? 'bg-[#1A211D]' : 'hover:bg-[#171B18]'}`}><span className="block text-sm font-semibold text-white">Lumera Support</span><span className="mt-1 block truncate text-xs text-[#A8A498]">{item.lastMessage || `Conversation · ${item.status || 'open'}`}</span></button>)}
                {conversations.length === 0 && <p className="px-4 py-3 text-xs text-[#858177]">Your support conversations will appear here.</p>}
              </div>
            </aside>
            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
              <header className="shrink-0 border-b border-[#252D27] px-5 py-4"><h2 className="font-semibold text-white">Lumera Support</h2><p className="mt-1 text-xs text-emerald-300">Customer care</p></header>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#0D100E] p-4 sm:p-6">{messages.map((message) => <div key={message.id} className={`flex ${message.senderRole === 'agent' ? 'justify-start' : 'justify-end'}`}><p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-base leading-6 shadow-sm ${message.senderRole === 'agent' ? 'rounded-tl-sm border-[#D8D2C3] bg-[#F5F1E7] text-[#172019]' : 'rounded-tr-sm border-[#83C99A] bg-[#C8F0D2] text-[#102219]'}`}><span className={`mb-1 block text-[11px] font-extrabold uppercase tracking-wide ${message.senderRole === 'agent' ? 'text-[#604812]' : 'text-[#15542F]'}`}>{message.senderRole === 'agent' ? 'Lumera Support' : 'You'}</span>{message.text}</p></div>)}{!messages.length && <p className="mx-auto mt-8 max-w-sm rounded-xl border border-[#39463C] bg-[#18211B] p-4 text-center text-sm text-[#D5DED5]">Your conversation is ready. Send a message to reach the Lumera team.</p>}</div>
              {error && <p role="alert" className="shrink-0 border-t border-[#252D27] px-4 py-2 text-sm text-red-300">{error}</p>}
              <form onSubmit={sendMessage} className="flex shrink-0 items-end gap-2 border-t border-[#252D27] p-3 sm:p-4"><textarea autoFocus rows={1} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={4000} required placeholder="Type a message…" className="max-h-36 min-h-12 min-w-0 flex-1 resize-y rounded-2xl border border-[#303831] bg-[#0B0D0C] px-4 py-3 text-sm leading-5 text-white outline-none focus:border-[#C5A059]"/><button disabled={sendingMessage || !draft.trim()} className="h-12 shrink-0 rounded-full bg-[#C5A059] px-5 text-xs font-bold uppercase text-black disabled:opacity-50">{sendingMessage ? 'Sending…' : 'Send'}</button></form>
            </div>
          </section>}
        </>}
      </div>
    </main>
  );
};
