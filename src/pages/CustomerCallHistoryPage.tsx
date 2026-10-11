import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ArrowLeft, PhoneCall, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest, backendSession } from '../lib/api';
import { auth } from '../lib/firebase';

type CallRecord = {
  id: string;
  mode: 'voice' | 'video' | string;
  status: string;
  createdAt?: string;
  acceptedAt?: string;
  endedAt?: string;
  channel?: string;
};

const formatDate = (value?: string) => value ? new Date(value).toLocaleString() : 'Time unavailable';
const statusLabel = (status: string) => status === 'declined' ? 'Declined' : status === 'missed' ? 'Missed' : status.charAt(0).toUpperCase() + status.slice(1);

export const CustomerCallHistoryPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);
      setError('');
      if (!current) { setCalls([]); setLoading(false); return; }
      setLoading(true);
      try {
        await backendSession(current);
        const data = await apiRequest<{ calls: CallRecord[] }>('/v1/dashboard/user');
        setCalls(data.calls.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load your call history.');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/instant-call" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#C5A059] hover:text-white"><ArrowLeft className="h-4 w-4"/>Back to call center</Link>
        <h1 className="text-3xl font-bold text-white">Recent Calls</h1>
        <p className="mt-2 text-sm text-[#A8A498]">Your complete voice and video call history.</p>
        {!user && !loading && <section className="mt-6 rounded-2xl border border-[#252D27] bg-[#111412] p-6"><p className="text-sm text-[#D9D3C4]">Sign in to view your call history.</p><Link to="/dashboard" className="mt-4 inline-flex rounded bg-[#C5A059] px-4 py-2.5 text-xs font-bold uppercase text-black">Sign in</Link></section>}
        {loading && <p className="mt-6 text-sm text-[#A8A498]">Loading your calls…</p>}
        {error && <p role="alert" className="mt-6 rounded border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {user && !loading && !error && <section aria-label="Call history" className="mt-6 max-h-[calc(100vh-300px)] space-y-4 overflow-y-auto overscroll-contain pr-2">
          {calls.map((call) => <article key={call.id} className="rounded-2xl border border-[#D8D2C3] bg-[#F5F1E7] p-5 shadow-lg shadow-black/20 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="shrink-0 rounded-xl border border-[#39463C] bg-[#18211B] p-3 text-[#C5A059]">{call.mode === 'video' ? <Video className="h-5 w-5"/> : <PhoneCall className="h-5 w-5"/>}</span>
              <h2 className="min-w-0 flex-1 break-words font-semibold text-[#172019]">{call.mode === 'video' ? 'Video call' : 'Voice call'}</h2>
              <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${call.status === 'missed' || call.status === 'declined' ? 'border-red-800 bg-red-950/40 text-red-200' : call.status === 'ended' ? 'border-[#455447] bg-[#202820] text-[#D7DFD4]' : 'border-emerald-800 bg-emerald-950/40 text-emerald-200'}`}>{statusLabel(call.status)}</span>
            </div>
            <dl className="mt-5 space-y-3 border-t border-[#252D27] pt-4 text-sm">
              <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"><dt className="text-xs font-bold uppercase tracking-wide text-[#53564E]">Started</dt><dd className="min-w-0 whitespace-normal break-words font-medium text-[#172019]">{formatDate(call.createdAt)}</dd></div>
              <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"><dt className="text-xs font-bold uppercase tracking-wide text-[#53564E]">Answered</dt><dd className="min-w-0 whitespace-normal break-words font-medium text-[#172019]">{call.acceptedAt ? formatDate(call.acceptedAt) : 'Not answered'}</dd></div>
              <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"><dt className="text-xs font-bold uppercase tracking-wide text-[#53564E]">Ended</dt><dd className="min-w-0 whitespace-normal break-words font-medium text-[#172019]">{call.endedAt ? formatDate(call.endedAt) : 'Not ended'}</dd></div>
              <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"><dt className="text-xs font-bold uppercase tracking-wide text-[#53564E]">Call reference</dt><dd className="min-w-0 break-all font-mono text-xs font-medium text-[#30362E]">{call.id}</dd></div>
            </dl>
          </article>)}
          {!calls.length && <p className="rounded-2xl border border-[#252D27] bg-[#111412] p-6 text-sm text-[#A8A498]">No calls have been recorded yet.</p>}
        </section>}
      </div>
    </main>
  );
};
