import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  /* =========================
     REAL-TIME APPOINTMENTS
  ========================== */
  useEffect(() => {
    if (!user?.uid) return;

    console.log("📡 Patient listening for appointments...");

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid),
      orderBy("createdAt", "desc"), // ← Important for realtime + sorting
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`📊 Patient received ${data.length} appointments`);
        setAppointments(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Patient Dashboard Error:", error);
        setIsLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your appointments...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login again
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        My Consultations
      </h1>

      {appointments.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500">No consultations booked yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              <div>
                <h2 className="font-bold text-lg">Dr. {a.doctorName}</h2>
                <p className="text-sm text-gray-500">{a.doctorSpecialty}</p>

                <p className="mt-3">
                  Status:{" "}
                  <span
                    className={`font-semibold capitalize ${
                      a.status === "approved"
                        ? "text-green-600"
                        : a.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {a.status || "pending"}
                  </span>
                </p>

                {a.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Booked:{" "}
                    {a.createdAt.toDate?.()
                      ? a.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </p>
                )}
              </div>

              <div>
                {a.status === "approved" && a.videoRoomId ? (
                  <button
                    onClick={() => navigate(`/videocall/${a.videoRoomId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Join Video Call
                  </button>
                ) : a.status === "pending" ? (
                  <button
                    disabled
                    className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-xl cursor-not-allowed"
                  >
                    Waiting for Approval
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-red-100 text-red-700 px-6 py-3 rounded-xl cursor-not-allowed"
                  >
                    Request Rejected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
