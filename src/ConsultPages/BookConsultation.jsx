import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";
import { CalendarDays } from "lucide-react";

const BookConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBook = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const selectedDoctor = JSON.parse(localStorage.getItem("selectedDoctor"));

      if (!selectedDoctor) {
        alert("No doctor selected.");
        navigate("/doctors-page");
        return;
      }

      /* =========================
         1. CREATE VIDEO ROOM FIRST
      ========================== */
      const roomRef = await addDoc(collection(db, "videoRooms"), {
        doctorId: id,
        patientId: user.uid,

        active: false, // 🔥 DOCTOR must activate

        callStarted: false,

        createdAt: serverTimestamp(),
      });

      /* =========================
         2. CREATE APPOINTMENT
      ========================== */
      const appointmentRef = await addDoc(collection(db, "appointments"), {
        doctorId: id,
        patientId: user.uid,

        doctorName: selectedDoctor.name || "",
        doctorSpecialty: selectedDoctor.specialty || "",

        patientEmail: user.email || "",
        patientName: user.displayName || user.email || "Patient",

        status: "pending",

        videoRoomId: roomRef.id, // 🔥 IMPORTANT FIX

        type: "video-consultation",

        createdAt: serverTimestamp(),
      });

      /* =========================
         3. LINK ROOM TO APPOINTMENT
      ========================== */
      await updateDoc(doc(db, "videoRooms", roomRef.id), {
        appointmentId: appointmentRef.id,
      });

      /* =========================
         4. STORE SESSION DATA
      ========================== */
      localStorage.setItem("appointmentId", appointmentRef.id);
      localStorage.setItem("roomId", roomRef.id);
      localStorage.setItem("selectedDoctor", JSON.stringify(selectedDoctor));

      /* =========================
         5. SUCCESS
      ========================== */
      alert("Consultation booked successfully.");

      /* =========================
         6. REDIRECT (DO NOT ENTER CALL YET)
      ========================== */
      navigate("/patient-dashboard");
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      alert(error.message || "Failed to book consultation.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ecfdf5] via-white to-[#dcfce7] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 p-8">
          <div className="w-16 h-16 bg-[#065f46] text-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <CalendarDays size={30} />
          </div>

          <h2 className="mt-6 text-3xl font-black text-center text-[#065f46]">
            Confirm Consultation
          </h2>

          <p className="mt-4 text-center text-gray-600 leading-relaxed">
            Your appointment will be sent to the doctor for approval before the
            session begins.
          </p>

          <div className="mt-8 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                Pending Doctor Approval
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-gray-500">Type</span>
              <span className="text-[#065f46] font-semibold">
                Video Consultation
              </span>
            </div>
          </div>

          <button
            onClick={handleBook}
            className="w-full mt-8 bg-gradient-to-r from-[#065f46] to-[#2bb673] text-white p-4 rounded-2xl font-bold shadow-lg"
          >
            Confirm Booking
          </button>

          <button
            onClick={() => navigate("/doctors-page")}
            className="w-full mt-4 border border-[#065f46] text-[#065f46] p-4 rounded-2xl font-semibold"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookConsultation;
