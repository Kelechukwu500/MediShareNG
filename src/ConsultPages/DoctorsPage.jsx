import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import DoctorCard from "../components/DoctorCard";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Choose Your Doctor
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
