import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import useWebRTC from "../hooks/useWebRTC";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [userId, setUserId] = useState(null);

  const userRole = localStorage.getItem("userRole") || "patient";
  const isHostCaller = ["doctor", "admin", "admin-doctor"].includes(userRole);

  console.log("🎥 VideoCall component mounted with roomId:", roomId);

  // Auth Check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("🔐 Auth state changed. User:", user?.uid);
      if (!user) {
        console.log("❌ No user → Redirecting to login");
        navigate("/login");
      } else {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Room Check
  useEffect(() => {
    if (!roomId || !userId) {
      console.log("⏳ Waiting... roomId:", roomId, "userId:", userId);
      return;
    }

    console.log(
      "🔥 Starting Firestore listener for room:",
      roomId,
      "User:",
      userId,
    );

    const roomRef = doc(db, "videoRooms", roomId);

    const unsub = onSnapshot(roomRef, async (snap) => {
      console.log("📡 Room snapshot received. Exists?", snap.exists());

      if (!snap.exists()) {
        console.log("❌ Room document does NOT exist → Redirecting to home");
        setError("Room not found");
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      const data = snap.data();
      console.log("✅ Room data received:", data);

      const isDoctor = data.doctorId === userId;
      const isPatient = data.patientId === userId || !data.patientId;

      console.log("👤 IsDoctor:", isDoctor, "| IsPatient:", isPatient);

      if (!isDoctor && !isPatient) {
        console.log("🚫 Authorization FAILED → Redirecting to home");
        setError("Not authorized");
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      console.log("✅ Authorization PASSED");

      // Bind patient if needed
      if (!isDoctor && !data.patientId) {
        console.log("🔗 Binding patientId to room...");
        await updateDoc(roomRef, { patientId: userId });
      }

      setRoomData(data);
      setWaiting(!data.active);
      setLoading(false);
    });

    return () => unsub();
  }, [roomId, userId, navigate]);

  const { localStream, remoteStream } = useWebRTC(roomId, userId, isHostCaller);

  // ... rest of your video refs useEffect remain the same

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Connecting to video room... (roomId: {roomId})
      </div>
    );
  }

  // Your original return JSX here...
  return (
    // ... your full UI code
    <div className="min-h-screen bg-gray-950 p-4 ...">
      {/* your existing UI */}
    </div>
  );
};

export default VideoCall;
