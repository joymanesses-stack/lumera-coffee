import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
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

  const callRef = doc(db, 'calls', callId);
  const snapshot = await getDoc(callRef);
  if (!snapshot.exists() || snapshot.data().status !== 'accepted') {
    throw new Error('The accepted call request could not be found.');
  }

  const peer = new RTCPeerConnection();
  const remoteStream = new MediaStream();
  const pendingCandidates: RTCIceCandidateInit[] = [];
  let hasRemoteDescription = false;
  let closed = false;
  const signaling = collection(callRef, 'signaling');
  const ownCandidates = collection(signaling, role === 'caller' ? 'callerCandidates' : 'agentCandidates');
  const remoteCandidates = collection(signaling, role === 'caller' ? 'agentCandidates' : 'callerCandidates');
  const unsubscribers: Array<() => void> = [];
  const iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];
  peer.setConfiguration({ iceServers });
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
      onError(`Call connection ${peer.connectionState}. Check network access. Some restricted networks require a TURN relay.`);
    }
  };
  peer.onicecandidate = (event) => {
    if (!event.candidate || closed) return;
    void addDoc(ownCandidates, {
      candidate: event.candidate.toJSON(),
      createdAt: serverTimestamp(),
    }).catch((error: unknown) => {
      onError(error instanceof Error ? `Could not share network candidate: ${error.message}` : 'Could not share network candidate.');
    });
  };

  const close = async () => {
    closed = true;
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    peer.close();
    localStream.getTracks().forEach((track) => track.stop());
    mediaElement.srcObject = null;
    localContainer?.replaceChildren();
    remoteContainer?.replaceChildren();
  };

  const applyCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (!hasRemoteDescription) pendingCandidates.push(candidate);
      else await peer.addIceCandidate(candidate);
    } catch (error) {
      onError(error instanceof Error ? `Could not add network candidate: ${error.message}` : 'Could not add network candidate.');
    }
  };
  unsubscribers.push(onSnapshot(remoteCandidates, (changes) => {
    changes.docChanges().forEach((change) => {
      if (change.type === 'added') {
        void applyCandidate(change.doc.data().candidate as RTCIceCandidateInit);
      }
    });
  }, (error) => onError(`Call signaling failed: ${error.message}`)));

  const applyPendingCandidates = async () => {
    hasRemoteDescription = true;
    await Promise.all(pendingCandidates.splice(0).map((candidate) => peer.addIceCandidate(candidate)));
  };
  const answerRef = doc(signaling, 'answer');
  const offerRef = doc(signaling, 'offer');

  if (role === 'caller') {
    unsubscribers.push(onSnapshot(offerRef, (offerSnapshot) => {
      if (!offerSnapshot.exists() || peer.signalingState !== 'stable') return;
      void (async () => {
        try {
          const description = offerSnapshot.data().description as RTCSessionDescriptionInit;
          await peer.setRemoteDescription(description);
          await applyPendingCandidates();
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await setDoc(answerRef, {
            description: peer.localDescription?.toJSON(),
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          onError(error instanceof Error ? `Could not answer the call: ${error.message}` : 'Could not answer the call.');
        }
      })();
    }, (error) => onError(`Call signaling failed: ${error.message}`)));
  } else {
    unsubscribers.push(onSnapshot(answerRef, (answerSnapshot) => {
      if (!answerSnapshot.exists() || peer.signalingState !== 'have-local-offer') return;
      void (async () => {
        try {
          await peer.setRemoteDescription(answerSnapshot.data().description as RTCSessionDescriptionInit);
          await applyPendingCandidates();
        } catch (error) {
          onError(error instanceof Error ? `Could not connect the call: ${error.message}` : 'Could not connect the call.');
        }
      })();
    }, (error) => onError(`Call signaling failed: ${error.message}`)));

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await setDoc(offerRef, {
        description: peer.localDescription?.toJSON(),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      onError(error instanceof Error ? `Could not start the call: ${error.message}` : 'Could not start the call.');
    }
  }

  return close;
}
