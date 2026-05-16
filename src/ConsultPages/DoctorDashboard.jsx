import React, { useEffect, useState, useRef } from "react";
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
import toast, { Toaster } from "react-hot-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [previousCount, setPreviousCount] = useState(0);

  const navigate = useNavigate();
  const [doctor, loading] = useAuthState(auth);

  /* =========================
     AUTH GUARD
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
     REAL-TIME APPOINTMENTS
  ========================== */
  useEffect(() => {
    if (!doctor?.uid) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctor.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 🔥 realtime notification for new appointment
      if (data.length > previousCount) {
        toast.success("New consultation request received!");
      }

      setPreviousCount(data.length);
      setAppointments(data);
    });

    return () => unsub();
  }, [doctor, previousCount]);

  /* =========================
     APPROVE APPOINTMENT
  ========================== */
  const approveAppointment = async (id) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status: "approved",
      });

      toast.success("Appointment approved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  /* =========================
     REJECT APPOINTMENT
  ========================== */
  const rejectAppointment = async (id) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status: "rejected",
      });

      toast.error("Appointment rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject");
    }
  };

  /* =========================
     JOIN VIDEO SESSION
  ========================== */
  const joinRoom = (appointment) => {
    if (appointment.status !== "approved") {
      toast.error("You must approve before joining session");
      return;
    }

    if (!appointment.videoRoomId) {
      toast.error("No video room found");
      return;
    }

    navigate(`/videocall/${appointment.videoRoomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Doctor Dashboard
      </h1>

      {/* =========================
          APPOINTMENTS
      ========================== */}
      <div className="bg-white p-5 rounded-xl shadow-md">
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

              <div className="flex gap-2">
                {a.status === "pending" && (
                  <>
                    <button
                      onClick={() => approveAppointment(a.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectAppointment(a.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}

                {a.status === "approved" && (
                  <button
                    onClick={() => joinRoom(a)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Join Session
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
