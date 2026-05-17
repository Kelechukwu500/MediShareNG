import { useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useWebRTC = (roomId, userId, isCaller) => {
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());
  const peerConnection = useRef(null);
  const unsubscribeRef = useRef(null);

  const processedCandidates = useRef(new Set());

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    start();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.getSenders().forEach((sender) => {
          if (sender.track) sender.track.stop();
        });
        peerConnection.current.close();
      }

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      if (localStream.current) {
        localStream.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [roomId, userId]);

  const start = async () => {
    try {
      // ===========================
      // GET MEDIA
      // ===========================
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // ===========================
      // PEER CONNECTION
      // ===========================
      peerConnection.current = new RTCPeerConnection(servers);

      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // ===========================
      // REMOTE STREAM FIX
      // ===========================
      peerConnection.current.ontrack = (event) => {
        remoteStream.current = event.streams[0];
      };

      const roomRef = doc(db, "videoRooms", roomId);

      // ===========================
      // ICE CANDIDATES SEND
      // ===========================
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;

        await updateDoc(roomRef, {
          [isCaller ? "offerCandidates" : "answerCandidates"]: arrayUnion(
            event.candidate.toJSON(),
          ),
        });
      };

      // ===========================
      // GET ROOM
      // ===========================
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (!roomData) return;

      // ===========================
      // CREATE OFFER
      // ===========================
      if (isCaller && !roomData.offer) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await updateDoc(roomRef, {
          offer: offer.toJSON(),
        });
      }

      // ===========================
      // LISTEN FOR CHANGES
      // ===========================
      unsubscribeRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data || !peerConnection.current) return;

        // ===========================
        // HANDLE OFFER
        // ===========================
        if (
          data.offer &&
          !isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
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
        // HANDLE ANSWER
        // ===========================
        if (
          data.answer &&
          isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }

        // ===========================
        // HANDLE ICE CANDIDATES (FIXED)
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
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate),
              );
            } catch (err) {
              console.warn("ICE error:", err);
            }
          }
        }
      });
    } catch (error) {
      console.error("WebRTC Error:", error);
    }
  };

  return {
    localStream,
    remoteStream,
  };
};

export default useWebRTC;
