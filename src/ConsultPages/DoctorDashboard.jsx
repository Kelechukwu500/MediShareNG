import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousCountRef = useRef(0);

  const navigate = useNavigate();
  const [doctor, loading] = useAuthState(auth);

  /* =========================
     AUTH GUARD
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Please login again
      </div>
    );
  }

  /* =========================
     DOCTOR ID (Critical)
  ========================== */
  const doctorId = doctor?.uid || doctor?.doctorId;

  console.log("🔍 Doctor Logged In:", {
    uid: doctor?.uid,
    doctorId: doctor?.doctorId,
    email: doctor?.email,
    fullObject: doctor,
  });

  if (!doctorId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Doctor ID not found. Please login again.
      </div>
    );
  }

  
  /* =========================
   REAL-TIME APPOINTMENTS - IMPROVED
========================== */
  useEffect(() => {
    if (!doctorId) return;

    console.log("📡 Setting up query for doctorId:", doctorId);

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        console.log(`📊 Received ${snap.size} appointments:`, data);

        // Show toast only for real new appointments
        if (data.length > previousCountRef.current) {
          toast.success("New consultation request received!");
        }

        previousCountRef.current = data.length;
        setAppointments(data);
        setIsLoading(false); // Add this if you have isLoading state
      },
      (error) => {
        console.error("Firestore Error:", error);
        toast.error("Error loading appointments");
      },
    );

    return () => unsub();
  }, [doctorId]);

  /* =========================
     APPROVE / REJECT
  ========================== */
  const approveAppointment = async (id) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: "approved" });
      toast.success("Appointment approved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  const rejectAppointment = async (id) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: "rejected" });
      toast.error("Appointment rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject");
    }
  };

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

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Incoming Appointments</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a.id}
              className="border p-5 rounded-xl mb-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    Patient: {a.patientName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{" "}
                    <span className="capitalize font-medium">{a.status}</span>
                  </p>
                  {a.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Booked:{" "}
                      {a.createdAt.toDate
                        ? a.createdAt.toDate().toLocaleString()
                        : "N/A"}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveAppointment(a.id)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectAppointment(a.id)}
                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {a.status === "approved" && (
                    <button
                      onClick={() => joinRoom(a)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Join Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};;

export default DoctorDashboard;
