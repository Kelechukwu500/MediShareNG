import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import useWebRTC from "../hooks/useWebRTC";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [roomData, setRoomData] = useState(null);

  const user = auth.currentUser;

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const isCaller = userRole === "doctor";

  // ===============================
  // VALIDATE ROOM ACCESS
  // ===============================
  useEffect(() => {
    const validateRoom = async () => {
      if (!roomId || !userId) {
        navigate("/login");
        return;
      }

      try {
        const roomRef = doc(db, "videoRooms", roomId);
        const snap = await getDoc(roomRef);

        if (!snap.exists()) {
          navigate("/doctors-page");
          return;
        }

        const data = snap.data();
        setRoomData(data);

        // ONLY allow doctor OR patient in room
        const allowed = data.doctorId === userId || data.patientId === userId;

        if (!allowed) {
          navigate("/doctors-page");
          return;
        }

        // BLOCK if not active yet
        if (!data.active) {
          alert("Waiting for doctor to start the session");
        }

        setAuthorized(true);
      } catch (error) {
        console.error(error);
        navigate("/doctors-page");
      } finally {
        setLoading(false);
      }
    };

    validateRoom();
  }, [roomId, userId, navigate]);

  // ===============================
  // WEBRTC HOOK
  // ===============================
  const { localStream, remoteStream } = useWebRTC(roomId, userId, isCaller);

  // ===============================
  // ATTACH LOCAL STREAM
  // ===============================
  useEffect(() => {
    if (localStream?.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [localStream]);

  // ===============================
  // ATTACH REMOTE STREAM
  // ===============================
  useEffect(() => {
    if (remoteStream?.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [remoteStream]);

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading video session...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

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
