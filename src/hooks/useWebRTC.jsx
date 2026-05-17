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
        urls: ["stun:://google.com", "stun:://google.com"],
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
      // 1. ACCESS HARDWARE MEDIA
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      // 2. CONSTRUCT PEER LINES
      peerConnection.current = new RTCPeerConnection(servers);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // 3. 🔥 REMOTE STREAM RACING ENGINE FIXED
      peerConnection.current.ontrack = (event) => {
        console.log("📡 Raw tracks received from remote peer.");

        // Check if a full stream array list exists
        if (event.streams && event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          setRemoteStream(event.streams[0]);
        } else {
          // Fallback: If track array arrives isolated, construct the stream object manually
          if (!remoteStreamRef.current) {
            remoteStreamRef.current = new MediaStream();
            setRemoteStream(remoteStreamRef.current);
          }
          remoteStreamRef.current.addTrack(event.track);
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
        }

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
        }

        // CANDIDATES SET PARSING ENGINE
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
              console.warn("ICE skipped:", err);
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
