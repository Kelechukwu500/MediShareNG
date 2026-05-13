import React from "react";
import { doctors } from "../components/DoctorsData";
import DoctorCard from "../components/DoctorCard";

const Doctors = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Available Doctors
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};

export default Doctors;
