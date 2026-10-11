import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApiRequest } from '../lib/api';

type RecordItem = { id: string; status?: string; createdAt?: string; updatedAt?: string; contactName?: string; callerName?: string; callerEmail?: string; email?: string; message?: string; mode?: string; lastMessagePreview?: string };
type UserDetails = { user: { uid: string; email?: string | null; displayName?: string; phoneNumber?: string | null; emailVerified?: boolean | null; disabled?: boolean; role?: string; provider?: string[] | string | null; createdAt?: string | null; lastSignInAt?: string | null; updatedAt?: string | null }; calls: RecordItem[]; inquiries: RecordItem[]; conversations: RecordItem[] };
const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleString() : 'Not recorded';

export const AdminUserDetailPage: React.FC = () => {
  const { uid = '' } = useParams();
  const [data, setData] = useState<UserDetails | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    adminApiRequest<UserDetails>(`/v1/admin/users/${encodeURIComponent(uid)}`)
      .then((result) => { if (alive) setData(result); })
      .catch((reason) => { if (alive) setError(reason instanceof Error ? reason.message : 'Could not load this account.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [uid]);
  const user = data?.user;
  return <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6"><div className="mx-auto max-w-5xl">
    <Link to="/admin" className="text-sm text-[#C5A059] hover:underline">← Back to admin</Link>
    {loading && <p className="mt-8 text-sm text-[#A8A498]">Loading account details…</p>}
    {error && <div role="alert" className="mt-6 rounded border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">{error}<p className="mt-2">Your admin session may have expired. <Link className="underline" to="/admin">Return to admin sign in</Link>.</p></div>}
    {user && <>
      <header className="mt-6 rounded-2xl border border-[#252D27] bg-[#111412] p-6"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#C5A059]">Account details</p><h1 className="mt-2 text-3xl font-bold text-white">{user.displayName || user.email || user.uid}</h1><p className="mt-2 break-all text-sm text-[#A8A498]">{user.email || 'No email recorded'} · {user.role || 'customer'}</p></header>
      <section className="mt-6 rounded-2xl border border-[#252D27] bg-[#111412] p-6"><h2 className="text-xl font-semibold text-white">Profile</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">{[['User ID', user.uid], ['Email', user.email || 'Not recorded'], ['Phone', user.phoneNumber || 'Not recorded'], ['Role', user.role || 'customer'], ['Email verified', user.emailVerified === null ? 'Not available' : user.emailVerified ? 'Yes' : 'No'], ['Account status', user.disabled ? 'Disabled' : 'Active'], ['Sign-in provider', Array.isArray(user.provider) ? user.provider.join(', ') : user.provider || 'Not recorded'], ['Created', dateLabel(user.createdAt)], ['Last sign in', dateLabel(user.lastSignInAt)], ['Last updated', dateLabel(user.updatedAt)]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#A8A498]">{label}</dt><dd className="mt-1 break-all text-white">{value}</dd></div>)}</dl></section>
      {[['Recent calls', data.calls, (item: RecordItem) => `${item.mode || 'Call'} · ${item.callerName || item.callerEmail || item.status || 'Activity'}`], ['Inquiries', data.inquiries, (item: RecordItem) => `${item.contactName || item.email || 'Inquiry'} · ${item.status || 'new'}`], ['Conversations', data.conversations, (item: RecordItem) => `${item.lastMessagePreview || item.status || 'Conversation'}`]].map(([title, records, summary]) => <section key={title as string} className="mt-6 rounded-2xl border border-[#252D27] bg-[#111412] p-6"><h2 className="text-xl font-semibold text-white">{title as string} <span className="text-sm font-normal text-[#A8A498]">({(records as RecordItem[]).length})</span></h2><div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{(records as RecordItem[]).map((item) => <article key={item.id} className="rounded border border-[#303831] bg-[#0B0D0C] p-3"><p className="text-sm text-white">{(summary as (row: RecordItem) => string)(item)}</p>{item.message && <p className="mt-2 whitespace-pre-wrap text-sm text-[#B8B3A7]">{item.message}</p>}<p className="mt-1 text-xs text-[#8F9189]">{dateLabel(item.createdAt || item.updatedAt)}</p></article>)}{!(records as RecordItem[]).length && <p className="text-sm text-[#A8A498]">No related records found.</p>}</div></section>)}
    </>}
  </div></main>;
};
