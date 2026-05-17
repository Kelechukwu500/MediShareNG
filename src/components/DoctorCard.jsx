import React from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, ArrowRight } from "lucide-react";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

    const handleSelect = () => {
      if (!doctor?.id) {
        console.error("Doctor ID missing:", doctor);
        return;
      }

      /* =========================================
       STORE SELECTED DOCTOR (CLEAN FIX)
    ========================================= */
      localStorage.setItem(
        "selectedDoctor",
        JSON.stringify({
          id: doctor.id,
          uid: doctor.id, // 🔥 ADD THIS LINE to match your BookConsultation expectations
          name: doctor.name,
          specialty: doctor.specialty,
          experience: doctor.experience,
          isOnline: doctor.isOnline,
          available: doctor.available,
        }),
      );

      /* =========================================
       NAVIGATE TO BOOKING
    ========================================= */
      navigate(`/book-consultation/${doctor.id}`, {
        state: { doctor },
      });
    };


  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition border">
      {/* ICON */}
      <div className="w-14 h-14 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
        <Stethoscope />
      </div>

      {/* NAME */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">{doctor.name}</h2>

      {/* SPECIALTY */}
      <p className="text-gray-600">{doctor.specialty}</p>

      {/* EXPERIENCE */}
      <p className="text-sm text-gray-500 mt-2">
        Experience: {doctor.experience} years
      </p>

      {/* ONLINE STATUS */}
      <div className="mt-2 text-sm">
        {doctor.isOnline ? (
          <span className="text-green-600 font-semibold">● Online</span>
        ) : (
          <span className="text-gray-400">● Offline</span>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSelect}
        className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2"
      >
        Select Doctor
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default DoctorCard;
