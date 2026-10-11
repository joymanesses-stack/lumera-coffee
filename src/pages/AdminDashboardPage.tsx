import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { adminApiRequest, adminLogin, adminLogout, hasAdminSession } from '../lib/api';

type AdminUser = { uid: string; email: string; displayName: string; role: string; active?: boolean };
type AdminInquiry = { id: string; contactName?: string; companyName?: string; email?: string; phone?: string; coffeeType?: string; quantityRequired?: string; message?: string; status?: string; assignedAgentUid?: string; createdAt?: string };
type AdminCall = { id: string; status: string; mode: string; callerName?: string; callerEmail?: string; agentUid?: string; createdAt?: string };
type AdminConversation = { id: string; status: string; customerUid?: string; customerEmail?: string; agentUid?: string; lastMessagePreview?: string; createdAt?: string; updatedAt?: string };
type AdminData = {
  users: AdminUser[];
  calls: AdminCall[];
  inquiries: AdminInquiry[];
  recentConversations?: AdminConversation[];
  metrics?: { users: number; agents: number; calls: number; ringingCalls: number; conversations: number; waitingChats: number; inquiries: number; openInquiries: number };
};
type ChatMessage = { id: string; senderRole?: string; text?: string; createdAt?: string };
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString() : '—';
const statuses = ['new', 'in_progress', 'contacted', 'closed'];
const statusName = (value?: string) => (value || 'new').replace('_', ' ');

