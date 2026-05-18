import { useEffect, useRef, useState, useCallback } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// ✅ Correct STUN Servers
const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
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

  const iceCandidatesQueue = useRef([]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log("Cleaning up WebRTC session...");

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    processedCandidates.current.clear();
    iceCandidatesQueue.current = [];
  }, []);

  // Main effect
  useEffect(() => {
    if (!roomId || !userId) return;

    startWebRTC();

    return cleanup;
  }, [roomId, userId, isCaller, cleanup]); // Added isCaller to dependencies

  const processQueuedCandidates = async () => {
    if (!peerConnection.current?.remoteDescription) return;

    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
        console.log("✅ Buffered ICE Candidate added");
      } catch (err) {
        console.warn("Failed to add buffered ICE candidate:", err);
      }
    }
  };

  const startWebRTC = async () => {
    try {
      // 1. Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      // 2. Create Peer Connection
      peerConnection.current = new RTCPeerConnection(servers);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // 3. Handle Remote Tracks
      peerConnection.current.ontrack = (event) => {
        console.log("📡 Remote stream received");
        const stream = event.streams[0] || new MediaStream([event.track]);
        remoteStreamRef.current = stream;
        setRemoteStream(stream);
      };

      const roomRef = doc(db, "videoRooms", roomId);

      // 4. ICE Candidates
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;

        try {
          await updateDoc(roomRef, {
            [isCaller ? "offerCandidates" : "answerCandidates"]: arrayUnion(
              event.candidate.toJSON(),
            ),
          });
        } catch (err) {
          console.error("Failed to save ICE candidate:", err);
        }
      };

      // 5. Initial Offer (Caller only)
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (isCaller && roomData && !roomData.offer) {
        console.log("Creating Offer...");
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await updateDoc(roomRef, {
          offer: offer.toJSON(),
        });
      }

      // 6. Listen for signaling changes
      unsubscribeRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data || !peerConnection.current) return;

        // Handle Offer (Callee)
        if (
          data.offer &&
          !isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log("Processing remote offer...");
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await updateDoc(roomRef, {
            answer: answer.toJSON(),
          });

          await processQueuedCandidates();
        }

        // Handle Answer (Caller)
        if (
          data.answer &&
          isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log("Processing remote answer...");
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
          await processQueuedCandidates();
        }

        // Handle ICE Candidates
        const candidates = isCaller
          ? data.answerCandidates
          : data.offerCandidates;

        if (candidates?.length) {
          for (const candidate of candidates) {
            const key = JSON.stringify(candidate);
            if (processedCandidates.current.has(key)) continue;

            processedCandidates.current.add(key);

            if (!peerConnection.current.remoteDescription) {
              iceCandidatesQueue.current.push(candidate);
            } else {
              try {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(candidate),
                );
              } catch (err) {
                console.warn("ICE candidate skipped:", err);
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("WebRTC Critical Failure:", error);
      // You can add a toast or alert here if needed
    }
  };

  return { localStream, remoteStream };
};

export default useWebRTC;
