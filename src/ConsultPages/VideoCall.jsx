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
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || "patient",
  );

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

  const { localStream, remoteStream } = useWebRTC(
    roomId,
    userId,
    userRole === "doctor",
  );

  // FIXED: Attaches the local camera stream reliably to the local DOM element when initialized
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // FIXED: Attaches the remote peer stream reliably to the remote DOM element when handshake succeeds
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

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

  const handleEndCall = async () => {
    if (!roomId) return;
    try {
      const roomRef = doc(db, "videoRooms", roomId);
      await updateDoc(roomRef, { active: false, callEnded: true });
      navigate("/");
    } catch (err) {
      console.error("Error terminating call:", err);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Setting up secure connection channels...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        Unauthorized Access.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#1a1a1a",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          padding: "15px 20px",
          background: "#2a2a2a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          Telemedicine Call (
          {userRole === "doctor" ? "Doctor Dashboard" : "Patient Portal"})
        </h2>
        <button
          onClick={handleEndCall}
          style={{
            background: "#dc3545",
            color: "#white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          End Call
        </button>
      </header>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          padding: "20px",
          boxSizing: "border-box",
          background: "#121212",
        }}
      >
        {/* Local Stream Feed */}
        <div
          style={{
            position: "relative",
            background: "#000",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted // Local camera must remain muted to prevent user from hearing their own echo feedback loop
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              background: "rgba(0,0,0,0.6)",
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            You ({userRole})
          </span>
        </div>

        {/* Remote Stream Feed */}
        <div
          style={{
            position: "relative",
            background: "#000",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {waiting ? (
            <div style={{ textAlign: "center", color: "#aaa" }}>
              Waiting for the other participant to establish connection...
            </div>
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              // FIXED: Explicitly unmuted so Doctor and Patient can clearly hear each other over WebRTC lines
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          <span
            style={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              background: "rgba(0,0,0,0.6)",
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {userRole === "doctor" ? "Patient" : "Doctor"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
