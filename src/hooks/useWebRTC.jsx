import { useEffect, useRef, useState, useCallback } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

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

  const processQueuedCandidates = async () => {
    if (!peerConnection.current?.remoteDescription) return;
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      } catch (e) {
        console.error("Error adding queued ice candidate", e);
      }
    }
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    const startWebRTC = async () => {
      try {
        const pc = new RTCPeerConnection(servers);
        peerConnection.current = pc;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
          window: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            remoteStreamRef.current = event.streams[0];
            setRemoteStream(event.streams[0]);
          }
        };

        const roomRef = doc(db, "videoRooms", roomId);

        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            const candidateType = isCaller
              ? "callerCandidates"
              : "calleeCandidates";
            await updateDoc(roomRef, {
              [candidateType]: arrayUnion(event.candidate.toJSON()),
            });
          }
        };

        if (isCaller) {
          const offerDescription = await pc.createOffer();
          await pc.setLocalDescription(offerDescription);

          await updateDoc(roomRef, {
            offer: {
              type: offerDescription.type,
              sdp: offerDescription.sdp,
            },
          });

          unsubscribeRef.current = onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            if (data.answer && !pc.currentRemoteDescription) {
              const answerDescription = new RTCSessionDescription(data.answer);
              await pc.setRemoteDescription(answerDescription);
              await processQueuedCandidates();
            }

            if (data.calleeCandidates) {
              data.calleeCandidates.forEach((candidate) => {
                const candStr = JSON.stringify(candidate);
                if (!processedCandidates.current.has(candStr)) {
                  processedCandidates.current.add(candStr);
                  if (pc.currentRemoteDescription) {
                    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(
                      console.error,
                    );
                  } else {
                    iceCandidatesQueue.current.push(candidate);
                  }
                }
              });
            }
          });
        } else {
          const roomSnap = await getDoc(roomRef);
          const roomData = roomSnap.data();

          if (roomData?.offer) {
            await pc.setRemoteDescription(
              new RTCSessionDescription(roomData.offer),
            );
            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            await updateDoc(roomRef, {
              answer: {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
              },
            });
          }

          unsubscribeRef.current = onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            if (data.callerCandidates) {
              data.callerCandidates.forEach((candidate) => {
                const candStr = JSON.stringify(candidate);
                if (!processedCandidates.current.has(candStr)) {
                  processedCandidates.current.add(candStr);
                  if (pc.currentRemoteDescription) {
                    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(
                      console.error,
                    );
                  } else {
                    iceCandidatesQueue.current.push(candidate);
                  }
                }
              });
            }
          });
          await processQueuedCandidates();
        }
      } catch (err) {
        console.error("WebRTC initiation failed:", err);
      }
    };

    startWebRTC();
    return cleanup;
  }, [roomId, userId, isCaller, cleanup]);

  return { localStream, remoteStream };
};

export default useWebRTC;
