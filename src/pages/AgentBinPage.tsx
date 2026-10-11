import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { apiRequest, backendSession } from '../lib/api';

type BinMessage = { id: string; messageId: string; conversationId: string; customerEmail?: string; senderRole: string; text: string; createdAt?: string; deletedAt?: string };
type BinCall = { id: string; mode?: string; status?: string; callerUid?: string; caller?: { name?: string; email?: string; phone?: string }; createdAt?: string; acceptedAt?: string; endedAt?: string; deletedAt?: string };
const dateLabel = (value?: unknown) => {
  if (!value) return 'Not recorded';
  const date = typeof value === 'object' && value !== null && '_seconds' in value ? new Date(Number((value as { _seconds: number })._seconds) * 1000) : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString();
};

export const AgentBinPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<BinMessage[]>([]);
  const [calls, setCalls] = useState<BinCall[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const loadBin = async () => {
    const [messageResult, callResult] = await Promise.allSettled([
      apiRequest<{ messages: BinMessage[] }>('/v1/conversations/bin'),
      apiRequest<{ calls: BinCall[] }>('/v1/agent/bin/calls'),
    ]);
    if (messageResult.status === 'fulfilled') setMessages(messageResult.value.messages);
    if (callResult.status === 'fulfilled') setCalls(callResult.value.calls);
    if (callResult.status === 'rejected') throw callResult.reason;
    if (messageResult.status === 'rejected') setError('Deleted calls loaded. Deleted chat messages could not be loaded.');
  };
  useEffect(() => {
    if (!auth) { setReady(true); return; }
    return onAuthStateChanged(auth, async (current) => {
      setUser(current); setReady(false); setError('');
      if (!current) { setMessages([]); setReady(true); return; }
      try { await backendSession(current); await loadBin(); }
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
      const result = await apiRequest<{ message?: string; alreadyDeleted?: boolean }>(`/v1/conversations/bin/messages/${encodeURIComponent(message.messageId)}`, { method: 'DELETE' });
      setMessages((items) => items.filter((item) => item.messageId !== message.messageId));
      setError('');
      setNotice(result.alreadyDeleted ? 'Message already deleted.' : result.message || 'Message permanently deleted.');
    } catch (e) { setNotice(''); setError(e instanceof Error ? e.message : 'Could not permanently delete message.'); }
  };
  const restoreCall = async (call: BinCall) => {
    try {
      await apiRequest(`/v1/agent/bin/calls/${encodeURIComponent(call.id)}/restore`, { method: 'POST', body: '{}' });
      setCalls((items) => items.filter((item) => item.id !== call.id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not restore call.'); }
  };
  const permanentlyDeleteCall = async (call: BinCall) => {
    if (!window.confirm('Permanently delete this call record? This cannot be undone.')) return;
    try {
      await apiRequest(`/v1/agent/bin/calls/${encodeURIComponent(call.id)}`, { method: 'DELETE' });
      setCalls((items) => items.filter((item) => item.id !== call.id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not permanently delete call.'); }
  };
  if (!user) return <main className="min-h-screen bg-[#0B0D0C] px-4 pt-40 text-center text-[#DEDBD2]"><h1 className="text-2xl font-bold text-white">Agent Bin</h1><p className="mt-3 text-sm text-[#A8A498]">{ready ? 'Sign in with an agent account to view deleted messages.' : 'Checking sign-in…'}</p><Link to="/agent/messages" className="mt-5 inline-flex items-center gap-2 rounded border border-[#3A493D] px-4 py-2 text-sm text-[#C5A059]"><ArrowLeft className="h-4 w-4"/>Agent messages</Link></main>;
  return <main className="flex h-dvh flex-col overflow-hidden bg-[#0B0D0C] px-4 pb-4 pt-28 text-[#DEDBD2] sm:px-6 lg:px-8"><div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col"><header className="mb-4 flex shrink-0 flex-wrap items-end justify-between gap-3"><div><Link to="/agent" className="mb-2 inline-flex items-center gap-2 text-xs text-[#C5A059]"><ArrowLeft className="h-4 w-4"/>Back to agent desk</Link><h1 className="text-2xl font-bold text-white">Agent Bin</h1><p className="mt-1 text-sm text-[#A8A498]">Restore deleted call records or permanently remove them.</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#202720] px-3 py-1 text-xs text-[#C5A059]">{messages.length} messages</span><span className="rounded-full bg-[#202720] px-3 py-1 text-xs text-[#C5A059]">{calls.length} calls</span></div></header>
    {error && <p role="alert" className="mb-5 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    {notice && <p role="status" className="mb-5 rounded border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-200">{notice}</p>}
    {!ready && <p className="shrink-0 text-sm text-[#A8A498]">Loading Bin…</p>}
    <div className="h-[70vh] min-h-0 max-h-[calc(100dvh-240px)] w-full flex-none overflow-y-auto overscroll-contain rounded-2xl border border-[#252D27] bg-[#111412] p-3 sm:p-4">
    {!!calls.length && <section aria-label="Deleted call records" className="mb-5 space-y-3"><h2 className="px-1 text-lg font-bold text-white">Deleted calls</h2>
      {calls.map((call) => <article key={call.id} className="rounded-2xl border border-[#303831] bg-[#0B0D0C] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="break-words font-semibold text-white">{call.caller?.name || call.caller?.email || 'Customer'}</p><p className="mt-1 break-all text-xs text-[#A8A498]">{call.caller?.email || 'No email'} · Customer ID: {call.callerUid || 'Not recorded'}</p><p className="mt-2 text-xs text-[#A8A498]">{call.mode || 'voice'} call · {call.status || 'ended'} · deleted {dateLabel(call.deletedAt)}</p><p className="mt-1 text-xs text-[#A8A498]">Started {dateLabel(call.createdAt)} · accepted {dateLabel(call.acceptedAt)} · ended {dateLabel(call.endedAt)}</p></div><span className="shrink-0 rounded border border-[#39463C] px-2 py-1 text-[10px] uppercase text-[#C5A059]">Call record</span></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => void restoreCall(call)} className="inline-flex items-center gap-2 rounded bg-emerald-900 px-4 py-2 text-xs font-semibold"><RotateCcw className="h-4 w-4"/>Restore call</button><button onClick={() => void permanentlyDeleteCall(call)} className="inline-flex items-center gap-2 rounded border border-red-900 px-4 py-2 text-xs text-red-300"><Trash2 className="h-4 w-4"/>Delete permanently</button></div></article>)}
    </section>}
    {!!messages.length && <><h2 className="mb-3 text-lg font-bold text-white">Deleted chat messages</h2><section aria-label="Deleted message records" className="space-y-3">
      {messages.map((message) => <article key={message.id} className="rounded-2xl border border-[#303831] bg-[#0B0D0C] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="break-words font-semibold text-white">{message.customerEmail || 'Customer'}</p><p className="mt-1 break-words text-xs text-[#A8A498]">{message.senderRole} · deleted {dateLabel(message.deletedAt)} · sent {dateLabel(message.createdAt)}</p><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#DEDBD2]">{message.text}</p></div><span className="shrink-0 rounded border border-[#39463C] px-2 py-1 text-[10px] uppercase text-[#C5A059]">Chat message</span></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => void restore(message)} className="inline-flex items-center gap-2 rounded bg-emerald-900 px-4 py-2 text-xs font-semibold"><RotateCcw className="h-4 w-4"/>Restore to chat</button><button onClick={() => void permanentlyDelete(message)} className="inline-flex items-center gap-2 rounded border border-red-900 px-4 py-2 text-xs text-red-300"><Trash2 className="h-4 w-4"/>Delete permanently</button></div></article>)}
    </section></>}
    {ready && !calls.length && !messages.length && !error && <div className="p-8 text-center text-sm text-[#858177]">Bin is empty.</div>}
    </div>
  </div></main>;
};
