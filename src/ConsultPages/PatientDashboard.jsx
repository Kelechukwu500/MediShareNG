import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  /* =========================
     REAL-TIME APPOINTMENTS
  ========================== */
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(data);
    });

    return () => unsub();
  }, [user]);

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
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
        <div className="bg-white p-6 rounded-xl shadow">
          No consultations booked yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >
              {/* LEFT INFO */}
              <div>
                <h2 className="font-bold text-lg">
                  Dr. {a.doctorName || "Doctor"}
                </h2>

                <p className="text-sm text-gray-500">
                  {a.doctorSpecialty || "General"}
                </p>

                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span
                    className={
                      a.status === "approved"
                        ? "text-green-600 font-semibold"
                        : a.status === "rejected"
                          ? "text-red-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                    }
                  >
                    {a.status}
                  </span>
                </p>
              </div>

              {/* RIGHT ACTION */}
              <div>
                {a.status === "approved" ? (
                  <button
                    onClick={() => navigate(`/videocall/${a.videoRoomId}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Join Session
                  </button>
                ) : a.status === "pending" ? (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Waiting Approval
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Rejected
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
