import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FlaskConical,
  FileText,
  Activity,
  Clock3,
  ShieldCheck,
  Search,
  CalendarDays,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import labHero from "../assets/counseling4.jpg";

const LaboratoryTests = () => {
  const labFeatures = [
    {
      icon: <FlaskConical size={28} />,
      title: "Advanced Lab Testing",
      text: "Access accurate diagnostic tests including blood, urine, and specialized screenings.",
    },
    {
      icon: <FileText size={28} />,
      title: "Digital Reports",
      text: "Receive instant lab results directly on your dashboard securely.",
    },
    {
      icon: <Activity size={28} />,
      title: "Health Monitoring",
      text: "Track your health metrics and trends over time with smart reports.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Data Storage",
      text: "Your medical test results are encrypted and safely stored.",
    },
    {
      icon: <Clock3 size={28} />,
      title: "Fast Turnaround",
      text: "Get results quickly with efficient laboratory processing.",
    },
    {
      icon: <Search size={28} />,
      title: "Find Nearby Labs",
      text: "Locate verified laboratories close to your location instantly.",
    },
  ];

  return (
    <section className="w-full bg-[#f5f7f6] overflow-hidden">
      {/* HERO SECTION */}
      <div
        className="relative min-h-[90vh] flex items-center bg-cover bg-center pt-28 px-4 sm:px-6 lg:px-10"
        style={{ backgroundImage: `url(${labHero})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-4xl">
          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-[#dff4ea]/90 text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2] backdrop-blur-md"
          >
            <BadgeCheck size={18} />
            <span className="text-sm font-semibold uppercase">
              Laboratory Services
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Accurate Lab Tests
            <span className="block text-[#2bb673]">Anytime, Anywhere</span>
          </h1>

          <p className="mt-6 text-gray-200 text-base sm:text-lg max-w-2xl">
            MediShareNG connects you to certified laboratories for fast,
            reliable, and secure medical testing with instant digital results.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <button className="bg-[#2bb673] hover:bg-[#22a363] text-white px-8 h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all">
              Book Test
              <ArrowRight size={18} />
            </button>

            <button className="border border-white/30 bg-white/10 hover:bg-white/20 text-white px-8 h-14 rounded-2xl font-semibold backdrop-blur-md transition-all">
              View Results
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2]"
            >
              <Activity size={18} />
              <span className="text-sm font-semibold uppercase">
                Lab Features
              </span>
            </motion.div>

            <h2 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
              Modern Diagnostic Experience
            </h2>

            <p className="mt-5 text-gray-600 max-w-2xl mx-auto">
              Fast, secure and reliable laboratory services designed for modern
              healthcare needs.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {labFeatures.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#dff4ea] text-[#065f46] rounded-2xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#065f46]">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-600">{item.text}</p>

                <button className="mt-6 text-[#2bb673] font-semibold flex items-center gap-2">
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* CTA SECTION */}
          <div className="mt-20 bg-gradient-to-r from-[#065f46] to-[#2bb673] rounded-[3rem] p-10 text-white text-center">
            <h3 className="text-3xl sm:text-4xl font-black">
              Need a Lab Test Today?
            </h3>

            <p className="mt-4 text-white/90">
              Book a laboratory test and get fast, accurate results delivered
              digitally.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-5">
              <button className="bg-white text-[#065f46] px-8 h-14 rounded-2xl font-semibold">
                Book Now
              </button>

            <Link to="/lab-finder">
              <button className="border border-white/30 bg-white/10 px-8 h-14 rounded-2xl font-semibold">
                Find Labs Near Me
              </button>
            </Link>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryTests;
