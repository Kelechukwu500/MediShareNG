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
  setDoc, // ✅ Added for setting exact video room documents
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousCountRef = useRef(0);

  const navigate = useNavigate();
  const [doctor, loading] = useAuthState(auth);

  // CACHED SESSION PARAMETERS
  const cachedRole = localStorage.getItem("userRole");
  const cachedUserId = localStorage.getItem("userId");

  /* ========================================================
     REAL-TIME CROSS-TAB SECURITY OBSERVER (IMMEDIATE LOGOUT)
  ======================================================== */
  useEffect(() => {
    const checkActiveCacheSession = () => {
      const activeId = localStorage.getItem("userId");
      const activeRole = localStorage.getItem("userRole");

      if (!activeId || !activeRole) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", checkActiveCacheSession);
    return () => window.removeEventListener("storage", checkActiveCacheSession);
  }, [navigate]);

  /* ========================================================
     REAL-TIME ROLE-AWARE APPOINTMENTS LISTENER
  ======================================================== */
  useEffect(() => {
    if (!doctor?.uid) return;

    let appointmentsQuery;

    if (cachedRole === "admin-doctor" || cachedRole === "admin") {
      console.log(
        "📡 Admin-Doctor detected: Registering un-filtered appointments collection observer.",
      );
      appointmentsQuery = query(
        collection(db, "appointments"),
        orderBy("createdAt", "desc"),
      );
    } else {
      console.log(
        "📡 Standard Doctor detected: Filtering queries strictly matching id:",
        doctor.uid,
      );
      appointmentsQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", doctor.uid),
        orderBy("createdAt", "desc"),
      );
    }

    const unsub = onSnapshot(
      appointmentsQuery,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        if (
          data.length > previousCountRef.current &&
          previousCountRef.current !== 0
        ) {
          toast.success("New consultation request received!");
        }

        previousCountRef.current = data.length;
        setAppointments(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Critical Firestore Security Breach Blocked:", error);
        toast.error("Access Denied or Database error loading records");
        setIsLoading(false);
      },
    );

    return () => unsub();
  }, [doctor, cachedRole]);

  /* =========================
     APPROVE / REJECT
  ========================== */
  const approveAppointment = async (appointmentItem) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentItem.id);

      // ✅ AUTOMATED P2P SIGNAL ROOM INITIALIZATION SYSTEM
      // Use the appointment id as a unique video room key if one does not exist
      const computedRoomId =
        appointmentItem.videoRoomId || `room-${appointmentItem.id}`;
      const videoRoomRef = doc(db, "videoRooms", computedRoomId);

      // Create the structural signaling document inside Firestore
      await setDoc(
        videoRoomRef,
        {
          roomId: computedRoomId,
          doctorId: appointmentItem.doctorId || doctor.uid,
          patientId: appointmentItem.patientId || "",
          active: false,
          callStarted: false,
          createdAt: new Date(),
        },
        { merge: true },
      );

      // Link the room back to the appointment document status map
      await updateDoc(appointmentRef, {
        status: "approved",
        videoRoomId: computedRoomId,
      });

      toast.success("Appointment approved & signaling room active!");
    } catch (err) {
      console.error("Approval flow encounter error:", err);
      toast.error("Failed to approve appointment parameters");
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
      toast.error("No video room found. Try re-approving.");
      return;
    }
    navigate(`/videocall/${appointment.videoRoomId}`);
  };

  /* =========================
     AUTH RENDERING GUARD
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor || !cachedUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold bg-gray-50">
        Please login again
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start">
      <Toaster />

      {/* CROSS-PRIVILEGED RETURN NAVIGATION BANNER */}
      {cachedRole === "admin-doctor" && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex justify-between items-center text-xs shadow-sm sticky top-0 z-50">
          <span className="text-amber-800 font-semibold tracking-wide">
            Logged in with Admin-Doctor Cross privileges.
          </span>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-1.5 bg-amber-600 text-white px-4 py-1.5 rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-sm"
          >
            <ArrowLeft size={14} />
            Back to Admin View
          </button>
        </div>
      )}

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <h1 className="text-3xl font-black text-green-700">Doctor Dashboard</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Incoming Appointments
          </h2>

          {isLoading ? (
            <p className="text-gray-500 text-sm animate-pulse">
              Loading scheduled consultations...
            </p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments logged yet.</p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.id}
                className="border border-gray-100 p-5 rounded-2xl mb-4 bg-gray-50/20 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-bold text-base text-gray-900">
                      Patient: {a.patientName || "Unknown"}
                    </p>
                    <p>
                      Status:{" "}
                      <span
                        className={`capitalize font-semibold ${
                          a.status === "approved"
                            ? "text-green-600"
                            : a.status === "rejected"
                              ? "text-red-600"
                              : "text-amber-600"
                        }`}
                      >
                        {a.status || "pending"}
                      </span>
                    </p>
                    {a.createdAt && (
                      <p className="text-xs text-gray-400">
                        Booked:{" "}
                        {a.createdAt.toDate
                          ? a.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {a.status === "pending" || !a.status ? (
                      <>
                        <button
                          onClick={() => approveAppointment(a)} // ✅ Updated to pass whole item map
                          className="bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectAppointment(a.id)}
                          className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : a.status === "approved" ? (
                      <button
                        onClick={() => joinRoom(a)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Join Consultation Call
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold italic p-2">
                        Session Terminated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
