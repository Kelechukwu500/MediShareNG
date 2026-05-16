import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [videoRooms, setVideoRooms] = useState([]);

  const navigate = useNavigate();
  const [doctor, loading] = useAuthState(auth);

  /* =========================
     LOADING / AUTH GUARD
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login again
      </div>
    );
  }

  /* =========================
     GET DOCTOR APPOINTMENTS
  ========================== */
  useEffect(() => {
    if (!doctor?.uid) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctor.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      setAppointments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });

    return () => unsub();
  }, [doctor]);

  /* =========================
     GET VIDEO ROOMS
  ========================== */
  useEffect(() => {
    if (!doctor?.uid) return;

    const q = query(
      collection(db, "videoRooms"),
      where("doctorId", "==", doctor.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      setVideoRooms(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });

    return () => unsub();
  }, [doctor]);

  /* =========================
     ACCEPT APPOINTMENT
  ========================== */
  const acceptAppointment = async (appointment) => {
    try {
      await updateDoc(doc(db, "appointments", appointment.id), {
        status: "accepted",
      });

      // Activate room if exists
      if (appointment.roomId) {
        await updateDoc(doc(db, "videoRooms", appointment.roomId), {
          active: true,
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to accept appointment");
    }
  };

  /* =========================
     START VIDEO CALL
  ========================== */
  const joinRoom = (room) => {
    if (!room?.active) {
      alert("This consultation is not active yet. Accept appointment first.");
      return;
    }

    navigate(`/videocall/${room.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Doctor Dashboard
      </h1>

      {/* =========================
          APPOINTMENTS
      ========================== */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Incoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a.id}
              className="border p-4 rounded-lg mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Patient: {a.patientName || "Unknown"}
                </p>

                <p className="text-sm text-gray-500">Status: {a.status}</p>
              </div>

              {a.status === "pending" && (
                <button
                  onClick={() => acceptAppointment(a)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Accept
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* =========================
          VIDEO ROOMS
      ========================== */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Video Consultation Rooms</h2>

        {videoRooms.length === 0 ? (
          <p className="text-gray-500">No active rooms</p>
        ) : (
          videoRooms.map((room) => (
            <div
              key={room.id}
              className="border p-4 rounded-lg mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Room ID: {room.id}</p>

                <p className="text-sm text-gray-500">
                  Status: {room.active ? "Active" : "Waiting Approval"}
                </p>
              </div>

              <button
                onClick={() => joinRoom(room)}
                className={`px-4 py-2 rounded-lg text-white ${
                  room.active ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Start Session
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
