import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import { db, auth } from "../firebase";
import { CalendarDays } from "lucide-react";

const BookConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBook = async () => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    // GET SELECTED DOCTOR FROM STORAGE
    const selectedDoctor =
      JSON.parse(localStorage.getItem("selectedDoctor")) || null;

    if (!selectedDoctor) {
      alert("No doctor selected. Please choose a doctor first.");
      return navigate("/doctors-page");
    }

    try {
      // 1. CREATE APPOINTMENT
      const appointmentRef = await addDoc(collection(db, "appointments"), {
        doctorId: id,
        patientId: user.uid,
        doctorName: selectedDoctor.name || "",
        doctorSpecialization: selectedDoctor.specialization || "",
        patientName: user.email,
        status: "pending",
        createdAt: new Date(),
      });

      // 2. CREATE VIDEO ROOM
      const roomRef = await addDoc(collection(db, "videoRooms"), {
        doctorId: id,
        patientId: user.uid,
        appointmentId: appointmentRef.id,
        offer: null,
        answer: null,
        offerCandidates: [],
        answerCandidates: [],
        active: false,
        createdAt: new Date(),
      });

      // 3. LINK ROOM TO APPOINTMENT
      await updateDoc(doc(db, "appointments", appointmentRef.id), {
        roomId: roomRef.id,
      });

      // 4. STORE BOOKING CONTEXT
      localStorage.setItem("appointmentId", appointmentRef.id);

      localStorage.setItem("roomId", roomRef.id);

      // 5. NAVIGATE TO VIDEO CALL
      navigate(`/videocall/${roomRef.id}`);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book consultation.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ecfdf5] via-white to-[#dcfce7] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 p-8">
          {/* ICON */}
          <div className="w-16 h-16 bg-[#065f46] text-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <CalendarDays size={30} />
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-3xl font-black text-center text-[#065f46]">
            Confirm Consultation
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-4 text-center text-gray-600 leading-relaxed">
            Review and confirm your appointment. Once confirmed, you will be
            connected to a secure video consultation session.
          </p>

          {/* INFO BOX */}
          <div className="mt-8 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                Pending
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-gray-500">Type</span>
              <span className="text-[#065f46] font-semibold">
                Video Consultation
              </span>
            </div>
          </div>

          {/* BOOK BUTTON */}
          <button
            onClick={handleBook}
            className="w-full mt-8 bg-gradient-to-r from-[#065f46] to-[#2bb673] hover:opacity-90 text-white p-4 rounded-2xl font-bold shadow-lg transition-all duration-300"
          >
            Confirm Booking & Start Session
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/doctors-page")}
            className="w-full mt-4 border border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white p-4 rounded-2xl font-semibold transition-all duration-300"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookConsultation;
