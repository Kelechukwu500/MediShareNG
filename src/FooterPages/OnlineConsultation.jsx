import React from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Stethoscope,
  CalendarDays,
  ShieldCheck,
  Clock3,
  HeartPulse,
  Pill,
  FileText,
  ArrowRight,
  BadgeCheck,
  Activity,
  Brain,
  MessageCircleMore,
} from "lucide-react";

import consult from "../assets/consult.jpg";

const OnlineConsultation = () => {
  const consultationFeatures = [
    {
      icon: <Video size={30} />,
      title: "HD Video Consultation",
      text: "Consult licensed doctors securely through high-quality video calls from anywhere.",
    },
    {
      icon: <CalendarDays size={30} />,
      title: "Instant Appointment Booking",
      text: "Book appointments with specialists, hospitals, and wellness experts in minutes.",
    },
    {
      icon: <FileText size={30} />,
      title: "Digital Medical Records",
      text: "Access prescriptions, reports, diagnoses, and consultation history securely online.",
    },
    {
      icon: <Pill size={30} />,
      title: "Online Prescriptions",
      text: "Receive digital prescriptions instantly and connect directly to pharmacies.",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Private & Secure",
      text: "Your health information is encrypted and protected with advanced security systems.",
    },
    {
      icon: <HeartPulse size={30} />,
      title: "24/7 Healthcare Access",
      text: "Get healthcare support anytime with round-the-clock doctor availability.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      text: "Sign up and create your secure MediShareNG patient profile.",
    },
    {
      number: "02",
      title: "Choose a Doctor",
      text: "Browse available doctors, specialists, labs, and wellness coaches.",
    },
    {
      number: "03",
      title: "Book Consultation",
      text: "Schedule an online consultation at your preferred time.",
    },
    {
      number: "04",
      title: "Start Video Session",
      text: "Consult the doctor through secure video, voice, or live chat.",
    },
  ];

  // SMOOTH SCROLL FUNCTION
  const scrollToSpecialists = () => {
    document.getElementById("consultation-actions")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-[#f5f7f6]">
      {/* HERO SECTION */}
      <div
        className="relative w-full min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${consult})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#dff4ea]/90 text-[#065f46] px-5 py-2 rounded-full shadow-lg border border-[#b7e4d2] backdrop-blur-md">
              <BadgeCheck size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">
                Smart Digital Consultation
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-white">
              Consult Doctors
              <span className="block text-[#2bb673]">Anytime, Anywhere</span>
            </h1>

            {/* Text */}
            <p className="mt-6 text-gray-200 text-base sm:text-lg leading-relaxed max-w-2xl">
              MediShareNG connects patients to certified hospitals, doctors,
              pharmacies, laboratories, and wellness professionals through a
              modern digital healthcare ecosystem designed for speed,
              convenience, and accessibility.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mt-10">
              <button
                onClick={scrollToSpecialists}
                className="bg-[#2bb673] hover:bg-[#22a363] transition-all duration-300 text-white px-8 h-14 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
              >
                Start Consultation
                <ArrowRight size={20} />
              </button>

              <button
                onClick={scrollToSpecialists}
                className="border border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 text-white px-8 h-14 rounded-2xl font-semibold"
              >
                Explore Specialists
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-14">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center">
                <h2 className="text-3xl font-black text-[#2bb673]">24/7</h2>
                <p className="text-white text-sm mt-2">Healthcare Access</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center">
                <h2 className="text-3xl font-black text-[#2bb673]">500+</h2>
                <p className="text-white text-sm mt-2">Doctors Available</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center">
                <h2 className="text-3xl font-black text-[#2bb673]">99%</h2>
                <p className="text-white text-sm mt-2">Secure Platform</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center">
                <h2 className="text-3xl font-black text-[#2bb673]">15k+</h2>
                <p className="text-white text-sm mt-2">Monthly Patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2]">
              <Activity size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">
                Consultation Features
              </span>
            </div>

            <h2 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46] leading-tight">
              Modern Healthcare Experience
            </h2>

            <p className="mt-5 text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
              Experience a secure and seamless online healthcare system with
              advanced digital consultation features.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultationFeatures.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#dff4ea] text-[#065f46] flex items-center justify-center">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[#065f46]">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.text}
                </p>

               
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2]">
              <MessageCircleMore size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">
                How It Works
              </span>
            </div>

            <h2 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
              Consult Doctors in Simple Steps
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-[#f8fbfa] rounded-[2rem] p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-6 right-6 text-5xl font-black text-[#dff4ea]">
                  {step.number}
                </div>

                <div className="w-16 h-16 rounded-full bg-[#065f46] text-white flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[#065f46]">
                  {step.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS SECTION */}
      <section
        id="consultation-actions"
        className="py-20 px-4 sm:px-6 lg:px-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#065f46] to-[#2bb673] rounded-[3rem] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Floating Icons */}
            <div className="absolute top-10 right-10 opacity-20">
              <Brain size={120} />
            </div>

            <div className="absolute bottom-10 left-10 opacity-20">
              <Stethoscope size={120} />
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
                <Clock3 size={18} />
                <span className="font-semibold text-sm uppercase tracking-wide">
                  Fast & Reliable
                </span>
              </div>

              <h2 className="mt-8 text-4xl sm:text-5xl font-black leading-tight">
                Connect with Trusted Healthcare Professionals
              </h2>

              <p className="mt-6 text-lg text-white/90 leading-relaxed">
                Access certified doctors, pharmacists, laboratories, and
                wellness experts without visiting the hospital physically.
                MediShareNG makes healthcare faster, safer, and more accessible.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mt-10">
                <Link to="/consultation-flow">
                  <button className="bg-white text-[#065f46] hover:bg-gray-100 transition-all duration-300 px-8 h-14 rounded-2xl font-semibold shadow-lg">
                    Book Consultation
                  </button>
                </Link>

                <Link to="/view-specialists">

                <button className="border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 px-8 h-14 rounded-2xl font-semibold">
                  View Specialists
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default OnlineConsultation;
