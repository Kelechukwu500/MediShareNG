import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BadgeCheck,
  UserPlus,
  Stethoscope,
  CalendarDays,
  Video,
  ArrowRight,
  ShieldCheck,
  Clock3,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";

const ConsultationFlow = () => {
  const navigate = useNavigate();

  const consultationSteps = [
    {
      number: "01",
      icon: <UserPlus size={34} />,
      title: "Choose Doctor",
      text: "Select a certified doctor or specialist that fits your health needs.",
    },
    {
      number: "02",
      icon: <Stethoscope size={34} />,
      title: "Book Consultation",
      text: "Schedule your consultation instantly with your preferred doctor.",
    },
    {
      number: "03",
      icon: <Video size={34} />,
      title: "Video Session",
      text: "Join a secure HD video call with your doctor in real time.",
    },
  ];

  // 🚀 PURE FLOW (NO AUTH LOCK)
  const handleStartFlow = () => {
    navigate("/doctors-page");
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#f4fffa] via-white to-[#f3f4f6] overflow-hidden py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#065f46] via-[#0f766e] to-[#2bb673] p-10 sm:p-14 lg:p-20 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-md">
                <BadgeCheck size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Digital Consultation Flow
                </span>
              </div>

              <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Start Your
                <span className="block text-[#d1fae5]">
                  Online Consultation
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-2xl">
                Connect instantly with certified doctors, book appointments, and
                start secure video consultations without barriers.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-5 mt-12">
                <button
                  onClick={handleStartFlow}
                  className="group bg-white text-[#065f46] hover:bg-[#d1fae5] transition-all duration-300 px-8 h-16 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3"
                >
                  Start Consultation Flow
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-all duration-300"
                  />
                </button>

                <Link to="/view-specialists">
                  <button className="border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 px-8 h-16 rounded-2xl font-semibold backdrop-blur-md">
                    Explore Doctors
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT STEPS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {consultationSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white/10 border border-white/20 backdrop-blur-md rounded-[2rem] p-7 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-white text-[#065f46] flex items-center justify-center shadow-lg">
                      {step.icon}
                    </div>

                    <h2 className="text-5xl font-black text-white/20">
                      {step.number}
                    </h2>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>

                  <p className="mt-4 text-white/80 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-lg">
            <ShieldCheck size={38} className="text-[#2bb673]" />
            <h2 className="mt-5 text-3xl font-black text-[#065f46]">Secure</h2>
            <p className="mt-3 text-gray-600">
              Safe and encrypted consultations.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-lg">
            <HeartPulse size={38} className="text-[#2bb673]" />
            <h2 className="mt-5 text-3xl font-black text-[#065f46]">Experts</h2>
            <p className="mt-3 text-gray-600">
              Certified doctors available anytime.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-lg">
            <Video size={38} className="text-[#2bb673]" />
            <h2 className="mt-5 text-3xl font-black text-[#065f46]">Video</h2>
            <p className="mt-3 text-gray-600">
              HD consultation with real doctors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationFlow;
