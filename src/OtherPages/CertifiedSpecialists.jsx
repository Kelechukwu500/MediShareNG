import React, { useState } from "react";
import {
  Stethoscope,
  Video,
  MessageCircle,
  Search,
  Star,
  BadgeCheck,
  Filter,
  Clock,
} from "lucide-react";

const CertifiedSpecialists = () => {
  const [search, setSearch] = useState("");

  const specialists = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      experience: "12 years",
      availability: "Available now",
      mode: "Video / Chat",
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Dermatologist",
      rating: 4.8,
      experience: "9 years",
      availability: "In 10 mins",
      mode: "Chat only",
    },
    {
      name: "Dr. Amina Yusuf",
      specialty: "Pediatrician",
      rating: 5.0,
      experience: "15 years",
      availability: "Available now",
      mode: "Video / Chat",
    },
    {
      name: "Dr. James Carter",
      specialty: "Neurologist",
      rating: 4.7,
      experience: "11 years",
      availability: "Busy",
      mode: "Video",
    },
  ];

  const filtered = specialists.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
              <BadgeCheck /> Certified Specialists
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Connect with board-certified practitioners across 40+ specialties
              within minutes via HD video or chat.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
            <Stethoscope size={16} />
            Verified Doctors Only
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl border border-emerald-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b bg-gray-50">
          {/* SEARCH */}
          <div className="flex items-center gap-2 w-full md:w-96 bg-white px-4 py-2 rounded-xl border">
            <Search className="text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search specialists..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* FILTER BUTTON (UI ONLY) */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* SPECIALISTS GRID */}
        <div className="p-4 md:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-emerald-700">{doc.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star size={14} fill="currentColor" />
                  {doc.rating}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-1">{doc.specialty}</p>

              {/* INFO */}
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>Experience: {doc.experience}</p>

                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{doc.availability}</span>
                </div>
              </div>

              {/* MODE BADGE */}
              <div className="mt-3">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {doc.mode}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 text-sm">
                  <Video size={16} />
                  Video
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 rounded-xl text-sm">
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-xs text-gray-500 mt-6">
        All specialists are verified and board-certified across multiple medical
        boards.
      </p>
    </div>
  );
};

export default CertifiedSpecialists;
