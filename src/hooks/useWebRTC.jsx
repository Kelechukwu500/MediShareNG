import { useEffect, useRef, useState, useCallback } from "react";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDoc,
  setDoc,
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
    setLocalStream(null);
    setRemoteStream(null);
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

    const initializeCall = async () => {
      try {
        // 1. Defined inline to isolate from extension caching and interceptors
        const localIceConfiguration = {
          iceServers: [
            {
              urls: [
                "stun:://google.com",
                "stun:://google.com",
                "stun:://google.com",
                "stun:://google.com",
              ],
            },
          ],
          iceCandidatePoolSize: 10,
        };

        // 2. Get Hardware media tracks first
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);

        // 3. Build RTCPeerConnection instance using local configuration scope
        const pc = new RTCPeerConnection(localIceConfiguration);
        peerConnection.current = pc;

        // 4. Attach Local media tracks immediately BEFORE sending descriptions
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // 5. Listen for Incoming Remote media tracks
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            remoteStreamRef.current = event.streams[0];
            setRemoteStream(event.streams[0]);
          }
        };

        const roomRef = doc(db, "videoRooms", roomId);
        const offerCandidatesCol = collection(roomRef, "offerCandidates");
        const answerCandidatesCol = collection(roomRef, "answerCandidates");

        // 6. Gather and transmit internal ICE Candidates
        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            const candidateData = event.candidate.toJSON();
            if (isCaller) {
              await addDoc(offerCandidatesCol, candidateData);
            } else {
              await addDoc(answerCandidatesCol, candidateData);
            }
          }
        };

        // 7. Execute SDP Offer/Answer Negotiation Cycle
        if (isCaller) {
          // Caller Flow (Doctor)
          const offerDescription = await pc.createOffer();
          await pc.setLocalDescription(offerDescription);

          await setDoc(
            roomRef,
            {
              offer: { type: offerDescription.type, sdp: offerDescription.sdp },
            },
            { merge: true },
          );

          // Listen for Answer
          unsubscribeRef.current = onSnapshot(roomRef, async (snapshot) => {
            const data = snapshot.data();
            if (data?.answer && !pc.remoteDescription) {
              const answerDescription = new RTCSessionDescription(data.answer);
              await pc.setRemoteDescription(answerDescription);
              await processQueuedCandidates();
            }
          });

          // Listen for Patient Candidates
          onSnapshot(answerCandidatesCol, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
              if (change.type === "added") {
                const data = change.doc.data();
                if (!processedCandidates.current.has(change.doc.id)) {
                  processedCandidates.current.add(change.doc.id);
                  if (pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(data));
                  } else {
                    iceCandidatesQueue.current.push(data);
                  }
                }
              }
            });
          });
        } else {
          // Receiver Flow (Patient)
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
            await processQueuedCandidates();
          }

          // Listen for Doctor Candidates
          onSnapshot(offerCandidatesCol, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
              if (change.type === "added") {
                const data = change.doc.data();
                if (!processedCandidates.current.has(change.doc.id)) {
                  processedCandidates.current.add(change.doc.id);
                  if (pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(data));
                  } else {
                    iceCandidatesQueue.current.push(data);
                  }
                }
              }
            });
          });
        }
      } catch (err) {
        console.error("Failed to initialize WebRTC connection:", err);
      }
    };

    initializeCall();

    return () => cleanup();
  }, [roomId, userId, isCaller, cleanup]);

  return { localStream, remoteStream };
};

export default useWebRTC;
