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

  // Auth Check
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

  // Room & Authorization Check
  useEffect(() => {
    if (!roomId || !userId) return;

    const roomRef = doc(db, "videoRooms", roomId);

    const unsub = onSnapshot(
      roomRef,
      async (snap) => {
        if (!snap.exists()) {
          setError("This video room no longer exists.");
          setLoading(false);
          setTimeout(() => navigate("/"), 2500);
          return;
        }

        const data = snap.data();
        setRoomData(data);

        const isDoctor = data.doctorId === userId;
        const isPatient = data.patientId === userId || !data.patientId;

        if (!isDoctor && !isPatient) {
          setError("You are not authorized to join this session.");
          setLoading(false);
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        // Bind patient ID if missing
        if (!isDoctor && !data.patientId) {
          try {
            await updateDoc(roomRef, { patientId: userId });
          } catch (err) {
            console.error("Failed to bind patient:", err);
          }
        }

        setWaiting(!data.active);
        setLoading(false);
      },
      (error) => {
        console.error("Room snapshot error:", error);
        setError("Failed to connect to video room.");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [roomId, userId, navigate]);

  const { localStream, remoteStream } = useWebRTC(roomId, userId, isHostCaller);

  // Attach streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-red-500 text-2xl mb-4">Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting to secure video channel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 font-sans antialiased">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white mb-4 bg-gray-900/50 backdrop-blur px-6 py-4 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-lg font-bold text-gray-100">
            Live Medical Consultation
          </h2>
          <p className="text-xs text-green-400 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Secure Encrypted Session
          </p>
        </div>
        <button
          onClick={() =>
            navigate(isHostCaller ? "/doctor-dashboard" : "/patient-dashboard")
          }
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg"
        >
          End Session
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-130px)]">
        {/* Remote View */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-2xl flex items-center justify-center">
          {waiting ? (
            <div className="text-center px-4">
              <h3 className="text-xl font-bold mb-1 text-white">
                Waiting for Connection...
              </h3>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                The session will begin automatically when the other participant
                arrives.
              </p>
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-xs text-gray-200 font-bold px-3 py-1.5 rounded-xl border border-white/10 uppercase z-20">
            {isHostCaller ? "Patient Feed" : "Doctor Feed"}
          </div>
        </div>

        {/* Local View */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-xs text-gray-200 font-bold px-3 py-1.5 rounded-xl border border-white/10 uppercase">
            You (Your Camera)
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