export const AdminDashboardPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(hasAdminSession);
  useEffect(() => { if (hasAdminSession()) void refresh().catch((e) => { adminLogout(); setAuthenticated(false); setError(e instanceof Error ? e.message : 'Admin session expired.'); }); }, []);
  const [data, setData] = useState<AdminData | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [error, setError] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const refresh = async () => setData(await adminApiRequest<AdminData>('/v1/dashboard/admin'));
  const agents = useMemo(() => (data?.users || []).filter((user) => user.role === 'agent' && user.active !== false), [data]);
  const conversations = data?.recentConversations || [];
  const filteredInquiries = useMemo(() => {
    const query = inquirySearch.trim().toLowerCase();
    return (data?.inquiries || []).filter((inquiry) => {
      const matchesStatus = inquiryStatus === 'all' || (inquiry.status || 'new') === inquiryStatus;
      const haystack = [inquiry.contactName, inquiry.companyName, inquiry.email, inquiry.phone, inquiry.coffeeType, inquiry.quantityRequired, inquiry.message].join(' ').toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [data, inquirySearch, inquiryStatus]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setError('');
    try {
      await adminLogin(email.trim(), password);
      setPassword('');
      setAuthenticated(true);
      await refresh();
    } catch (e) {
      adminLogout();
      setAuthenticated(false);
      setData(null);
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = () => {
    adminLogout();
    setAuthenticated(false);
    setData(null);
    setChatMessages([]);
    setSelectedConversation('');
    setError('');
  };

  const updateInquiry = async (inquiry: AdminInquiry, changes: { status?: string; assignedAgentUid?: string | null }) => {
    try {
      await adminApiRequest(`/v1/inquiries/${encodeURIComponent(inquiry.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: changes.status || inquiry.status || 'new', ...changes }),
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update inquiry.');
    }
  };

  const moveToBin = async (label: string, path: string) => {
    if (!window.confirm(`Move this ${label} to Bin? You can restore it or permanently delete it there.`)) return;
    try {
      await adminApiRequest(path, { method: 'DELETE' });
      if (label === 'conversation') { setSelectedConversation(''); setChatMessages([]); }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not move ${label} to Bin.`);
    }
  };

  const openConversation = async (id: string) => {
    setSelectedConversation(id);
    setChatMessages([]);
    setChatLoading(true);
    setError('');
    try {
      const result = await adminApiRequest<{ messages: ChatMessage[] }>(`/v1/conversations/${encodeURIComponent(id)}/messages?limit=100`);
      setChatMessages(result.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load conversation.');
    } finally {
      setChatLoading(false);
    }
  };

  const setRole = async (uid: string, role: string) => {
    try {
      await adminApiRequest(`/v1/admin/users/${encodeURIComponent(uid)}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update role.');
    }
  };

  const metrics = data?.metrics;
  const cards = [
    { label: 'Customers', value: metrics?.users ?? data?.users.filter((user) => user.role === 'customer').length ?? 0 },
    { label: 'Agents', value: metrics?.agents ?? agents.length },
    { label: 'Open inquiries', value: metrics?.openInquiries ?? (data?.inquiries || []).filter((item) => ['new', 'in_progress'].includes(item.status || 'new')).length },
    { label: 'Ringing calls', value: metrics?.ringingCalls ?? (data?.calls || []).filter((item) => item.status === 'ringing').length },
    { label: 'Waiting chats', value: metrics?.waitingChats ?? conversations.filter((item) => item.status === 'waiting').length },
    { label: 'Chats', value: metrics?.conversations ?? conversations.length },
  ];

  return (
    <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#C5A059]">Operations</p><h1 className="mt-2 text-3xl font-bold text-white">Lumera Admin</h1></div>
          <div className="flex gap-2">{authenticated && <Link to="/admin/bin" className="inline-flex items-center gap-2 rounded border border-[#303831] px-4 py-2 text-xs"><Trash2 className="h-4 w-4"/>Bin</Link>}{authenticated && <button onClick={handleSignOut} className="rounded border border-[#303831] px-4 py-2 text-xs">Sign out</button>}</div>
        </div>
        {!authenticated && (
          <form onSubmit={handleSignIn} className="mt-6 max-w-md rounded-2xl border border-[#252D27] bg-[#111412] p-6">
            <h2 className="text-xl font-semibold text-white">Administrator sign in</h2>
            <p className="mt-2 text-sm text-[#A8A498]">Use the administrator credentials configured on the backend.</p>
            <label className="mt-5 block text-xs text-[#CFC8B8]">Email
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2.5 text-sm text-white" />
            </label>
            <label className="mt-4 block text-xs text-[#CFC8B8]">Password
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2.5 text-sm text-white" />
            </label>
            {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
            <button disabled={authBusy} className="mt-5 w-full rounded bg-[#C5A059] px-4 py-3 text-xs font-bold uppercase text-black disabled:opacity-50">{authBusy ? 'Please wait...' : 'Sign in'}</button>
          </form>
        )}
        {authenticated && error && <p role="alert" className="mt-5 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
        {data && <>
          <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => <article key={card.label} className="rounded-xl border border-[#252D27] bg-[#111412] p-4"><p className="text-xs text-[#A8A498]">{card.label}</p><p className="mt-2 text-2xl font-bold text-white">{card.value}</p></article>)}
          </section>

          <section className="mt-7 rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">Inquiry follow-up</h2><p className="mt-1 text-xs text-[#A8A498]">Search requests, update their status, and assign an active agent.</p></div><span className="text-xs text-[#A8A498]">{filteredInquiries.length} shown</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><input value={inquirySearch} onChange={(event) => setInquirySearch(event.target.value)} placeholder="Search name, company, email, product, or request" className="rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2 text-sm text-white" /><select value={inquiryStatus} onChange={(event) => setInquiryStatus(event.target.value)} className="rounded border border-[#303831] bg-[#0B0D0C] p-2 text-sm"><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{statusName(status)}</option>)}</select></div>
            <div className="mt-4 space-y-3">
              {filteredInquiries.map((inquiry) => <article key={inquiry.id} className="rounded-xl border border-[#303831] bg-[#0B0D0C] p-4">
                <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h3 className="font-semibold text-white">{inquiry.contactName || 'New inquiry'}{inquiry.companyName ? ` · ${inquiry.companyName}` : ''}</h3><p className="mt-1 break-all text-xs text-[#B8B3A7]">{inquiry.email || 'No email'}{inquiry.phone ? ` · ${inquiry.phone}` : ''}</p><p className="mt-2 text-xs text-[#8F9189]">{inquiry.coffeeType || 'Coffee request'}{inquiry.quantityRequired ? ` · ${inquiry.quantityRequired}` : ''} · {dateLabel(inquiry.createdAt)}</p></div><div className="flex flex-wrap gap-2"><select aria-label="Inquiry status" value={inquiry.status || 'new'} onChange={(event) => void updateInquiry(inquiry, { status: event.target.value })} className="rounded border border-[#303831] bg-[#111412] p-2 text-xs">{statuses.map((status) => <option key={status} value={status}>{statusName(status)}</option>)}</select><select aria-label="Assign inquiry to agent" value={inquiry.assignedAgentUid || ''} onChange={(event) => void updateInquiry(inquiry, { assignedAgentUid: event.target.value || null })} className="max-w-52 rounded border border-[#303831] bg-[#111412] p-2 text-xs"><option value="">Unassigned</option>{agents.map((agent) => <option key={agent.uid} value={agent.uid}>{agent.displayName || agent.email}</option>)}</select><button title="Move inquiry to Bin" aria-label="Move inquiry to Bin" onClick={() => void moveToBin('inquiry', `/v1/inquiries/${encodeURIComponent(inquiry.id)}`)} className="rounded border border-red-900 p-2 text-red-300"><Trash2 className="h-4 w-4"/></button></div></div>
                {inquiry.message && <p className="mt-3 whitespace-pre-wrap text-sm text-[#DEDBD2]">{inquiry.message}</p>}
              </article>)}
              {!filteredInquiries.length && <p className="rounded border border-[#303831] p-4 text-sm text-[#A8A498]">No inquiries match these filters.</p>}
            </div>
          </section>

          <section className="mt-7 grid items-stretch gap-6 xl:grid-cols-2">
            <div className="flex h-[30rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6"><h2 className="text-xl font-semibold text-white">Recent calls <span className="text-sm font-normal text-[#A8A498]">({data.calls.length})</span></h2><div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">{(data.calls || []).slice(0, 12).map((call) => <div key={call.id} className="flex flex-wrap justify-between gap-2 rounded border border-[#303831] bg-[#0B0D0C] p-3 text-sm"><span>{call.mode} · {call.callerName || call.callerEmail || 'Customer'}</span><span className="text-xs text-[#A8A498]">{call.status} · {dateLabel(call.createdAt)}</span>{['missed', 'declined', 'ended'].includes(call.status) && <button title="Move call to Bin" aria-label="Move call to Bin" onClick={() => void moveToBin('call record', `/v1/agent/calls/${encodeURIComponent(call.id)}`)} className="rounded border border-red-900 p-2 text-red-300"><Trash2 className="h-4 w-4"/></button>}</div>)}{!data.calls.length && <p className="text-sm text-[#A8A498]">No calls recorded.</p>}</div></div>
            <div className="flex h-[30rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6"><h2 className="text-xl font-semibold text-white">Recent customer chats <span className="text-sm font-normal text-[#A8A498]">({conversations.length})</span></h2><div className="mt-4 max-h-40 space-y-2 overflow-y-auto overscroll-contain pr-1">{conversations.slice(0, 12).map((chat) => <article key={chat.id} className="flex items-stretch gap-2 rounded border border-[#303831] bg-[#0B0D0C] p-2"><button onClick={() => void openConversation(chat.id)} className={`min-w-0 flex-1 rounded p-2 text-left ${selectedConversation === chat.id ? 'border border-[#C5A059] bg-[#201B10]' : 'border border-transparent'}`}><span className="flex flex-wrap justify-between gap-2 text-sm text-white"><span>{chat.customerEmail || `Customer ${chat.customerUid?.slice(-7) || ''}`}</span><span className="text-xs text-[#A8A498]">{chat.status} · {dateLabel(chat.updatedAt || chat.createdAt)}</span></span><span className="mt-1 block truncate text-xs text-[#A8A498]">{chat.lastMessagePreview || 'No message preview'}</span></button><button title="Move conversation to Bin" aria-label="Move conversation to Bin" onClick={() => void moveToBin('conversation', `/v1/conversations/${encodeURIComponent(chat.id)}`)} className="self-center rounded border border-red-900 p-2 text-red-300"><Trash2 className="h-4 w-4"/></button></article>)}{!conversations.length && <p className="text-sm text-[#A8A498]">No chats recorded.</p>}</div>
              {selectedConversation && <div className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded border border-[#303831] p-3">{chatLoading ? <p className="text-sm text-[#A8A498]">Loading messages...</p> : chatMessages.map((message) => <div key={message.id} className="rounded bg-[#0B0D0C] p-3"><p className="text-[10px] font-bold uppercase text-[#C5A059]">{message.senderRole || 'customer'} · {dateLabel(message.createdAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm">{message.text}</p></div>)}</div>}
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl font-semibold text-white">Agent workload</h2><span className="text-xs text-[#A8A498]">{agents.length} active agents</span></div><p className="mt-1 text-xs text-[#A8A498]">Recent calls, active chats, and assigned inquiries.</p><div className="mt-4 max-h-[24rem] overflow-y-auto overscroll-contain pr-1"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{agents.map((agent) => {
            const calls = data.calls.filter((call) => call.agentUid === agent.uid).length;
            const assigned = data.inquiries.filter((inquiry) => inquiry.assignedAgentUid === agent.uid && inquiry.status !== 'closed').length;
            const chats = conversations.filter((chat) => chat.agentUid === agent.uid && chat.status === 'active').length;
            return <article key={agent.uid} className="rounded-xl border border-[#303831] bg-[#0B0D0C] p-4"><div className="flex items-start justify-between gap-2"><h3 className="font-semibold text-white">{agent.displayName || agent.email}</h3><button title="Move agent to Bin" aria-label={`Move ${agent.email || agent.uid} to Bin`} onClick={() => void moveToBin('agent account', `/v1/admin/agents/${encodeURIComponent(agent.uid)}`)} className="shrink-0 rounded border border-red-900 p-2 text-red-300"><Trash2 className="h-4 w-4"/></button></div><p className="mt-3 text-xs text-[#A8A498]">Active chats <b className="ml-1 text-white">{chats}</b><span className="mx-2">·</span>Open assigned inquiries <b className="ml-1 text-white">{assigned}</b><span className="mx-2">·</span>Recent calls <b className="ml-1 text-white">{calls}</b></p></article>;
          })}{!agents.length && <p className="text-sm text-[#A8A498]">No active agents found.</p>}</div></div></section>

          <section className="mt-7 rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">Accounts and roles</h2><p className="mt-1 text-xs text-[#A8A498]">{data.users.length} accounts · scroll to browse</p></div></div><div className="mt-3 max-h-[20rem] divide-y divide-[#252D27] overflow-y-auto overscroll-contain pr-2">{data.users.map((account) => <div key={account.uid} className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-3 text-sm"><div className="min-w-0"><Link to={`/admin/users/${encodeURIComponent(account.uid)}`} className="block truncate font-medium text-white hover:text-[#C5A059]">{account.displayName || account.email || account.uid}</Link><span className="block truncate text-xs text-[#A8A498]">{account.email || account.uid}</span></div><select aria-label={`Role for ${account.email || account.uid}`} value={account.role} onChange={(event) => void setRole(account.uid, event.target.value)} className="rounded border border-[#303831] bg-[#0B0D0C] p-2"><option value="customer">Customer</option><option value="agent">Agent</option><option value="admin">Admin</option></select></div>)}</div></section>
        </>}
      </div>
    </main>
  );
};


