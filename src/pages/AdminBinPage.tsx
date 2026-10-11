import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { adminApiRequest } from '../lib/api';

type BinRecord = { id: string; messageId?: string; conversationId?: string; email?: string; displayName?: string; status?: string; mode?: string; callerName?: string; callerEmail?: string; customerEmail?: string; contactName?: string; message?: string; text?: string; lastMessagePreview?: string; deletedAt?: string | { _seconds?: number }; createdAt?: string | { _seconds?: number } };
type BinData = { calls: BinRecord[]; conversations: BinRecord[]; inquiries: BinRecord[]; messages: BinRecord[]; agents: BinRecord[] };
const dateLabel = (value?: BinRecord['deletedAt']) => {
  if (!value) return 'Date not recorded';
  const date = typeof value === 'object' ? new Date((value._seconds || 0) * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not recorded' : date.toLocaleString();
};

export const AdminBinPage: React.FC = () => {
  const [data, setData] = useState<BinData>({ calls: [], conversations: [], inquiries: [], messages: [], agents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    const [calls, conversations, inquiries, messages, agents] = await Promise.all([
      adminApiRequest<{ calls: BinRecord[] }>('/v1/agent/bin/calls'),
      adminApiRequest<{ conversations: BinRecord[] }>('/v1/conversations/bin/conversations'),
      adminApiRequest<{ inquiries: BinRecord[] }>('/v1/inquiries/bin'),
      adminApiRequest<{ messages: BinRecord[] }>('/v1/conversations/bin'),
      adminApiRequest<{ agents: BinRecord[] }>('/v1/admin/bin/agents'),
    ]);
    setData({ calls: calls.calls, conversations: conversations.conversations, inquiries: inquiries.inquiries, messages: messages.messages, agents: agents.agents });
  }, []);
  useEffect(() => { void load().catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load the admin Bin.')).finally(() => setLoading(false)); }, [load]);
  const act = async (label: string, path: string, method: 'POST' | 'DELETE') => {
    if (method === 'DELETE' && !window.confirm(`Permanently delete this ${label}? This cannot be undone.`)) return;
    setError('');
    try {
      await adminApiRequest(path, { method, ...(method === 'POST' ? { body: JSON.stringify({}) } : {}) });
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : `Could not update ${label}.`); }
  };
  const sections: { title: string; records: BinRecord[]; restorePath: (record: BinRecord) => string; deletePath: (record: BinRecord) => string; label: (record: BinRecord) => string; detail: (record: BinRecord) => string }[] = [
    { title: 'Deleted calls', records: data.calls, restorePath: (item) => `/v1/agent/bin/calls/${encodeURIComponent(item.id)}/restore`, deletePath: (item) => `/v1/agent/bin/calls/${encodeURIComponent(item.id)}`, label: (item) => item.callerName || item.callerEmail || 'Call record', detail: (item) => `${item.mode || 'voice'} · ${item.status || 'ended'} · ${dateLabel(item.deletedAt)}` },
    { title: 'Deleted conversations', records: data.conversations, restorePath: (item) => `/v1/conversations/bin/conversations/${encodeURIComponent(item.id)}/restore`, deletePath: (item) => `/v1/conversations/bin/conversations/${encodeURIComponent(item.id)}`, label: (item) => item.customerEmail || 'Customer conversation', detail: (item) => `${item.status || 'deleted'} · ${dateLabel(item.deletedAt)}` },
    { title: 'Deleted inquiries', records: data.inquiries, restorePath: (item) => `/v1/inquiries/bin/${encodeURIComponent(item.id)}/restore`, deletePath: (item) => `/v1/inquiries/bin/${encodeURIComponent(item.id)}`, label: (item) => item.contactName || item.email || 'Inquiry', detail: (item) => `${item.email || 'No email'} · ${dateLabel(item.deletedAt)}` },
    { title: 'Deleted chat messages', records: data.messages, restorePath: (item) => `/v1/conversations/bin/messages/${encodeURIComponent(item.messageId || item.id)}/restore`, deletePath: (item) => `/v1/conversations/bin/messages/${encodeURIComponent(item.messageId || item.id)}`, label: (item) => item.customerEmail || 'Customer message', detail: (item) => `${item.senderRole || 'customer'} · ${dateLabel(item.deletedAt)} · ${item.text || ''}` },
    { title: 'Deleted agents', records: data.agents, restorePath: (item) => `/v1/admin/bin/agents/${encodeURIComponent(item.id)}/restore`, deletePath: (item) => `/v1/admin/bin/agents/${encodeURIComponent(item.id)}`, label: (item) => item.displayName || item.email || item.id, detail: (item) => `Agent account · deleted ${dateLabel(item.deletedAt)}` },
  ];
  const total = sections.reduce((sum, section) => sum + section.records.length, 0);
  return <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6"><div className="mx-auto max-w-6xl">
    <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#C5A059] hover:underline"><ArrowLeft className="h-4 w-4"/>Back to admin</Link>
    <header className="mt-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#C5A059]">Operations</p><h1 className="mt-2 text-3xl font-bold text-white">Admin Bin</h1><p className="mt-2 text-sm text-[#A8A498]">Restore items or permanently delete them.</p></div><span className="rounded-full bg-[#202720] px-3 py-1 text-xs text-[#C5A059]">{total} items</span></header>
    {error && <p role="alert" className="mt-5 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    {loading && <p className="mt-5 text-sm text-[#A8A498]">Loading Bin...</p>}
    <div className="mt-6 grid gap-5 lg:grid-cols-2">{sections.map((section) => <section key={section.title} className="rounded-2xl border border-[#252D27] bg-[#111412] p-5"><h2 className="text-lg font-semibold text-white">{section.title} <span className="text-sm font-normal text-[#A8A498]">({section.records.length})</span></h2><div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto overscroll-contain pr-1">{section.records.map((record) => <article key={record.id} className="rounded-xl border border-[#303831] bg-[#0B0D0C] p-4"><h3 className="break-words font-medium text-white">{section.label(record)}</h3><p className="mt-1 break-words text-xs text-[#A8A498]">{section.detail(record)}</p>{record.message && <p className="mt-2 whitespace-pre-wrap text-sm">{record.message}</p>}<div className="mt-3 flex flex-wrap gap-2"><button onClick={() => void act(section.title, section.restorePath(record), 'POST')} className="inline-flex items-center gap-2 rounded bg-emerald-900 px-3 py-2 text-xs font-semibold"><RotateCcw className="h-4 w-4"/>Restore</button><button onClick={() => void act(section.title, section.deletePath(record), 'DELETE')} className="inline-flex items-center gap-2 rounded border border-red-900 px-3 py-2 text-xs text-red-300"><Trash2 className="h-4 w-4"/>Delete permanently</button></div></article>)}{!section.records.length && <p className="text-sm text-[#858177]">Nothing in this section.</p>}</div></section>)}</div>
  </div></main>;
};