import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const ConsultationFlow = () => {
  const navigate = useNavigate();
  const consultationSteps = [
    {
      number: "01",
      icon: <UserPlus size={34} />,
      title: "Create an Account",
      text: "Sign up securely on MediShareNG and create your personal healthcare profile to access digital consultation services.",
      route: "/signup",
    },
    {
      number: "02",
      icon: <Stethoscope size={34} />,
      title: "Choose a Doctor",
      text: "Browse through verified doctors, specialists, wellness experts, and hospitals based on your healthcare needs.",
      route: "/doctors-page",
    },
    {
      number: "03",
      icon: <CalendarDays size={34} />,
      title: "Book Consultation",
      text: "Schedule your online consultation instantly by selecting your preferred date and consultation time.",
      route: "/book-consultation",
    },
    {
      number: "04",
      icon: <Video size={34} />,
      title: "Start Video Session",
      text: "Connect securely with your doctor through HD video consultation from anywhere using MediShareNG.",
      route: "/doctor-dashboard",
    },
  ];

  return (
    <section className="w-full bg-[#f5f7f6] overflow-hidden py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* TOP HEADING */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2] shadow-sm">
            <BadgeCheck size={18} />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Online Consultation Process
            </span>
          </div>

          <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-[#065f46]">
            Connect with Doctors
            <span className="block text-[#2bb673]">in Four Simple Steps</span>
          </h1>

          <p className="mt-6 text-gray-600 text-base sm:text-lg leading-relaxed">
            MediShareNG provides a secure and modern healthcare experience where
            patients can consult hospitals, doctors, pharmacies, laboratories,
            and wellness professionals online from anywhere.
          </p>
        </div>

        {/* STEPS SECTION */}
        <div className="relative mt-20">
          <div className="hidden lg:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-[#065f46] via-[#2bb673] to-[#065f46] rounded-full"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {consultationSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 relative overflow-hidden hover:-translate-y-3 transition-all duration-300"
              >
                <div className="absolute top-5 right-5 text-6xl font-black text-[#dff4ea]">
                  {step.number}
                </div>

                <div className="w-20 h-20 rounded-3xl bg-[#065f46] text-white flex items-center justify-center shadow-lg relative z-10">
                  {step.icon}
                </div>

                <h2 className="mt-8 text-2xl font-bold text-[#065f46] relative z-10">
                  {step.title}
                </h2>

                <p className="mt-5 text-gray-600 leading-relaxed relative z-10">
                  {step.text}
                </p>

                {/* ✅ ONLY CHANGE ADDED HERE */}
                <button
                  onClick={() => navigate(step.route)}
                  className="mt-8 flex items-center gap-2 text-[#2bb673] font-semibold hover:gap-3 transition-all duration-300"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM INFO SECTION */}
        <div className="mt-24">
          <div className="bg-gradient-to-r from-[#065f46] to-[#2bb673] rounded-[3rem] p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-md px-5 py-2 rounded-full">
                  <ShieldCheck size={18} />
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    Secure Healthcare Access
                  </span>
                </div>

                <h2 className="mt-8 text-4xl sm:text-5xl font-black leading-tight">
                  Safe, Fast & Reliable Digital Consultation
                </h2>

                <p className="mt-6 text-lg text-white/90 leading-relaxed">
                  Consult doctors securely through high-quality video sessions,
                  access prescriptions online, receive expert healthcare
                  support, and manage your health from the comfort of your home.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mt-10">
                  <button className="bg-white text-[#065f46] hover:bg-gray-100 transition-all duration-300 px-8 h-14 rounded-2xl font-semibold shadow-xl">
                    Start Consultation
                  </button>

                  <button className="border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 px-8 h-14 rounded-2xl font-semibold backdrop-blur-md">
                    Explore Doctors
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                  <Clock3 size={35} />
                  <h3 className="mt-5 text-2xl font-bold">24/7 Access</h3>
                  <p className="mt-3 text-white/80">
                    Connect with healthcare professionals anytime you need help.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                  <ShieldCheck size={35} />
                  <h3 className="mt-5 text-2xl font-bold">Secure Platform</h3>
                  <p className="mt-3 text-white/80">
                    Patient data and consultations are encrypted and protected.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                  <HeartPulse size={35} />
                  <h3 className="mt-5 text-2xl font-bold">Expert Healthcare</h3>
                  <p className="mt-3 text-white/80">
                    Access certified specialists and trusted hospitals online.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                  <Video size={35} />
                  <h3 className="mt-5 text-2xl font-bold">HD Video Calls</h3>
                  <p className="mt-3 text-white/80">
                    Enjoy seamless consultation sessions with crystal-clear
                    video quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationFlow;
