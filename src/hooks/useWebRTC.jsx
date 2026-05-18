import { useEffect, useRef, useState } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// ✅ FIXED: Configured valid public Google STUN nodes to break through firewalls/routers
const servers = {
  iceServers: [
    { urls: "stun:://google.com" },
    { urls: "stun:://google.com" },
    { urls: "stun:://google.com" },
  ],
  iceCandidatePoolSize: 10,
};

const useWebRTC = (roomId, userId, isCaller) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const unsubscribeRef = useRef(null);
  const processedCandidates = useRef(new Set());

  // Safe buffer queue to hold candidates until the connection description is ready
  const iceCandidatesQueue = useRef([]);

  useEffect(() => {
    if (!roomId || !userId) return;

    start();

    return () => {
      console.log("Cleaning up WebRTC session...");
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }

      processedCandidates.current.clear();
      iceCandidatesQueue.current = [];
    };
  }, [roomId, userId]);

  const processQueuedCandidates = async () => {
    if (!peerConnection.current || !peerConnection.current.remoteDescription)
      return;

    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
        console.log("✅ Buffered ICE Candidate successfully added to peer.");
      } catch (err) {
        console.warn("ICE application failure:", err);
      }
    }
  };

  const start = async () => {
    try {
      // 1. ACCESS HARDWARE MEDIA
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      // 2. CONSTRUCT PEER LINES WITH FIXED STUN CHANNELS
      peerConnection.current = new RTCPeerConnection(servers);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // 3. REMOTE STREAM RACING ENGINE
      peerConnection.current.ontrack = (event) => {
        console.log("📡 Raw tracks received from remote peer.");
        if (event.streams && event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          setRemoteStream(event.streams[0]);
        } else {
          if (!remoteStreamRef.current) {
            remoteStreamRef.current = new MediaStream();
            setRemoteStream(remoteStreamRef.current);
          }
          remoteStreamRef.current.addTrack(event.track);
          setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()));
        }
      };

      const roomRef = doc(db, "videoRooms", roomId);

      // 4. ICE CANDIDATES GENERATION CHANNEL
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;
        try {
          await updateDoc(roomRef, {
            [isCaller ? "offerCandidates" : "answerCandidates"]: arrayUnion(
              event.candidate.toJSON(),
            ),
          });
        } catch (err) {
          console.error("ICE transport drop:", err);
        }
      };

      // 5. COMMENCE HANDSHAKE EXCHANGES
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (!roomData) return;

      if (isCaller && !roomData.offer) {
        console.log("Creating WebRTC Signal Offer...");
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await updateDoc(roomRef, {
          offer: offer.toJSON(),
        });
      }

      // 6. SYNCHRONIZATION EVENT BOUNDARY LISTENERS
      unsubscribeRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data || !peerConnection.current) return;

        // PROCESS OFFER (CALLEE)
        if (
          data.offer &&
          !isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log(
            "Processing Offer signals, returning Answer channel payload...",
          );
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await updateDoc(roomRef, {
            answer: answer.toJSON(),
          });

          // Flash queued candidates now that remote description state is active
          await processQueuedCandidates();
        }

        // PROCESS ANSWER (CALLER)
        if (
          data.answer &&
          isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log(
            "Handshake confirmed by client. Initializing video render pipelines...",
          );
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );

          // Flash queued candidates now that remote description state is active
          await processQueuedCandidates();
        }

        // CANDIDATES SET PARSING ENGINE WITH DELAY PROTECTION
        const candidates = isCaller
          ? data.answerCandidates
          : data.offerCandidates;

        if (candidates?.length) {
          for (const candidate of candidates) {
            const key = JSON.stringify(candidate);

            if (processedCandidates.current.has(key)) continue;
            processedCandidates.current.add(key);

            // If the connection description isn't ready yet, queue the candidates safely
            if (!peerConnection.current.remoteDescription) {
              iceCandidatesQueue.current.push(candidate);
            } else {
              try {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(candidate),
                );
              } catch (err) {
                console.warn("ICE skipped:", err);
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("WebRTC Critical Initiation Failure:", error);
    }
  };

  return {
    localStream,
    remoteStream,
  };
};

export default useWebRTC;
