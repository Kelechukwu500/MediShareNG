import React from "react";

const DoctorCard = ({ doctor }) => {
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
            Online
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            Offline
          </span>
        )}
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        Book Consultation
      </button>
    </div>
  );
};

export default DoctorCard;
