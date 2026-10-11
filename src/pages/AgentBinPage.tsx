import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { apiRequest, backendSession } from '../lib/api';

type BinMessage = { id: string; messageId: string; conversationId: string; customerEmail?: string; senderRole: string; text: string; createdAt?: string; deletedAt?: string };
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString() : 'Not recorded';

export const AgentBinPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<BinMessage[]>([]);
  const [error, setError] = useState('');
  const loadMessages = async () => {
    const data = await apiRequest<{ messages: BinMessage[] }>('/v1/conversations/bin');
    setMessages(data.messages);
  };
  useEffect(() => {
    if (!auth) { setReady(true); return; }
    return onAuthStateChanged(auth, async (current) => {
      setUser(current); setReady(false); setError('');
      if (!current) { setMessages([]); setReady(true); return; }
      try { await backendSession(current); await loadMessages(); }
      catch (e) { setError(e instanceof Error ? e.message : 'Could not load the message Bin.'); }
      finally { setReady(true); }
    });
  }, []);
  const restore = async (message: BinMessage) => {
    try {
      await apiRequest(`/v1/conversations/bin/messages/${encodeURIComponent(message.messageId)}/restore`, { method: 'POST', body: '{}' });
      setMessages((items) => items.filter((item) => item.messageId !== message.messageId));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not restore message.'); }
  };
  const permanentlyDelete = async (message: BinMessage) => {
    if (!window.confirm('Permanently delete this message? This cannot be undone.')) return;
    try {
      await apiRequest(`/v1/conversations/bin/messages/${encodeURIComponent(message.messageId)}`, { method: 'DELETE' });
      setMessages((items) => items.filter((item) => item.messageId !== message.messageId));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not permanently delete message.'); }
  };
  if (!user) return <main className="min-h-screen bg-[#0B0D0C] px-4 pt-40 text-center text-[#DEDBD2]"><h1 className="text-2xl font-bold text-white">Agent Bin</h1><p className="mt-3 text-sm text-[#A8A498]">{ready ? 'Sign in with an agent account to view deleted messages.' : 'Checking sign-in…'}</p><Link to="/agent/messages" className="mt-5 inline-flex items-center gap-2 rounded border border-[#3A493D] px-4 py-2 text-sm text-[#C5A059]"><ArrowLeft className="h-4 w-4"/>Agent messages</Link></main>;
  return <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><Link to="/agent/messages" className="mb-4 inline-flex items-center gap-2 text-xs text-[#C5A059]"><ArrowLeft className="h-4 w-4"/>Back to messages</Link><h1 className="text-3xl font-bold text-white">Deleted messages</h1><p className="mt-2 text-sm text-[#A8A498]">Restore a message to return it to its chat, or permanently delete it.</p></div><span className="rounded-full bg-[#202720] px-3 py-1 text-xs text-[#C5A059]">{messages.length} items</span></header>
    {error && <p role="alert" className="mb-5 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    {!ready && <p className="text-sm text-[#A8A498]">Loading Bin…</p>}
    {!!messages.length && <section aria-label="Deleted message records" className="h-[calc(100vh-300px)] min-h-[320px] max-h-[600px] space-y-3 overflow-y-auto overscroll-contain rounded-2xl border border-[#252D27] bg-[#111412] p-4">
      {messages.map((message) => <article key={message.id} className="rounded-2xl border border-[#303831] bg-[#0B0D0C] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="break-words font-semibold text-white">{message.customerEmail || 'Customer'}</p><p className="mt-1 break-words text-xs text-[#A8A498]">{message.senderRole} · deleted {dateLabel(message.deletedAt)} · sent {dateLabel(message.createdAt)}</p><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#DEDBD2]">{message.text}</p></div><span className="shrink-0 rounded border border-[#39463C] px-2 py-1 text-[10px] uppercase text-[#C5A059]">Chat message</span></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => void restore(message)} className="inline-flex items-center gap-2 rounded bg-emerald-900 px-4 py-2 text-xs font-semibold"><RotateCcw className="h-4 w-4"/>Restore to chat</button><button onClick={() => void permanentlyDelete(message)} className="inline-flex items-center gap-2 rounded border border-red-900 px-4 py-2 text-xs text-red-300"><Trash2 className="h-4 w-4"/>Delete permanently</button></div></article>)}
    </section>}
    {ready && !error && !messages.length && <div className="rounded-2xl border border-[#252D27] bg-[#111412] p-10 text-center text-sm text-[#858177]">Bin is empty.</div>}
  </div></main>;
};
