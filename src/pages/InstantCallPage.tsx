import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PhoneCall, Video, Bot, ShieldCheck, Sparkles, PhoneOff, LoaderCircle } from 'lucide-react';
import {
  connectWebRTCCall,
  createCallRequest,
  endCallRequest,
  listenToCall,
  type CallMode,
  type CallStatus,
} from '../lib/calls';
import { firebaseConfigured } from '../lib/firebase';

export const InstantCallPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<CallMode>('voice');
  const [isCalling, setIsCalling] = useState(false);
  const [callError, setCallError] = useState('');
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [ringError, setRingError] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callRequestRef = useRef(0);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const localCallRef = useRef<HTMLDivElement>(null);
  const remoteCallRef = useRef<HTMLDivElement>(null);
  const callCleanupRef = useRef<(() => Promise<void>) | null>(null);
  const joinedCallIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => () => {
    callRequestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    void audioContextRef.current?.close();
    void callCleanupRef.current?.();
  }, []);

  useEffect(() => {
    if (!callId || !isCalling) return;
    return listenToCall(
      callId,
      (call) => {
        if (!call) {
          setCallError('The call request could not be found.');
          return;
        }
        setCallStatus(call.status);
        if (call.status === 'accepted' && joinedCallIdRef.current !== call.id) {
          joinedCallIdRef.current = call.id;
          stopRingtone();
          const activeStream = streamRef.current;
          if (!activeStream) {
            setCallError('Your microphone or camera stream is unavailable.');
            return;
          }
          void connectWebRTCCall(
            call.id,
            'caller',
            call.mode,
            activeStream,
            localCallRef.current,
            remoteCallRef.current,
            () => setIsCallConnected(true),
            setCallError
          )
            .then((cleanup) => {
              callCleanupRef.current = cleanup;
            })
            .catch(async (error: unknown) => {
              setCallError(error instanceof Error ? error.message : 'Could not join the call.');
              try {
                await endCallRequest(call.id);
              } catch (endError) {
                setCallError((current) => `${current} Call cleanup failed: ${endError instanceof Error ? endError.message : 'unknown Firestore error'}`);
              }
            });
        }
        if (call.status === 'declined' || call.status === 'ended') {
          stopRingtone();
          void callCleanupRef.current?.();
          callCleanupRef.current = null;
          setIsCallConnected(false);
        }
      },
      (error) => setCallError(`Call updates unavailable: ${error.message}`)
    );
  }, [callId, isCalling]);

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    const audioContext = audioContextRef.current;
    audioContextRef.current = null;
    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close();
    }
  };

  const startRingtone = () => {
    stopRingtone();
    setRingError('');
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const ringOnce = () => {
        if (audioContext.state !== 'running') return;
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, audioContext.currentTime + 0.65);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.9);
        gain.connect(audioContext.destination);

        [440, 480].forEach((frequency) => {
          const oscillator = audioContext.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          oscillator.connect(gain);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.9);
        });
      };

      void audioContext.resume().then(() => {
        if (audioContextRef.current !== audioContext) return;
        ringOnce();
        ringIntervalRef.current = setInterval(ringOnce, 2500);
      }).catch(() => {
        setRingError('Your browser could not play the ringtone. Check your sound settings.');
      });
    } catch {
      setRingError('Ringtone audio is not supported by this browser.');
    }
  };

  const startCall = async () => {
    const requestId = ++callRequestRef.current;
    setCallError('');
    setCallStatus(null);
    setCallId(null);
    setIsCallConnected(false);
    joinedCallIdRef.current = null;
    setIsCalling(true);

    if (!firebaseConfigured) {
      setCallError('Firebase is missing from this deployed build. Add all six VITE_FIREBASE_* web-app values in Netlify Site configuration → Environment variables, then redeploy the site.');
      return;
    }

    startRingtone();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedMode === 'video',
        audio: true,
      });
      if (requestId !== callRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      setLocalStream(stream);
      const newCallId = await createCallRequest(selectedMode);
      if (requestId !== callRequestRef.current) {
        await endCallRequest(newCallId);
        return;
      }
      setCallId(newCallId);
      setCallStatus('ringing');
    } catch (error) {
      if (requestId === callRequestRef.current) {
        stopRingtone();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setLocalStream(null);
        const reason = error instanceof Error ? error.message : 'Unknown call setup error.';
        setCallError(`Could not start the call. Check microphone/camera permissions and Firebase setup. ${reason}`);
      }
    }
  };

  const endCall = async () => {
    callRequestRef.current += 1;
    stopRingtone();
    if (callId) {
      try {
        await endCallRequest(callId);
      } catch (error) {
        setCallError(error instanceof Error ? `The call ended locally, but the request could not be closed: ${error.message}` : 'The call request could not be closed.');
      }
    }
    await callCleanupRef.current?.();
    callCleanupRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLocalStream(null);
    setCallStatus('ended');
    setCallId(null);
    setIsCallConnected(false);
    joinedCallIdRef.current = null;
    setRingError('');
    setIsCalling(false);
  };

  const activeTitle = selectedMode === 'voice' ? 'Simple Call' : 'Video Call';
  const activeDescription = selectedMode === 'voice'
    ? 'Speak directly with the Lumera Agent for immediate order discussions and export guidance.'
    : 'Start a face-to-face conversation with the Lumera Agent for product reviews and quick walkthroughs.';

  return (
    <div className="pt-36 sm:pt-40 pb-24 bg-[#0B0D0C] min-h-screen">
      <section className="relative py-16 bg-[#0E1110] border-b border-[#1E241F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to contact desk</span>
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C5A059] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Contact</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white font-display leading-tight">
              Talk to the Lumera Agent
            </h1>
            <p className="text-sm sm:text-base text-[#A8A498] max-w-2xl mx-auto mt-4 font-light leading-relaxed">
              Choose a quick voice or video conversation and our agent will answer in real time to help with product questions, export logistics, or next-step guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-[#111412] border border-[#242C26] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                disabled={isCalling}
                onClick={() => {
                  setSelectedMode('voice');
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedMode === 'voice'
                    ? 'border-[#C5A059] bg-[#1A211D] text-white shadow-lg shadow-[#C5A059]/10'
                    : 'border-[#222A25] bg-[#0D110F] text-[#D1CDBE] hover:border-[#C5A059]/50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#18261E] border border-[#2B3E31] flex items-center justify-center text-emerald-400 mb-4">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Simple Call</div>
                <div className="text-lg font-semibold font-display">Voice conversation</div>
              </button>

              <button
                type="button"
                disabled={isCalling}
                onClick={() => {
                  setSelectedMode('video');
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedMode === 'video'
                    ? 'border-[#C5A059] bg-[#1A211D] text-white shadow-lg shadow-[#C5A059]/10'
                    : 'border-[#222A25] bg-[#0D110F] text-[#D1CDBE] hover:border-[#C5A059]/50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#1F1B10] border border-[#4A3B1C] flex items-center justify-center text-[#C5A059] mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-2">Video Call</div>
                <div className="text-lg font-semibold font-display">Face-to-face meeting</div>
              </button>
            </div>

            <div className="rounded-2xl border border-[#222A25] bg-[#0B0D0C] p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-bold">Selected option</div>
                  <h2 className="text-2xl font-bold text-white font-display mt-2">{activeTitle}</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#18261E] border border-[#2A382F] flex items-center justify-center text-[#C5A059]">
                  {selectedMode === 'voice' ? <PhoneCall className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
              </div>

              <p className="text-sm text-[#A8A498] leading-relaxed mb-6">
                {activeDescription}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-[#D9D3C4]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Open a call window and wait for the Lumera Trade Agent</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D9D3C4]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Product and trade guidance tailored to your business</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D9D3C4]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Secure and professional buyer conversation</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void startCall()}
                disabled={isCalling}
                className="gold-button-gradient w-full py-3.5 rounded text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {selectedMode === 'voice' ? <PhoneCall className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span>{selectedMode === 'voice' ? 'Start Voice Call' : 'Start Video Call'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#121614] border border-[#232C25] rounded-xl p-6">
              <div className="flex items-center gap-2 text-[#C5A059] font-semibold uppercase tracking-wider text-[10px] mb-4">
                <Bot className="w-4 h-4" />
                <span>Lumera Agent Status</span>
              </div>

              <div className="rounded-xl border border-[#212923] bg-[#0B0D0C] p-4 text-sm text-[#CFC8B8]">
                <div className="flex items-center justify-between">
                  <span>Availability</span>
                  <span className="text-[#C5A059] font-medium">Ready for your call</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span>Response</span>
                  <span className="text-white font-medium">Waiting for agent</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span>Mode</span>
                  <span className="text-white font-medium">{selectedMode === 'voice' ? 'Voice' : 'Video'}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#23322B] bg-[#18261E] p-4">
                <div className="flex items-center gap-2 text-sm text-[#D9D3C4]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ready to handle buyer questions, shipment planning, and sample coordination.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {isCalling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-dialog-title"
            className="w-full max-w-xl rounded-2xl border border-[#343B34] bg-[#111412] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-bold">
                  {selectedMode === 'voice' ? 'Voice call' : 'Video call'}
                </div>
                <h2 id="call-dialog-title" className="mt-2 text-2xl font-bold text-white font-display">
                  {callStatus === 'declined' ? 'Agent unavailable' : callStatus === 'ended' ? 'Call ended' : 'Ringing Lumera Agent'}
                </h2>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#4A3B1C] bg-[#1F1B10] text-[#C5A059]">
                {selectedMode === 'voice' ? <PhoneCall className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </div>
            </div>

            {selectedMode === 'video' ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div ref={localCallRef} className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[#29312B] bg-[#080A09]">
                  {localStream && (
                    <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {!localStream && <span className="px-3 text-center text-xs text-[#A8A498]">Camera preview will appear here</span>}
                </div>
                <div ref={remoteCallRef} className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[#29312B] bg-[#080A09]">
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-[#29312B] bg-[#0B0D0C] py-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#3B463D] bg-[#18261E] text-emerald-400">
                  <Bot className="h-9 w-9" />
                </div>
                <p className="mt-5 text-sm text-[#D9D3C4]">Please wait while the agent picks up.</p>
                <div ref={remoteCallRef} className="hidden" />
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-[#E5C378]" aria-live="polite">
              {!isCallConnected && callStatus !== 'ended' && callStatus !== 'declined' && <LoaderCircle className="h-4 w-4 animate-spin" />}
              <span>
                {isCallConnected
                  ? 'Connected to the Lumera Agent'
                  : callStatus === 'accepted'
                    ? 'Agent picked up — joining the call'
                    : callStatus === 'declined'
                      ? 'The agent could not take this call'
                      : callStatus === 'ended'
                        ? 'This call has ended'
                        : callStatus === 'ringing'
                          ? 'Ringing — waiting for the agent to pick up'
                          : 'Preparing your call…'}
              </span>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-[#8E8A80]">
              {selectedMode === 'video' && localStream ? 'Your camera preview is live on this device while you wait.' : 'You can end the call at any time.'}
            </p>
            {ringError && <p role="alert" className="mt-3 text-center text-xs text-amber-300">{ringError}</p>}
            {callError && <p role="alert" className="mt-3 text-center text-xs text-amber-300">{callError}</p>}

            <button
              type="button"
              onClick={endCall}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#762E2E] py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#923838]"
            >
              <PhoneOff className="h-4 w-4" />
              <span>End Call</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
