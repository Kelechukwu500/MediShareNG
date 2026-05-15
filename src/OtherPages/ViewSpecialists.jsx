import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Video,
  MapPin,
  Clock3,
  Stethoscope,
  HeartPulse,
  Brain,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import hospital2 from "../assets/hospital2.jpg";

const ViewSpecialists = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const specialists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      hospital: "MediCare Hospital",
      experience: "10 Years Experience",
      availability: "Available Now",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop",
      icon: <HeartPulse size={18} />,
    },
    {
      id: 2,
      name: "Dr. Michael Lee",
      specialty: "Dermatologist",
      hospital: "SkinCare Clinic",
      experience: "7 Years Experience",
      availability: "Online",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop",
      icon: <ShieldCheck size={18} />,
    },
    {
      id: 3,
      name: "Dr. Anita Roberts",
      specialty: "Neurologist",
      hospital: "Brain Health Center",
      experience: "12 Years Experience",
      availability: "Available Today",
      rating: "5.0",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1200&auto=format&fit=crop",
      icon: <Brain size={18} />,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "General Physician",
      hospital: "City Medical Center",
      experience: "9 Years Experience",
      availability: "Online",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
      icon: <Stethoscope size={18} />,
    },
    {
      id: 5,
      name: "Dr. Grace Adams",
      specialty: "Pediatrician",
      hospital: "KidsCare Hospital",
      experience: "8 Years Experience",
      availability: "Available Now",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1200&auto=format&fit=crop",
      icon: <HeartPulse size={18} />,
    },
    {
      id: 6,
      name: "Dr. David Smith",
      specialty: "Orthopedic Surgeon",
      hospital: "Prime Orthopedic Center",
      experience: "14 Years Experience",
      availability: "Online",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=1200&q=80",
      icon: <ShieldCheck size={18} />,
    },
  ];

  const filteredDoctors = specialists.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="w-full min-h-screen overflow-hidden bg-[#f5f7f6]">
      {/* HERO */}
      <div
        className="relative py-28 px-4 sm:px-6 lg:px-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${hospital2})` }}
      >
        <div className="absolute inset-0 bg-black/75"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white">
            Meet Our <span className="text-[#2bb673] block">Experts</span>
          </h1>

          {/* SEARCH */}
          <div className="mt-10 bg-white max-w-2xl mx-auto relative shadow-lg rounded-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 rounded-2xl pl-14 pr-5 text-gray-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 relative flex flex-col h-full"
              >
                {/* BADGE */}
                <div className="absolute top-5 right-5 z-20 bg-[#2bb673] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {doctor.availability}
                </div>

                {/* IMAGE (FIXED HEIGHT FOR ALL CARDS) */}
                <div className="h-[420px] w-full overflow-hidden flex-shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {doctor.icon}
                    {doctor.specialty}
                  </div>

                  <h3 className="text-2xl font-bold text-[#065f46]">
                    {doctor.name}
                  </h3>

                  <div className="mt-4 space-y-3 text-gray-600">
                    <p>🏥 {doctor.hospital}</p>
                    <p>⏱ {doctor.experience}</p>
                    <p>🎥 Secure Online Consultation</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="text-[#f59e0b] font-semibold flex items-center gap-1">
                      <Star size={16} /> {doctor.rating}
                    </span>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewSpecialists;
