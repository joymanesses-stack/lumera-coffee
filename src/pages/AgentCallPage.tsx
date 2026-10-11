import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ArrowLeft, PhoneCall, PhoneOff, UserRound, Video } from 'lucide-react';
import { auth } from '../lib/firebase';
import { backendSession } from '../lib/api';
import { connectWebRTCCall, endCallRequest, getCall, type CallRequest } from '../lib/calls';

const recordedDate = (value?: unknown) => {
  if (!value) return 'Not recorded';
  const date = typeof value === 'object' && value !== null && '_seconds' in value
    ? new Date(Number((value as { _seconds: number })._seconds) * 1000)
    : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString();
};

export const AgentCallPage: React.FC = () => {
  const { callId = '' } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [call, setCall] = useState<CallRequest | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!auth) { setLoading(false); setError('Agent sign-in is unavailable.'); return; }
    let active = true;
    let mediaStream: MediaStream | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      if (!active) return;
      setUser(current);
      if (!current) { setLoading(false); return; }
      try {
        await backendSession(current);
        const currentCall = await getCall(callId);
        if (!active) return;
        if (currentCall.status !== 'accepted') throw new Error('This call is no longer active.');
        setCall(currentCall);
        const stream = await navigator.mediaDevices.getUserMedia({ video: currentCall.mode === 'video', audio: true });
        mediaStream = stream;
        if (!active) { mediaStream.getTracks().forEach((track) => track.stop()); return; }
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        cleanupRef.current = await connectWebRTCCall(callId, 'agent', currentCall.mode, stream, localRef.current, remoteRef.current, () => setConnected(true), setError);
      } catch (cause) {
        if (!cleanupRef.current) mediaStream?.getTracks().forEach((track) => track.stop());
        if (active) setError(cause instanceof Error ? cause.message : 'Could not open the call.');
      } finally { if (active) setLoading(false); }
    });
    return () => { active = false; unsubscribe(); void cleanupRef.current?.(); };
  }, [callId]);

  const endCall = async () => {
    await cleanupRef.current?.();
    cleanupRef.current = null;
    try { await endCallRequest(callId); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not end the call.'); }
    navigate('/agent', { replace: true });
  };

  const caller = call?.caller;
  return <main className="fixed inset-0 z-[120] overflow-y-auto bg-[#080A09] text-[#DEDBD2]">
    <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col px-4 py-5 sm:px-8 sm:py-7">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#252D27] pb-4">
        <Link to="/agent" className="inline-flex items-center gap-2 text-sm text-[#C5A059]"><ArrowLeft className="h-4 w-4"/> Agent desk</Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">{call?.mode === 'video' ? <Video className="h-4 w-4 text-[#C5A059]"/> : <PhoneCall className="h-4 w-4 text-[#C5A059]"/>}{call?.mode || 'Call'} · {connected ? 'Connected' : loading ? 'Connecting' : 'Call in progress'}</div>
        <button onClick={() => void endCall()} disabled={!call} className="inline-flex items-center gap-2 rounded bg-red-900 px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-50"><PhoneOff className="h-4 w-4"/> End call</button>
      </header>

      {error && <p role="alert" className="mb-4 rounded border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      {!user && !loading && <section className="m-auto rounded-xl border border-[#303831] bg-[#111412] p-8 text-center"><h1 className="text-xl font-bold text-white">Agent sign-in required</h1><Link className="mt-4 inline-block text-[#C5A059]" to="/agent">Return to agent desk</Link></section>}
      {loading && <p className="m-auto text-sm text-[#A8A498]">Connecting to the customer…</p>}
      {call && <div className="grid flex-1 content-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {call.mode === 'video' ? <section className="grid content-start gap-3 sm:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#303831] bg-black"><div ref={remoteRef} className="absolute inset-0"/><span className="absolute bottom-3 left-3 rounded bg-black/70 px-3 py-1 text-xs">Customer</span></div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#303831] bg-black"><div ref={localRef} className="absolute inset-0"/><span className="absolute bottom-3 left-3 rounded bg-black/70 px-3 py-1 text-xs">You</span></div>
        </section> : <section className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#303831] bg-gradient-to-br from-[#17211A] to-[#0B0D0C] p-8"><div className="text-center"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#3B463D] bg-[#18261E] text-emerald-300"><UserRound className="h-12 w-12"/></div><h1 className="mt-5 text-3xl font-bold text-white">{caller?.name || caller?.email || 'Customer'}</h1><p className="mt-2 text-sm text-[#A8A498]">Voice call {connected ? 'connected' : 'in progress'}</p><div ref={remoteRef} className="sr-only"/><div ref={localRef} className="hidden"/></div></section>}

        <aside className="rounded-2xl border border-[#303831] bg-[#111412] p-5 sm:p-6">
          <div className="text-[10px] font-bold uppercase tracking-[.22em] text-[#C5A059]">Customer identity</div>
          <h2 className="mt-2 break-words text-2xl font-bold text-white">{caller?.name || 'Name not provided'}</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Email</dt><dd className="mt-1 break-all text-[#DEDBD2]">{caller?.email || 'Not provided'}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Phone</dt><dd className="mt-1 text-[#DEDBD2]">{caller?.phone || 'Not provided'}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Customer ID</dt><dd className="mt-1 break-all font-mono text-xs text-[#DEDBD2]">{call.callerUid || 'Not recorded'}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Agent ID</dt><dd className="mt-1 break-all font-mono text-xs text-[#DEDBD2]">{call.agentUid || 'Not recorded'}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Call ID</dt><dd className="mt-1 break-all font-mono text-xs text-[#DEDBD2]">{call.id}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Channel</dt><dd className="mt-1 break-all font-mono text-xs text-[#DEDBD2]">{call.channel || 'Not recorded'}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Call type / status</dt><dd className="mt-1 capitalize text-[#DEDBD2]">{call.mode} / {call.status}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Started</dt><dd className="mt-1 text-[#DEDBD2]">{recordedDate(call.createdAt)}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Accepted</dt><dd className="mt-1 text-[#DEDBD2]">{recordedDate(call.acceptedAt)}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-[#858177]">Missed / ended</dt><dd className="mt-1 text-[#DEDBD2]">{recordedDate(call.missedAt || call.endedAt)}</dd></div>
          </dl>
        </aside>
      </div>}
    </div>
  </main>;
};
