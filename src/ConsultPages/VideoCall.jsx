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

  // Auth Listener
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

  // Room Listener
  useEffect(() => {
    if (!roomId || !userId) return;

    const roomRef = doc(db, "videoRooms", roomId);

    const unsub = onSnapshot(roomRef, async (snap) => {
      if (!snap.exists()) {
        alert("This video room no longer exists.");
        navigate("/dashboard");
        return;
      }

      const data = snap.data();
      setRoomData(data);

      const isParticipant =
        data.doctorId === userId || data.patientId === userId;

      if (!isParticipant) {
        alert("You are not authorized to join this call.");
        navigate("/dashboard");
        return;
      }

      setAuthorized(true);

      // Auto-start call when doctor joins
      if (data.doctorId === userId && !data.active) {
        await updateDoc(roomRef, {
          active: true,
          callStarted: true,
          startedAt: new Date(),
        });
      }

      if (!data.active) {
        setWaiting(true);
      } else {
        setWaiting(false);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [roomId, userId, navigate]);

  // WebRTC Hook
  const { localStream, remoteStream } = useWebRTC(
    authorized ? roomId : null,
    userId,
    roomData?.doctorId === userId,
  );

  // Local Video
  useEffect(() => {
    if (localStream?.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [localStream]);

  // Remote Video
  useEffect(() => {
    if (remoteStream?.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [remoteStream]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Joining video session...
      </div>
    );
  }

  if (waiting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold mb-3">Waiting for Doctor...</h2>
        <p className="text-gray-400">Doctor will join shortly.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="flex justify-between items-center text-white mb-4">
        <h2 className="text-xl font-semibold">Video Consultation</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          End Call
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        {/* Remote Video */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg">
            Doctor
          </div>
        </div>

        {/* Local Video */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg">
            You
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
