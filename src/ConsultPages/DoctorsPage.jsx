import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import DoctorCard from "../components/DoctorCard";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  // FETCH DOCTORS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "doctors"), (snap) => {
      setDoctors(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return () => unsub();
  }, []);

  // HANDLE DOCTOR SELECTION
  const handleSelectDoctor = async (doctor) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return navigate("/login");
      }

      // SAVE SELECTED DOCTOR (LOCAL STORAGE)
      localStorage.setItem("selectedDoctor", JSON.stringify(doctor));

      localStorage.setItem("doctorId", doctor.id);

      // OPTIONAL: SAVE TO FIRESTORE (for history / tracking)
      await setDoc(doc(db, "selectedDoctors", user.uid), {
        userId: user.uid,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        selectedAt: new Date(),
      });

      // MOVE TO BOOKING STEP
      navigate(`/book-consultation/${doctor.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to select doctor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Choose Your Doctor
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleSelectDoctor(doc)}
            className="cursor-pointer"
          >
            <DoctorCard doctor={doc} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
