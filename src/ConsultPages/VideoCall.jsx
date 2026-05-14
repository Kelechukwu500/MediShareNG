import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import useWebRTC from "../hooks/useWebRTC";

const VideoCall = () => {
  const { roomId } = useParams();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ⚠️ TEMP ROLE (later replace with auth logic)
  
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const isCaller = userRole === "doctor";

  // ✅ FIX: prevent crash if roomId missing
  const { localStream, remoteStream } = useWebRTC(roomId, userId, isCaller);

  // ===============================
  // MARK ROOM ACTIVE
  // ===============================
  useEffect(() => {
    if (!roomId) {
      return <div>No room found</div>;
    }

    const setupCall = async () => {
      try {
        await updateDoc(doc(db, "videoRooms", roomId), {
          active: true,
        });
      } catch (error) {
        console.error("Error updating room:", error);
      }
    };

    setupCall();
  }, [roomId]);

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
