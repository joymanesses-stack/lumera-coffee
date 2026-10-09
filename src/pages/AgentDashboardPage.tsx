import React, { useEffect, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { auth, db, firebaseConfigured } from '../lib/firebase';
import { connectWebRTCCall } from '../lib/calls';

interface Inquiry {
  id: string;
  contactName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  coffeeType?: string;
  quantityRequired?: string;
  message?: string;
  status?: string;
  createdAt?: Timestamp;
}

interface CallRequest {
  id: string;
  mode: 'voice' | 'video';
  channel: string;
  callerUid: string;
  status: string;
  createdAt?: Timestamp;
}

const formatDate = (timestamp?: Timestamp) =>
  timestamp?.toDate().toLocaleString() ?? 'Just received';

export const AgentDashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAgent, setIsAgent] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [checkingAgentAccess, setCheckingAgentAccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [calls, setCalls] = useState<CallRequest[]>([]);
  const [activeCall, setActiveCall] = useState<CallRequest | null>(null);
  const [callConnected, setCallConnected] = useState(false);
  const [incomingSoundOn, setIncomingSoundOn] = useState(false);
  const localCallRef = useRef<HTMLDivElement>(null);
  const remoteCallRef = useRef<HTMLDivElement>(null);
  const callCleanupRef = useRef<(() => Promise<void>) | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    void audioContextRef.current?.close();
  }, []);

  useEffect(() => () => {
    void callCleanupRef.current?.();
  }, []);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAgent(false);
      setAuthReady(true);
      setCheckingAgentAccess(Boolean(currentUser));
      if (currentUser) {
        try {
          const token = await currentUser.getIdTokenResult(true);
          setIsAgent(token.claims.agent === true);
        } catch {
          setError('Could not verify agent access. Please sign in again.');
        } finally {
          setCheckingAgentAccess(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!db || !user || !isAgent) return;

    const inquiryQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(50));
    const callQuery = query(
      collection(db, 'calls'),
      where('status', '==', 'ringing'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubscribeInquiries = onSnapshot(
      inquiryQuery,
      (snapshot) => setInquiries(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Inquiry))),
      (snapshotError) => setError(`Could not load inquiries: ${snapshotError.message}`)
    );
    const unsubscribeCalls = onSnapshot(
      callQuery,
      (snapshot) => setCalls(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as CallRequest))),
      (snapshotError) => setError(`Could not load incoming calls: ${snapshotError.message}`)
    );

    return () => {
      unsubscribeInquiries();
      unsubscribeCalls();
    };
  }, [user, isAgent]);

  useEffect(() => {
    const audioContext = audioContextRef.current;
    if (!incomingSoundOn || calls.length === 0 || !audioContext) return;

    const ringOnce = () => {
      if (audioContext.state !== 'running') return;
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.06);
      gain.gain.setValueAtTime(0.1, audioContext.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.85);
      gain.connect(audioContext.destination);
      [440, 480].forEach((frequency) => {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.85);
      });
    };

    ringOnce();
    const interval = setInterval(ringOnce, 2500);
    return () => clearInterval(interval);
  }, [calls.length, incomingSoundOn]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth) return;
    setLoginPending(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Could not sign in.');
    } finally {
      setLoginPending(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setInquiries([]);
    setCalls([]);
    setActiveCall(null);
  };

  const toggleIncomingSound = async () => {
    if (incomingSoundOn) {
      setIncomingSoundOn(false);
      return;
    }
    try {
      const audioContext = audioContextRef.current ?? new AudioContext();
      await audioContext.resume();
      audioContextRef.current = audioContext;
      setIncomingSoundOn(true);
    } catch {
      setError('The browser could not enable call sounds. Check browser sound permissions.');
    }
  };

  const updateInquiry = async (inquiryId: string, status: string) => {
    if (!db) return;
    setError('');
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), { status, updatedAt: serverTimestamp() });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update inquiry status.');
    }
  };

  const acceptCall = async (call: CallRequest) => {
    if (!db || !user) return;
    setError('');
    let callStream: MediaStream | null = null;
    try {
      callStream = await navigator.mediaDevices.getUserMedia({
        video: call.mode === 'video',
        audio: true,
      });
      await updateDoc(doc(db, 'calls', call.id), {
        status: 'accepted',
        agentUid: user.uid,
        acceptedAt: serverTimestamp(),
      });
      setActiveCall({ ...call, status: 'accepted' });
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      callCleanupRef.current = await connectWebRTCCall(
        call.id,
        'agent',
        call.mode,
        callStream,
        localCallRef.current,
        remoteCallRef.current,
        () => setCallConnected(true),
        setError
      );
    } catch (acceptError) {
      if (callCleanupRef.current) {
        await callCleanupRef.current();
        callCleanupRef.current = null;
      }
      callStream?.getTracks().forEach((track) => track.stop());
      setActiveCall(null);
      setCallConnected(false);
      let message = acceptError instanceof Error ? acceptError.message : 'Could not accept this call.';
      try {
        await updateDoc(doc(db, 'calls', call.id), { status: 'ended', endedAt: serverTimestamp() });
      } catch (statusError) {
        message += ` The call also could not be closed: ${statusError instanceof Error ? statusError.message : 'unknown Firestore error'}`;
      }
      setError(message);
    }
  };

  const closeCall = async () => {
    if (!db || !activeCall) return;
    try {
      await callCleanupRef.current?.();
      callCleanupRef.current = null;
      await updateDoc(doc(db, 'calls', activeCall.id), {
        status: 'ended',
        endedAt: serverTimestamp(),
      });
      setActiveCall(null);
      setCallConnected(false);
    } catch (endError) {
      setError(endError instanceof Error ? endError.message : 'Could not end this call.');
    }
  };

  if (!firebaseConfigured) {
    return (
      <main className="min-h-screen bg-[#0B0D0C] px-4 py-40 text-[#DEDBD2]">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#343B34] bg-[#111412] p-8">
          <AlertCircle className="mb-4 h-8 w-8 text-[#C5A059]" />
          <h1 className="text-2xl font-bold text-white font-display">Set up Firebase to open the agent desk</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#A8A498]">
            Add your Firebase web-app values to a local <code>.env.local</code> file using <code>.env.example</code> as the template, then enable Email/Password sign-in and Firestore.
          </p>
        </div>
      </main>
    );
  }

  if (!authReady || checkingAgentAccess) {
    return (
      <main className="min-h-screen bg-[#0B0D0C] px-4 py-40 text-center text-sm text-[#A8A498]">
        Checking Firebase sign-in and agent permissions…
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0B0D0C] px-4 py-40 text-[#DEDBD2]">
        <form onSubmit={handleSignIn} className="mx-auto max-w-md rounded-2xl border border-[#343B34] bg-[#111412] p-8">
          <ShieldCheck className="mb-4 h-8 w-8 text-[#C5A059]" />
          <h1 className="text-2xl font-bold text-white font-display">Lumera Agent Desk</h1>
          <p className="mt-2 text-sm text-[#A8A498]">Sign in with your authorized agent account.</p>
          <label className="mt-6 block text-xs text-[#CFC8B8]">
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="mt-4 block text-xs text-[#CFC8B8]">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded border border-[#303831] bg-[#0B0D0C] px-3 py-2.5 text-sm text-white"
            />
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loginPending}
            className="gold-button-gradient mt-6 w-full rounded py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-60"
          >
            {loginPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    );
  }

  if (!isAgent) {
    const isAnonymousAccount = user.isAnonymous;
    return (
      <main className="min-h-screen bg-[#0B0D0C] px-4 py-40 text-[#DEDBD2]">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#343B34] bg-[#111412] p-8">
          <AlertCircle className="mb-4 h-8 w-8 text-amber-300" />
          <h1 className="text-2xl font-bold text-white font-display">
            {isAnonymousAccount ? 'A customer session is active' : 'Agent access has not been granted'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#A8A498]">
            {isAnonymousAccount
              ? 'This browser was previously signed in anonymously to place a customer call. Sign out of that session, then sign in with your staff email and password.'
              : `Firebase is connected, but ${user.email || 'this account'} does not have the required agent permission. Grant this account the custom claim "agent: true" using the command in BACKEND_SETUP.md, then sign out and back in.`}
          </p>
          <button
            onClick={() => void handleSignOut()}
            className="mt-6 rounded bg-[#C5A059] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111412]"
          >
            Sign out and use agent email
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0D0C] px-4 pb-20 pt-36 text-[#DEDBD2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              <ShieldCheck className="h-4 w-4" /> Internal workspace
            </div>
            <h1 className="text-3xl font-bold text-white font-display sm:text-4xl">Lumera Agent Desk</h1>
            <p className="mt-2 text-sm text-[#A8A498]">Live buyer inquiries and incoming voice/video requests.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => void toggleIncomingSound()} className="inline-flex items-center gap-2 rounded border border-[#313831] px-4 py-2 text-xs text-[#CFC8B8] hover:border-[#C5A059]">
              <PhoneCall className="h-4 w-4" /> {incomingSoundOn ? 'Mute call sounds' : 'Enable call sounds'}
            </button>
            <button onClick={() => void handleSignOut()} className="inline-flex items-center gap-2 rounded border border-[#313831] px-4 py-2 text-xs text-[#CFC8B8] hover:border-[#C5A059]">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-start gap-2 rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Incoming calls</h2>
                <p className="mt-1 text-xs text-[#8E8A80]">Answer promptly; the caller is waiting.</p>
              </div>
              <span className="rounded-full bg-[#39251A] px-3 py-1 text-xs font-bold text-[#F0C36B]">{calls.length} ringing</span>
            </div>

            {activeCall && (
              <div className="mb-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  {activeCall.mode === 'video' ? <Video className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
                  {callConnected ? 'Connected' : 'Connecting'} — {activeCall.mode} call
                </div>
                {activeCall.mode === 'video' && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div ref={localCallRef} className="aspect-video overflow-hidden rounded-lg bg-black" />
                    <div ref={remoteCallRef} className="aspect-video overflow-hidden rounded-lg bg-black" />
                  </div>
                )}
                {activeCall.mode === 'voice' && (
                  <>
                    <div ref={localCallRef} className="hidden" />
                    <div ref={remoteCallRef} className="hidden" />
                  </>
                )}
                <p className="mt-2 break-all text-xs text-[#A8A498]">Room: {activeCall.channel}</p>
                <button onClick={() => void closeCall()} className="mt-4 rounded bg-[#762E2E] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">End call</button>
              </div>
            )}

            <div className="space-y-3">
              {calls.map((call) => (
                <article key={call.id} className="rounded-xl border border-[#303831] bg-[#0B0D0C] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-[#3A3E2D] bg-[#1F1B10] p-2 text-[#C5A059]">
                        {call.mode === 'video' ? <Video className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{call.mode === 'video' ? 'Video call request' : 'Voice call request'}</p>
                        <p className="mt-1 text-[11px] text-[#8E8A80]">{formatDate(call.createdAt)}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-300"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" /> Ringing</span>
                  </div>
                  <button onClick={() => void acceptCall(call)} disabled={!!activeCall} className="mt-4 w-full rounded bg-emerald-800 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 disabled:opacity-50">
                    Answer call
                  </button>
                </article>
              ))}
              {calls.length === 0 && !activeCall && (
                <div className="rounded-xl border border-dashed border-[#303831] px-4 py-10 text-center text-sm text-[#858177]">
                  <PhoneCall className="mx-auto mb-3 h-6 w-6 opacity-50" /> No calls are ringing right now.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#252D27] bg-[#111412] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Buyer inquiries</h2>
                <p className="mt-1 text-xs text-[#8E8A80]">New submissions from the website update here live.</p>
              </div>
              <span className="rounded-full bg-[#18261E] px-3 py-1 text-xs font-bold text-emerald-300">{inquiries.length} recent</span>
            </div>
            <div className="space-y-3">
              {inquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-xl border border-[#303831] bg-[#0B0D0C] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{inquiry.contactName || 'Buyer inquiry'}</h3>
                      <p className="mt-1 text-xs text-[#C5A059]">{inquiry.companyName || 'Company not provided'}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase text-[#9E998E]"><Clock3 className="h-3 w-3" /> {formatDate(inquiry.createdAt)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#B7B1A4]">
                    {inquiry.email && <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="h-3 w-3" />{inquiry.email}</a>}
                    {inquiry.phone && <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-1.5 hover:text-white"><PhoneCall className="h-3 w-3" />{inquiry.phone}</a>}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#9F9B90]">{inquiry.coffeeType} {inquiry.quantityRequired ? `· ${inquiry.quantityRequired}` : ''}</p>
                  {inquiry.message && <p className="mt-2 rounded-lg bg-[#141916] p-3 text-xs leading-relaxed text-[#CFC8B8]">{inquiry.message}</p>}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#8E8A80]">Status: {inquiry.status || 'new'}</span>
                    {inquiry.status !== 'contacted' && (
                      <button onClick={() => void updateInquiry(inquiry.id, 'contacted')} className="inline-flex items-center gap-1.5 rounded border border-[#3A493D] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 hover:bg-[#18261E]">
                        <CheckCircle2 className="h-3 w-3" /> Mark contacted
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {inquiries.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#303831] px-4 py-10 text-center text-sm text-[#858177]">
                  <RefreshCw className="mx-auto mb-3 h-6 w-6 opacity-50" /> Waiting for the first buyer inquiry.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
