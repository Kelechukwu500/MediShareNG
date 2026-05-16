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

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    start();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [roomId, userId]);

  const start = async () => {
    try {
      // ===========================
      // GET USER MEDIA
      // ===========================
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // ===========================
      // CREATE PEER CONNECTION
      // ===========================
      peerConnection.current = new RTCPeerConnection(servers);

      // Add local tracks
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // Remote stream handling
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.current.addTrack(track);
        });
      };

      const roomRef = doc(db, "videoRooms", roomId);

      // ===========================
      // ICE CANDIDATES (SEND)
      // ===========================
      peerConnection.current.onicecandidate = async (event) => {
        if (!event.candidate) return;

        const candidate = event.candidate.toJSON();

        await updateDoc(roomRef, {
          [isCaller ? "offerCandidates" : "answerCandidates"]:
            arrayUnion(candidate),
        });
      };

      // ===========================
      // GET ROOM DATA
      // ===========================
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (!roomData) return;

      // ===========================
      // CALLER CREATES OFFER
      // ===========================
      if (isCaller && !roomData.offer) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await updateDoc(roomRef, {
          offer: {
            type: offer.type,
            sdp: offer.sdp,
          },
        });
      }

      // ===========================
      // LISTEN FOR CHANGES
      // ===========================
      unsubscribeRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data) return;

        // ===========================
        // HANDLE OFFER (PATIENT)
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
            answer: {
              type: answer.type,
              sdp: answer.sdp,
            },
          });
        }

        // ===========================
        // HANDLE ANSWER (DOCTOR)
        // ===========================
        if (data.answer && isCaller) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }

        // ===========================
        // HANDLE ICE CANDIDATES (REMOTE → LOCAL)
        // ===========================
        const candidateList = isCaller
          ? data.answerCandidates
          : data.offerCandidates;

        if (candidateList && peerConnection.current) {
          candidateList.forEach(async (candidate) => {
            try {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate),
              );
            } catch (err) {
              console.warn("ICE error:", err);
            }
          });
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
