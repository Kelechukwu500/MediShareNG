import { useEffect, useRef, useState } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useWebRTC = (roomId, userId, isCaller) => {
  // 🔥 FIXED: Converted to useState blocks so React tracks and renders stream changes instantly
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const unsubscribeRef = useRef(null);
  const processedCandidates = useRef(new Set());

  const servers = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    start();

    return () => {
      console.log("Cleaning up WebRTC session...");
      if (peerConnection.current) {
        peerConnection.current.getSenders().forEach((sender) => {
          if (sender.track) sender.track.stop();
        });
        peerConnection.current.close();
      }

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [roomId, userId]);

  const start = async () => {
    try {
      // ===========================
      // GET LOCAL CAMERA / MICROPHONE MEDIA
      // ===========================
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream); // 🔥 Trigger React render loop for local stream view

      // ===========================
      // INITIALIZE PEER CONNECTION
      // ===========================
      peerConnection.current = new RTCPeerConnection(servers);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // ===========================
      // REMOTE STREAM ENGINE (FIXED)
      // ===========================
      peerConnection.current.ontrack = (event) => {
        console.log("📡 Remote stream tracks received:", event.streams);
        if (event.streams && event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          setRemoteStream(event.streams[0]); // 🔥 Trigger React render loop for incoming peer view
        }
      };

      const roomRef = doc(db, "videoRooms", roomId);

      // ===========================
      // ICE CANDIDATES DISTRIBUTION CHANNEL
      // ===========================
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;

        try {
          await updateDoc(roomRef, {
            [isCaller ? "offerCandidates" : "answerCandidates"]: arrayUnion(
              event.candidate.toJSON(),
            ),
          });
        } catch (err) {
          console.error("Failed to upload ICE candidate:", err);
        }
      };

      // ===========================
      // SYNCHRONIZE DISCOVERY HANDSHAKE
      // ===========================
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (!roomData) return;

      // ===========================
      // INITIALIZE GENERATIVE CALL OFFER
      // ===========================
      if (isCaller && !roomData.offer) {
        console.log("Creating WebRTC Signal Offer...");
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await updateDoc(roomRef, {
          offer: offer.toJSON(),
        });
      }

      // ===========================
      // STREAMING NETWORK REAL-TIME LISTENER
      // ===========================
      unsubscribeRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data || !peerConnection.current) return;

        // ===========================
        // PROCESS INCOMING CALL OFFER
        // ===========================
        if (
          data.offer &&
          !isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log("Receiving Call Offer, constructing Answer response...");
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await updateDoc(roomRef, {
            answer: answer.toJSON(),
          });
        }

        // ===========================
        // PROCESS INCOMING RESPONSIVE ANSWER
        // ===========================
        if (
          data.answer &&
          isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          console.log(
            "Call Handshake accepted by peer. Connecting audio/video lines...",
          );
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }

        // ===========================
        // ARBITRATE INCOMING REAL-TIME ICE CANDIDATES
        // ===========================
        const candidates = isCaller
          ? data.answerCandidates
          : data.offerCandidates;

        if (candidates?.length) {
          for (const candidate of candidates) {
            const key = JSON.stringify(candidate);

            if (processedCandidates.current.has(key)) continue;
            processedCandidates.current.add(key);

            try {
              if (peerConnection.current.remoteDescription) {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(candidate),
                );
              }
            } catch (err) {
              console.warn("ICE candidate parsing error skipped:", err);
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
