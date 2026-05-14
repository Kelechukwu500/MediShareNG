import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { CalendarDays } from "lucide-react";
import { updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const BookConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 const handleBook = async () => {
   const user = auth.currentUser;

   if (!user) return;

   try {
     // 1. CREATE APPOINTMENT
     const appointmentRef = await addDoc(collection(db, "appointments"), {
       doctorId: id,
       patientId: user.uid,
       status: "pending",
       createdAt: new Date(),
       patientName: user.email,
        doctorName: "doctor.Name", // You can fetch the doctor's name based on the ID if needed
      
     });

     // 2. CREATE VIDEO ROOM (🔥 IMPORTANT MISSING PIECE)
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
     await updateDoc(appointmentRef, {
       roomId: roomRef.id,
     });

     // 4. GO TO VIDEO CALL
     navigate(`/videocall/${roomRef.id}`);
   } catch (error) {
     console.error("Booking error:", error);
   }
 };

  return (
    <section className="min-h-screen bg-gray-200 via-white to-[#dcfce7] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 p-6 sm:p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#065f46] text-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <CalendarDays size={30} />
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-black text-center text-[#065f46]">
            Book Consultation
          </h2>

          {/* Text */}
          <p className="mt-4 text-center text-gray-600 leading-relaxed">
            Confirm your appointment and connect securely with your preferred
            healthcare specialist on MediShareNG.
          </p>

          {/* Appointment Info */}
          <div className="mt-8 bg-[#f5f7f6] border border-[#dff4ea] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">
                Consultation Status
              </span>

              <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
                Pending
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-500 font-medium">
                Consultation Type
              </span>

              <span className="text-[#065f46] font-semibold">
                Video Session
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleBook}
            className="w-full mt-8 bg-[#065f46] hover:bg-[#044c39] text-white p-4 rounded-2xl font-semibold shadow-lg transition-all duration-300"
          >
            Confirm Booking
          </button>

          {/* Back Button */}

          <Link to="/doctors-page">
          <button
            onClick={() => navigate("/choose-doctor")}
            className="w-full mt-4 border border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white p-4 rounded-2xl font-semibold transition-all duration-300"
          >
            Back to Doctors
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookConsultation;
