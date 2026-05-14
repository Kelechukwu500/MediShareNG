import { useEffect, useRef } from "react";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

const useWebRTC = (roomId, userId, isCaller) => {
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const peerConnection = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!roomId) return;

    start();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [roomId]);

  const start = async () => {
    try {
      // ✅ GET USER MEDIA (CAMERA + MIC)
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // ✅ CREATE PEER CONNECTION
      peerConnection.current = new RTCPeerConnection(servers);

      // Add tracks to peer connection
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // Remote stream setup
      const remote = new MediaStream();
      remoteStream.current = remote;

      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remote.addTrack(track);
        });
      };

      // ===============================
      // ICE CANDIDATES HANDLING
      // ===============================
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;

        const roomRef = doc(db, "videoRooms", roomId);

        if (isCaller) {
          await updateDoc(roomRef, {
            offerCandidates: arrayUnion(event.candidate.toJSON()),
          });
        } else {
          await updateDoc(roomRef, {
            answerCandidates: arrayUnion(event.candidate.toJSON()),
          });
        }
      };

      const roomRef = doc(db, "videoRooms", roomId);
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      // ===============================
      // CALLER CREATES OFFER
      // ===============================
      if (isCaller && !roomData.offer) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await setDoc(roomRef, {
          offer: {
            sdp: offer.sdp,
            type: offer.type,
          },
          offerCandidates: [],
          answerCandidates: [],
          createdAt: new Date(),
        });
      }

      // ===============================
      // LISTENER (DOCTOR)
      // ===============================
      onSnapshot(roomRef, async (snap) => {
        const data = snap.data();

        if (!data) return;

        // Accept offer
        if (
          data.offer &&
          !isCaller &&
          !peerConnection.current.currentRemoteDescription
        ) {
          const offerDesc = new RTCSessionDescription(data.offer);
          await peerConnection.current.setRemoteDescription(offerDesc);

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await updateDoc(roomRef, {
            answer: {
              type: answer.type,
              sdp: answer.sdp,
            },
          });
        }

        // Caller receives answer
        if (data.answer && isCaller) {
          const answerDesc = new RTCSessionDescription(data.answer);
          await peerConnection.current.setRemoteDescription(answerDesc);
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
