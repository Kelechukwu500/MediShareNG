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
  const [authorized, setAuthorized] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [userId, setUserId] = useState(null);

  // FIXED: Initialize role directly from storage to eliminate async delay race-conditions
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || "patient",
  );

  // 1. Auth Session Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserId(user.uid);
        if (localStorage.getItem("userRole")) {
          setUserRole(localStorage.getItem("userRole"));
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. 🔥 WebRTC Hook Initialization (FIXED: Deduce isCaller strictly using the immediate role value)
  const { localStream, remoteStream } = useWebRTC(
    roomId,
    userId,
    userRole === "doctor", // 🔥 Safe, instant role evaluation
  );

  // 3. Room Synchronization Engine
  useEffect(() => {
    if (!roomId || !userId) return;

    const roomRef = doc(db, "videoRooms", roomId);

    const unsub = onSnapshot(
      roomRef,
      async (snap) => {
        if (!snap.exists()) {
          alert("This video room no longer exists.");
          navigate("/");
          return;
        }

        const data = snap.data();
        setRoomData(data);

        const isDoctor = data.doctorId === userId;
        const isPatient = data.patientId === userId;

        if (!isDoctor && !isPatient) {
          alert("You are not authorized to join this call.");
          navigate("/");
          return;
        }

        setAuthorized(true);

        // Auto-start room values on Doctor connect
        if (isDoctor && !data.active) {
          setWaiting(false);
          setLoading(false);
          try {
            await updateDoc(roomRef, {
              active: true,
              callStarted: true,
              startedAt: new Date(),
            });
          } catch (err) {
            console.error("Failed to activate room:", err);
          }
          return;
        }

        // Evaluate Waiting Screen Statuses
        if (!data.active) {
          setWaiting(true);
        } else {
          setWaiting(false);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Room Snapshot Error:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [roomId, userId, navigate]);

  // 4. Bind Local Video Stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  }, [localStream]);

  // 5. Bind Remote Video Stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      if (remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting to secure video channel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 font-sans antialiased">
      {/* HEADER BAR */}
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
            navigate(
              userRole === "doctor"
                ? "/doctor-dashboard"
                : "/patient-dashboard",
            )
          }
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-900/20 text-sm"
        >
          End Session
        </button>
      </div>

      {/* VIDEO STREAMS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-130px)]">
        {/* Remote Video Box */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-2xl flex items-center justify-center">
          {waiting ? (
            <div className="text-center px-4 z-10">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center animate-pulse mb-3 mx-auto">
                🎥
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">
                Waiting for Doctor...
              </h3>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                The consultation session begins automatically the moment your
                doctor joins the line.
              </p>
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          )}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-xs text-gray-200 font-bold px-3 py-1.5 rounded-xl border border-white/10 tracking-wider uppercase z-20">
            {userRole === "doctor" ? "Patient Feed" : "Doctor Feed"}
          </div>
        </div>

        {/* Local Video Box */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-xs text-gray-200 font-bold px-3 py-1.5 rounded-xl border border-white/10 tracking-wider uppercase">
            You (Your Camera)
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
