import { io, type Socket } from 'socket.io-client';
import { apiRequest, backendUrl, getBackendToken } from './api';

export type CallMode = 'voice' | 'video';
export type CallStatus = 'ringing' | 'accepted' | 'declined' | 'ended' | 'missed';
export type CallRole = 'caller' | 'agent';
export interface CallRequest { id: string; mode: CallMode; channel: string; callerUid: string; status: CallStatus; createdAt?: string; }

export async function createCallRequest(mode: CallMode): Promise<string> {
  const { call } = await apiRequest<{ call: CallRequest }>('/v1/calls', { method: 'POST', body: JSON.stringify({ mode }) });
  return call.id;
}
export async function getCall(callId: string) {
  const { call } = await apiRequest<{ call: CallRequest }>(`/v1/calls/${encodeURIComponent(callId)}`);
  return call;
}
export async function endCallRequest(callId: string) {
  await apiRequest(`/v1/calls/${encodeURIComponent(callId)}/end`, { method: 'POST', body: '{}' });
}
export function listenToCall(callId: string, onChange: (call: CallRequest | null) => void, onError: (error: Error) => void) {
  let stopped = false;
  const poll = async () => {
    try { const call = await getCall(callId); if (!stopped) onChange(call); }
    catch (error) { if (!stopped) onError(error instanceof Error ? error : new Error('Call status unavailable.')); }
  };
  void poll();
  const timer = setInterval(() => void poll(), 1800);
  return () => { stopped = true; clearInterval(timer); };
}

export async function connectWebRTCCall(callId: string, role: CallRole, mode: CallMode, localStream: MediaStream,
  localContainer: HTMLElement | null, remoteContainer: HTMLElement | null, onConnected: () => void, onError: (message: string) => void) {
  const token = getBackendToken();
  if (!token) throw new Error('Sign in is required before joining a call.');
  const call = await getCall(callId);
  if (call.status !== 'accepted') throw new Error('The accepted call request could not be found.');
  const socket: Socket = io(backendUrl(''), { auth: { token }, transports: ['websocket', 'polling'] });
  const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  const remote = new MediaStream();
  const pending: RTCIceCandidateInit[] = [];
  let hasRemoteDescription = false;
  let closed = false;
  const media = document.createElement(mode === 'video' ? 'video' : 'audio');
  media.autoplay = true;
  if (media instanceof HTMLVideoElement) { media.playsInline = true; media.className = 'h-full w-full object-cover'; }
  if (remoteContainer) remoteContainer.replaceChildren(media);
  if (localContainer && localStream.getVideoTracks().length) {
    const video = localContainer.querySelector('video') ?? document.createElement('video');
    video.autoplay = true; video.muted = true; video.playsInline = true; video.className = 'absolute inset-0 h-full w-full object-cover'; video.srcObject = localStream;
    if (!localContainer.contains(video)) localContainer.append(video);
  }
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
  peer.ontrack = (event) => { if (!remote.getTracks().some((track) => track.id === event.track.id)) remote.addTrack(event.track); media.srcObject = remote; void media.play().catch(() => onError('Could not play incoming call audio/video.')); };
  peer.onconnectionstatechange = () => { if (peer.connectionState === 'connected') onConnected(); if (['failed', 'disconnected'].includes(peer.connectionState)) onError(`Call connection ${peer.connectionState}. Check network access.`); };
  const apply = async (candidate: RTCIceCandidateInit) => { try { if (!hasRemoteDescription) pending.push(candidate); else await peer.addIceCandidate(candidate); } catch (error) { onError(error instanceof Error ? error.message : 'Could not add network candidate.'); } };
  const applyPending = async () => { hasRemoteDescription = true; await Promise.all(pending.splice(0).map((candidate) => peer.addIceCandidate(candidate))); };
  socket.on('connect', () => socket.emit('join-call', { callId, role }));
  let offerStarted = false;
  const startOffer = (peerPresent: boolean) => {
    if (role !== 'agent' || !peerPresent || offerStarted || peer.signalingState !== 'stable') return;
    offerStarted = true;
    void (async () => {
      try { const offer = await peer.createOffer(); await peer.setLocalDescription(offer); socket.emit('offer', { description: peer.localDescription?.toJSON() }); }
      catch (error) { onError(error instanceof Error ? error.message : 'Could not start the call.'); }
    })();
  };
  socket.on('room-ready', ({ peerCount }: { peerCount: number }) => startOffer(peerCount >= 2));
  socket.on('peer-joined', ({ role: joinedRole }: { role: string }) => startOffer(joinedRole === 'caller'));
  socket.on('ice-server-config', (servers: RTCIceServer[]) => peer.setConfiguration({ iceServers: servers }));
  socket.on('call-error', ({ message }: { message: string }) => onError(message));
  socket.on('ice-candidate', ({ candidate }: { candidate: RTCIceCandidateInit }) => void apply(candidate));
  socket.on('offer', async ({ description }: { description: RTCSessionDescriptionInit }) => {
    if (role !== 'caller' || peer.signalingState !== 'stable') return;
    try { await peer.setRemoteDescription(description); await applyPending(); const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); socket.emit('answer', { description: peer.localDescription?.toJSON() }); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not answer the call.'); }
  });
  socket.on('answer', async ({ description }: { description: RTCSessionDescriptionInit }) => {
    if (role !== 'agent' || peer.signalingState !== 'have-local-offer') return;
    try { await peer.setRemoteDescription(description); await applyPending(); } catch (error) { onError(error instanceof Error ? error.message : 'Could not connect the call.'); }
  });
  peer.onicecandidate = (event) => { if (event.candidate && !closed) socket.emit('ice-candidate', { candidate: event.candidate.toJSON() }); };
  return async () => { closed = true; socket.disconnect(); peer.close(); localStream.getTracks().forEach((track) => track.stop()); media.srcObject = null; localContainer?.replaceChildren(); remoteContainer?.replaceChildren(); };
}

