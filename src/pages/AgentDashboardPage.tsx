import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { io } from 'socket.io-client';
import { AlertCircle, LogOut, MessageCircle, PhoneCall, Send, ShieldCheck, Trash2, Video } from 'lucide-react';
import { AgentRecordsPanel, type AgentCall, type AgentCustomer, type AgentInquiry } from './AgentRecordsPanel';
import { auth } from '../lib/firebase';
import { apiRequest, backendSession, backendUrl, getBackendToken } from '../lib/api';
import { connectWebRTCCall, endCallRequest, type CallRequest } from '../lib/calls';

type Inquiry = AgentInquiry;
type Conversation = { id: string; userUid: string; customerEmail?: string; lastMessage?: string; updatedAt?: string; status?: string };
type ChatMessage = { id: string; senderRole: string; text: string; createdAt?: string; deletedAt?: string; placeholderHidden?: boolean };
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString() : 'Just received';

export const AgentDashboardPage: React.FC = () => {
  const messagesOnly = useLocation().pathname === '/agent/messages';
  const [user, setUser] = useState<User | null>(null); const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const [calls, setCalls] = useState<CallRequest[]>([]); const [callHistory, setCallHistory] = useState<AgentCall[]>([]); const [customers, setCustomers] = useState<AgentCustomer[]>([]); const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]); const [chatId, setChatId] = useState(''); const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]); const [chatDraft, setChatDraft] = useState('');
  const [activeCall, setActiveCall] = useState<CallRequest | null>(null); const [connected, setConnected] = useState(false);
  const [soundOn, setSoundOn] = useState(false); const audioRef = useRef<AudioContext | null>(null);
  const localRef = useRef<HTMLDivElement>(null); const remoteRef = useRef<HTMLDivElement>(null); const cleanupRef = useRef<(() => Promise<void>) | null>(null);

  const refresh = async () => {
    const data = await apiRequest<{ calls: CallRequest[]; callHistory?: AgentCall[]; inquiries: Inquiry[]; conversations: Conversation[] }>('/v1/agent/dashboard');
    setCalls(data.calls); setCallHistory(data.callHistory || []); setInquiries(data.inquiries); setConversations(data.conversations);
    setChatId((current) => data.conversations.some((conversation) => conversation.id === current && conversation.status === 'active') ? current : data.conversations.find((conversation) => conversation.status === 'active')?.id ?? '');
  };
  const refreshCustomers = async () => { const data = await apiRequest<{ customers: AgentCustomer[] }>('/v1/agent/customers'); setCustomers(data.customers); };
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (current) => {
      setUser(current); setAuthorized(false);
      if (!current) return;
      try { await backendSession(current); await Promise.all([refresh(), refreshCustomers()]); setAuthorized(true); }
      catch (e) { setError(e instanceof Error ? e.message : 'Agent access could not be verified.'); }
    });
  }, []);
  useEffect(() => {
    if (!authorized) return;
    const socket = io(backendUrl(''), { auth: { token: getBackendToken() }, transports: ['websocket', 'polling'] });
    socket.on('queue-updated', () => void refresh().catch((e) => setError(e.message)));
    const timer = setInterval(() => void refresh().catch((e) => setError(e.message)), 4000);
    return () => { clearInterval(timer); socket.disconnect(); };
  }, [authorized]);
  useEffect(() => {
    if (!chatId || !authorized) return;
    let active = true;
    setChatMessages([]);
    void apiRequest<{ messages: ChatMessage[] }>(`/v1/conversations/${encodeURIComponent(chatId)}/messages`).then((data) => { if (active) setChatMessages(data.messages); }).catch((e) => setError(e.message));
    const socket = io(backendUrl(''), { auth: { token: getBackendToken() }, transports: ['websocket', 'polling'] });
    socket.on('connect', () => socket.emit('join-conversation', { conversationId: chatId }));
    socket.on('chat-message', (message: ChatMessage) => setChatMessages((items) => items.some((item) => item.id === message.id) ? items.map((item) => item.id === message.id ? message : item) : [...items, message]));
    socket.on('chat-message-hidden', ({ id }: { id: string }) => setChatMessages((items) => items.filter((item) => item.id !== id)));
    return () => { active = false; socket.disconnect(); };
  }, [chatId, authorized]);
  useEffect(() => () => { void cleanupRef.current?.(); void audioRef.current?.close(); }, []);

  const accept = async (call: CallRequest) => {
    if (!user) return;
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: call.mode === 'video', audio: true });
      await apiRequest(`/v1/calls/${encodeURIComponent(call.id)}/accept`, { method: 'POST', body: '{}' });
      setActiveCall({ ...call, status: 'accepted' });
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      cleanupRef.current = await connectWebRTCCall(call.id, 'agent', call.mode, stream, localRef.current, remoteRef.current, () => setConnected(true), setError);
      await refresh();
    } catch (e) { stream?.getTracks().forEach((track) => track.stop()); setActiveCall(null); setError(e instanceof Error ? e.message : 'Could not accept this call.'); }
  };
  const closeCall = async () => { if (!activeCall) return; await cleanupRef.current?.(); cleanupRef.current = null; await endCallRequest(activeCall.id); setActiveCall(null); setConnected(false); };
  const updateInquiry = async (id: string, status: string) => { try { await apiRequest(`/v1/inquiries/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not update inquiry.'); } };
  const deleteInquiry = async (id: string) => { if (!window.confirm('Delete this inquiry from the agent dashboard? The record will be retained for audit.')) return; try { await apiRequest(`/v1/inquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete inquiry.'); } };
  const deleteCustomer = async (uid: string) => { if (!window.confirm('Disable this customer account? They will no longer be able to sign in.')) return; try { await apiRequest(`/v1/agent/customers/${encodeURIComponent(uid)}`, { method: 'DELETE' }); setCustomers((list) => list.filter((item) => item.uid !== uid)); } catch (e) { setError(e instanceof Error ? e.message : 'Could not disable customer account.'); } };
  const deleteConversation = async (id: string) => { if (!window.confirm('Delete this conversation? Its messages will be retained for audit.')) return; try { await apiRequest(`/v1/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' }); setConversations((list) => list.filter((item) => item.id !== id)); if (chatId === id) { setChatId(''); setChatMessages([]); } } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete conversation.'); } };
  const deleteMessage = async (message: ChatMessage) => { if (!window.confirm('Move this message to Bin? The customer will no longer see it.')) return; try { await apiRequest(`/v1/conversations/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(message.id)}`, { method: 'DELETE' }); setChatMessages((list) => list.map((item) => item.id === message.id ? { ...item, text: '[Message deleted]', deletedAt: new Date().toISOString() } : item)); } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete message.'); } };
  const removeDeletedMarker = async (message: ChatMessage) => { if (!window.confirm('Remove the deleted-message marker from this chat? The message will remain in Bin.')) return; try { await apiRequest(`/v1/conversations/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(message.id)}/placeholder`, { method: 'DELETE' }); setChatMessages((list) => list.filter((item) => item.id !== message.id)); } catch (e) { setError(e instanceof Error ? e.message : 'Could not remove deleted-message marker.'); } };
  const openConversation = async (conversation: Conversation) => {
    setError('');
    try {
      if (conversation.status === 'waiting') {
        await apiRequest(`/v1/conversations/${encodeURIComponent(conversation.id)}/accept`, { method: 'POST', body: '{}' });
      }
      setChatId(conversation.id);
      if (conversation.status === 'waiting') await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not accept this conversation.'); }
  };
  const sendChat = async (event: React.FormEvent) => { event.preventDefault(); if (!chatId || !chatDraft.trim()) return; const text = chatDraft.trim(); setChatDraft(''); try { const { message } = await apiRequest<{ message: ChatMessage }>(`/v1/conversations/${encodeURIComponent(chatId)}/messages`, { method: 'POST', body: JSON.stringify({ text }) }); setChatMessages((items) => items.some((item) => item.id === message.id) ? items : [...items, message]); } catch (e) { setChatDraft(text); setError(e instanceof Error ? e.message : 'Could not send message.'); } };
  const toggleSound = async () => { try { if (soundOn) { setSoundOn(false); return; } const audio = audioRef.current ?? new AudioContext(); await audio.resume(); audioRef.current = audio; setSoundOn(true); } catch { setError('Could not enable call sounds.'); } };

  if (!user) return <main className="min-h-screen bg-[#0B0D0C] px-4 py-40 text-[#DEDBD2]"><form onSubmit={async (e) => { e.preventDefault(); if (!auth) return; try { await signInWithEmailAndPassword(auth, email, password); setError(''); } catch (x) { setError(x instanceof Error ? x.message : 'Could not sign in.'); } }} className="mx-auto max-w-md rounded-2xl border border-[#343B34] bg-[#111412] p-8"><ShieldCheck className="mb-4 h-8 w-8 text-[#C5A059]"/><h1 className="text-2xl font-bold text-white">Lumera Agent Desk</h1><p className="mt-2 text-sm text-[#A8A498]">Sign in with your authorized agent account.</p><input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-5 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2 text-white"/><input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2 text-white"/>{error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}<button className="gold-button-gradient mt-5 w-full rounded py-3 text-xs font-bold uppercase">Sign in</button></form></main>;
  if (!authorized) return <main className="min-h-screen bg-[#0B0D0C] pt-40 text-center text-[#A8A498]">Checking agent accessÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ {error}</main>;
  return <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#C5A059]"><ShieldCheck className="h-4 w-4"/>Internal workspace</div><h1 className="text-3xl font-bold text-white">Lumera Agent Desk</h1><p className="mt-2 text-sm text-[#A8A498]">Live buyer inquiries and incoming calls.</p></div><div className="flex gap-2"><Link to={messagesOnly ? '/agent' : '/agent/messages'} className="inline-flex items-center gap-2 rounded border border-[#313831] px-4 py-2 text-xs"><MessageCircle className="h-4 w-4"/>{messagesOnly ? 'Call center' : 'Messages'}</Link><button onClick={() => void toggleSound()} className="rounded border border-[#313831] px-4 py-2 text-xs">{soundOn ? 'Mute sounds' : 'Enable call sounds'}</button><button onClick={() => void signOut(auth!)} className="inline-flex items-center gap-2 rounded border border-[#313831] px-4 py-2 text-xs"><LogOut className="h-4 w-4"/>Sign out</button></div></header>{error && <p role="alert" className="mb-5 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200"><AlertCircle className="mr-2 inline h-4 w-4"/>{error}</p>}{!messagesOnly && <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-[#252D27] bg-[#111412] p-5"><h2 className="mb-4 text-xl font-bold text-white">Incoming calls ({calls.length})</h2>{activeCall && <div className="mb-4 rounded border border-emerald-900 p-4">{connected ? 'Connected' : 'Connecting'} Ãƒâ€šÃ‚Â· {activeCall.mode}<div className="mt-3 grid grid-cols-2 gap-2"><div ref={localRef} className="aspect-video bg-black"/><div ref={remoteRef} className="aspect-video bg-black"/></div><button onClick={() => void closeCall()} className="mt-3 rounded bg-red-900 px-4 py-2 text-xs">End call</button></div>}{calls.map((call) => <article key={call.id} className="mb-3 rounded border border-[#303831] bg-[#0B0D0C] p-4"><div className="flex justify-between"><b>{call.mode === 'video' ? <Video className="inline h-4 w-4"/> : <PhoneCall className="inline h-4 w-4"/>} {call.mode} request</b><span className="text-xs text-amber-300">{dateLabel(call.createdAt)}</span></div><button disabled={!!activeCall} onClick={() => void accept(call)} className="mt-3 w-full rounded bg-emerald-800 py-2 text-xs font-bold uppercase disabled:opacity-50">Answer</button></article>)}{!calls.length && <p className="text-sm text-[#858177]">No calls are ringing.</p>}</section></div>}{!messagesOnly && <AgentRecordsPanel calls={callHistory} inquiries={inquiries} customers={customers} onUpdateInquiry={(id, status) => void updateInquiry(id, status)} onDeleteInquiry={(id) => void deleteInquiry(id)} onDeleteCustomer={(uid) => void deleteCustomer(uid)} />}{messagesOnly && <section className="mt-6 overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412]">
  <header className="flex items-center gap-3 border-b border-[#252D27] px-5 py-4"><MessageCircle className="h-5 w-5 text-[#C5A059]"/><div><h2 className="font-bold text-white">Customer messages</h2><p className="mt-1 text-xs text-[#A8A498]">Select a customer to read and reply in real time.</p></div><Link to="/agent/bin" className="ml-auto inline-flex items-center gap-2 rounded border border-[#3A493D] px-3 py-2 text-xs text-[#C5A059]"><Trash2 className="h-4 w-4"/>Bin</Link><span className="rounded-full bg-[#202720] px-3 py-1 text-xs text-[#C5A059]">{conversations.length} open</span></header>
<div className="grid h-[calc(100dvh-340px)] min-h-[280px] max-h-[450px] grid-rows-[150px_minmax(0,1fr)] md:grid-cols-[300px_1fr] md:grid-rows-1">
  <aside className="min-h-0 overflow-y-auto overscroll-contain border-b border-[#252D27] md:border-b-0 md:border-r">
    {conversations.map((conversation) => <button key={conversation.id} onClick={() => void openConversation(conversation)} className={`w-full border-b border-[#252D27] px-4 py-4 text-left transition-colors ${chatId === conversation.id ? 'bg-[#1A211D]' : 'hover:bg-[#171B18]'}`}><span className="flex items-center justify-between gap-2"><b className="truncate text-sm text-white">{conversation.customerEmail || `Customer Ã‚Â· ${conversation.userUid.slice(-7)}`}</b><span className="shrink-0 text-[10px] text-[#858177]">{dateLabel(conversation.updatedAt)}</span></span><span className="mt-1 block truncate text-xs text-[#A8A498]">{conversation.lastMessage || 'No messages yet'}</span></button>)}
    {!conversations.length && <div className="p-6 text-sm text-[#858177]">No customer messages yet. New conversations will appear here.</div>}
  </aside>
  <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
    {chatId ? <>
      <div className="flex items-center justify-between gap-3 border-b border-[#252D27] px-5 py-4"><div><p className="font-semibold text-white">{conversations.find((item) => item.id === chatId)?.customerEmail || `Customer #${conversations.find((item) => item.id === chatId)?.userUid.slice(-7)}`}</p><p className="mt-1 text-xs text-emerald-300">Conversation open</p></div><button onClick={() => void deleteConversation(chatId)} className="inline-flex items-center gap-1 rounded border border-red-900 px-3 py-2 text-xs text-red-300"><Trash2 className="h-3 w-3"/>Delete chat</button></div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#0D100E] p-4 sm:p-6">{chatMessages.map((message) => <div key={message.id} className={`flex items-end gap-2 ${message.senderRole === 'agent' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-base leading-6 shadow-sm ${message.senderRole === 'agent' ? 'rounded-tr-sm border-[#83C99A] bg-[#C8F0D2] text-[#102219]' : 'rounded-tl-sm border-[#D8D2C3] bg-[#F5F1E7] text-[#172019]'}`}><span className={`mb-1 block text-[11px] font-extrabold uppercase tracking-wide ${message.senderRole === 'agent' ? 'text-[#15542F]' : 'text-[#604812]'}`}>{message.senderRole === 'agent' ? 'You' : 'Customer'}</span>{message.deletedAt ? <i className="text-gray-500">[Message deleted]</i> : message.text}</p>{message.deletedAt ? <button aria-label="Remove deleted-message marker from chat" title="Remove marker from chat (keeps it in Bin)" onClick={() => void removeDeletedMarker(message)} className="rounded p-2 text-red-300 hover:bg-red-950/40"><Trash2 className="h-4 w-4"/></button> : <button aria-label="Move message to Bin" title="Move message to Bin" onClick={() => void deleteMessage(message)} className="rounded p-2 text-red-300 hover:bg-red-950/40"><Trash2 className="h-4 w-4"/></button>}</div>)}{!chatMessages.length && <p className="mx-auto mt-8 max-w-sm rounded-xl border border-[#39463C] bg-[#18211B] p-4 text-center text-sm text-[#D5DED5]">No messages in this conversation yet.</p>}</div>
      <form onSubmit={sendChat} className="flex shrink-0 items-end gap-2 border-t border-[#252D27] p-3 sm:p-4"><textarea rows={1} value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} maxLength={4000} required placeholder="Type a replyÃ¢â‚¬Â¦" className="max-h-36 min-h-12 min-w-0 flex-1 resize-y rounded-2xl border border-[#303831] bg-[#0B0D0C] px-4 py-3 text-sm leading-5 text-white outline-none focus:border-[#C5A059]"/><button disabled={!chatDraft.trim()} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#C5A059] px-5 text-xs font-bold uppercase text-black disabled:opacity-50"><Send className="h-4 w-4"/>Reply</button></form>
    </> : <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-[#858177]">Choose a conversation to view messages and reply.</div>}
  </div>
</div>
</section>}</div></main>;
};
