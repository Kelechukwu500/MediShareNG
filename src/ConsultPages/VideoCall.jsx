import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import useWebRTC from "../hooks/useWebRTC";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const [userId, setUserId] = useState(null);

  // ===============================
  // AUTH LISTENER
  // ===============================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ===============================
  // ROOM LISTENER
  // ===============================
  useEffect(() => {
    if (!roomId || !userId) return;

    const roomRef = doc(db, "videoRooms", roomId);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) {
        navigate("/doctors-page");
        return;
      }

      const data = snap.data();
      setRoomData(data);

      const allowed = data.doctorId === userId || data.patientId === userId;

      if (!allowed) {
        navigate("/doctors-page");
        return;
      }

      if (!data.active) {
        setWaiting(true);
        setAuthorized(false);
      } else {
        setWaiting(false);
        setAuthorized(true);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [roomId, userId, navigate]);

  // ===============================
  // CORRECT ROLE DETECTION
  // ===============================
  const isCaller = roomData?.doctorId === userId;

  // ===============================
  // WEBSRTC HOOK
  // ===============================
  const { localStream, remoteStream } = useWebRTC(
    authorized ? roomId : null,
    userId,
    isCaller,
  );

  // ===============================
  // LOCAL STREAM
  // ===============================
  useEffect(() => {
    if (localStream?.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [localStream]);

  // ===============================
  // REMOTE STREAM
  // ===============================
  useEffect(() => {
    if (remoteStream?.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [remoteStream]);

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading video session...
      </div>
    );
  }

  // ===============================
  // WAITING
  // ===============================
  if (waiting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold mb-3">
          Waiting for doctor to start session...
        </h2>
        <p className="text-gray-400">
          You will be connected automatically once the doctor approves.
        </p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-black grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* REMOTE VIDEO */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* LOCAL VIDEO */}
      <div className="bg-gray-900 rounded-xl overflow-hidden relative">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
          You
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
