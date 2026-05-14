import React from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const bookDoctor = async () => {
    const user = auth.currentUser;

    if (!user) {
      return navigate("/login");
    }

    try {
      // Create appointment ONLY
      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,
        doctorId: doctor.id,
        patientName: user.email,
        doctorName: doctor.name,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // ❌ DO NOT navigate to videocall here
      alert("Appointment booked successfully. Waiting for doctor approval.");
    } catch (error) {
      console.error("Error booking doctor:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition">
      <h2 className="text-lg font-bold text-green-700">{doctor.name}</h2>

      <p className="text-gray-600 mt-1">{doctor.specialty}</p>

      <p className="text-sm text-gray-500 mt-1">
        Experience: {doctor.experience}
      </p>

      {/* Availability */}
      <div className="mt-3">
        {doctor.available ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Available
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            Unavailable
          </span>
        )}
      </div>

      {/* 👇 BUTTON CONNECTED HERE */}
      <button
        onClick={bookDoctor}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Book Consultation
      </button>
    </div>
  );
};

export default DoctorCard;
