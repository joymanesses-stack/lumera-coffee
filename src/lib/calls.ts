import { io } from 'socket.io-client';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { requireFirebase } from './firebase';

export type CallMode = 'voice' | 'video';
export type CallStatus = 'ringing' | 'accepted' | 'declined' | 'ended';
export type CallRole = 'caller' | 'agent';

export interface CallRequest {
  id: string;
  mode: CallMode;
  channel: string;
  callerUid: string;
  status: CallStatus;
}

export async function createCallRequest(mode: CallMode): Promise<string> {
  const { auth, db } = requireFirebase();
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const call = await addDoc(collection(db, 'calls'), {
    mode,
    channel: `lumera-${crypto.randomUUID()}`,
    callerUid: user.uid,
    status: 'ringing',
    createdAt: serverTimestamp(),
  });
  return call.id;
}

export function listenToCall(
  callId: string,
  onChange: (call: CallRequest | null) => void,
  onError: (error: Error) => void
) {
  const { db } = requireFirebase();
  return onSnapshot(
    doc(db, 'calls', callId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }
      onChange({ id: snapshot.id, ...snapshot.data() } as CallRequest);
    },
    onError
  );
}

export async function endCallRequest(callId: string) {
  const { db } = requireFirebase();
  await updateDoc(doc(db, 'calls', callId), {
    status: 'ended',
    endedAt: serverTimestamp(),
  });
}

export async function connectWebRTCCall(
  callId: string,
  role: CallRole,
  mode: CallMode,
  localStream: MediaStream,
  localContainer: HTMLElement | null,
  remoteContainer: HTMLElement | null,
  onConnected: () => void,
  onError: (message: string) => void
) {
  const { auth, db } = requireFirebase();
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in is required before joining a call.');

  const serverUrl = import.meta.env.VITE_SIGNALING_SERVER_URL;
  if (!serverUrl) throw new Error('Add VITE_SIGNALING_SERVER_URL to .env.local and start the signaling server.');

  const snapshot = await getDoc(doc(db, 'calls', callId));
  if (!snapshot.exists() || snapshot.data().status !== 'accepted') {
    throw new Error('The accepted call request could not be found.');
  }

  const idToken = await user.getIdToken();
  const socket = io(serverUrl, { auth: { token: idToken, callId }, transports: ['websocket', 'polling'] });
  const peer = new RTCPeerConnection();
  const remoteStream = new MediaStream();
  const pendingCandidates: RTCIceCandidateInit[] = [];
  let hasRemoteDescription = false;
  const mediaElement = document.createElement(mode === 'video' ? 'video' : 'audio');
  mediaElement.autoplay = true;
  if (mediaElement instanceof HTMLVideoElement) {
    mediaElement.playsInline = true;
    mediaElement.muted = false;
    mediaElement.className = 'h-full w-full object-cover';
  }
  if (remoteContainer) remoteContainer.replaceChildren(mediaElement);
  if (localContainer && localStream.getVideoTracks().length > 0) {
    const localVideo = localContainer.querySelector('video') ?? document.createElement('video');
    localVideo.autoplay = true;
    localVideo.muted = true;
    localVideo.playsInline = true;
    localVideo.className = 'absolute inset-0 h-full w-full object-cover';
    localVideo.srcObject = localStream;
    if (!localContainer.contains(localVideo)) localContainer.append(localVideo);
  }

  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
  peer.ontrack = (event) => {
    if (!remoteStream.getTracks().some((track) => track.id === event.track.id)) {
      remoteStream.addTrack(event.track);
    }
    mediaElement.srcObject = remoteStream;
    void mediaElement.play().catch(() => onError('Could not play incoming call audio/video. Check browser autoplay permissions.'));
  };
  peer.onconnectionstatechange = () => {
    if (peer.connectionState === 'connected') onConnected();
    if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
      onError(`Call connection ${peer.connectionState}. Check network access and TURN server configuration.`);
    }
  };
  peer.onicecandidate = (event) => {
    if (event.candidate) socket.emit('ice-candidate', { candidate: event.candidate.toJSON() });
  };

  const close = async () => {
    socket.disconnect();
    peer.close();
    localStream.getTracks().forEach((track) => track.stop());
    mediaElement.srcObject = null;
    localContainer?.replaceChildren();
    remoteContainer?.replaceChildren();
  };

  socket.on('connect_error', (error) => onError(`Call signaling failed: ${error.message}`));
  socket.on('call-error', ({ message }: { message: string }) => onError(message));
  socket.on('peer-left', () => onError('The other participant left the call.'));
  socket.on('ice-server-config', (servers: RTCIceServer[]) => {
    peer.setConfiguration({ iceServers: servers });
  });
  socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
    try {
      if (!hasRemoteDescription) pendingCandidates.push(candidate);
      else await peer.addIceCandidate(candidate);
    } catch (error) {
      onError(error instanceof Error ? `Could not add network candidate: ${error.message}` : 'Could not add network candidate.');
    }
  });
  socket.on('offer', async ({ description }: { description: RTCSessionDescriptionInit }) => {
    try {
      await peer.setRemoteDescription(description);
      hasRemoteDescription = true;
      await Promise.all(pendingCandidates.splice(0).map((candidate) => peer.addIceCandidate(candidate)));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('answer', { description: peer.localDescription?.toJSON() });
    } catch (error) {
      onError(error instanceof Error ? `Could not answer the call: ${error.message}` : 'Could not answer the call.');
    }
  });
  socket.on('answer', async ({ description }: { description: RTCSessionDescriptionInit }) => {
    try {
      await peer.setRemoteDescription(description);
      hasRemoteDescription = true;
      await Promise.all(pendingCandidates.splice(0).map((candidate) => peer.addIceCandidate(candidate)));
    } catch (error) {
      onError(error instanceof Error ? `Could not connect the call: ${error.message}` : 'Could not connect the call.');
    }
  });
  socket.on('peer-joined', async ({ role: peerRole }: { role: CallRole }) => {
    if (role !== 'agent' || peerRole !== 'caller' || peer.signalingState !== 'stable') return;
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('offer', { description: peer.localDescription?.toJSON() });
    } catch (error) {
      onError(error instanceof Error ? `Could not start the call: ${error.message}` : 'Could not start the call.');
    }
  });
  socket.on('room-ready', async ({ peerCount }: { peerCount: number }) => {
    if (role !== 'agent' || peerCount < 2 || peer.signalingState !== 'stable') return;
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('offer', { description: peer.localDescription?.toJSON() });
    } catch (error) {
      onError(error instanceof Error ? `Could not start the call: ${error.message}` : 'Could not start the call.');
    }
  });
  socket.emit('join-call', { callId, role });

  return close;
}
