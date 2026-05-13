import React from "react";
import {
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Globe,
  Clock3,
  BadgeCheck,
  MapPin,
  LaptopMinimal,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const History = () => {
  const values = [
    {
      icon: <MapPin size={28} />,
      title: "Accessibility",
      text: "We make healthcare services easier to discover and access for everyone.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Transparency",
      text: "Clear service information and pricing for informed healthcare decisions.",
    },
    {
      icon: <Clock3 size={28} />,
      title: "Efficiency",
      text: "Connecting patients and providers faster with fewer barriers.",
    },
    {
      icon: <LaptopMinimal size={28} />,
      title: "Innovation",
      text: "Using modern technology to improve healthcare access and experiences.",
    },
    {
      icon: <BadgeCheck size={28} />,
      title: "Trust",
      text: "Building reliable relationships between users and verified providers.",
    },
    {
      icon: <Users size={28} />,
      title: "Patient-Centered",
      text: "Putting the needs and convenience of patients first always.",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gray-100 py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-14 sm:mb-16">
          <button className="px-4 sm:px-6 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold shadow-lg mb-5 text-sm sm:text-base">
            MedConnectNG
          </button>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
            The Gateway To <br />
            <span className="text-emerald-600">Health Services Connection</span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-600 text-base sm:text-lg mt-5 sm:mt-6 leading-relaxed px-2">
            MedConnectNG is a digital healthcare marketplace connecting
            individuals with trusted healthcare providers across Nigeria and
            beyond through a seamless and transparent experience.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mt-8">
            <button className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-full shadow-lg hover:scale-105 transition">
              Explore Services
            </button>

            <button className="w-full sm:w-auto bg-white border border-emerald-200 text-emerald-700 px-6 sm:px-8 py-3 rounded-full shadow-lg hover:bg-emerald-50 transition">
              Trusted Providers
            </button>
          </div>
        </div>

        {/* ABOUT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-5 sm:mb-6">
              <HeartPulse size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Who We Are
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              We simplify healthcare access by helping users discover hospitals,
              diagnostic centers, specialists, and healthcare services closest
              to them while empowering providers to showcase their services.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 mb-5 sm:mb-6">
              <Stethoscope size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              What Users Can Do
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm sm:text-base">
              <li>✔ Discover nearby healthcare services</li>
              <li>✔ Book appointments online</li>
              <li>✔ Request estimated treatment costs</li>
              <li>✔ Schedule virtual consultations</li>
              <li>✔ Compare providers and services</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-5 sm:mb-6">
              <Globe size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Our Goal
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To transform healthcare accessibility in Nigeria through
              technology, transparency, and stronger patient-provider
              connections.
            </p>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20">
          <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
            <button className="bg-white/20 px-4 sm:px-5 py-2 rounded-full shadow-lg mb-5 sm:mb-6 text-sm sm:text-base">
              Our Mission
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">
              Simplifying Healthcare Access
            </h2>

            <p className="leading-relaxed text-base sm:text-lg">
              We connect individuals with trusted healthcare providers through
              an efficient and transparent digital marketplace that empowers
              informed healthcare decisions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-100">
            <button className="bg-emerald-100 text-emerald-700 px-4 sm:px-5 py-2 rounded-full shadow-lg mb-5 sm:mb-6 text-sm sm:text-base">
              Our Vision
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5">
              Nigeria’s Leading Digital Healthcare Gateway
            </h2>

            <p className="leading-relaxed text-gray-600 text-base sm:text-lg">
              We envision a future where discovering, accessing, and
              experiencing healthcare becomes seamless for everyone locally and
              globally.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div>
          <div className="text-center mb-12 sm:mb-14">
            <button className="px-4 sm:px-6 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold shadow-lg mb-5 text-sm sm:text-base">
              Core Values
            </button>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Principles That Guide Us
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Our commitment to healthcare innovation, trust, accessibility, and
              patient-centered service drives everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:-translate-y-2 transition duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 sm:mb-6">
                  {value.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {value.text}
                </p>

                <button
                  onClick={() => navigate("/learn-more")}
                  className="mt-6 px-5 py-2 rounded-full bg-gray-100 text-gray-700 shadow-lg text-sm sm:text-base hover:bg-gray-200 transition"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOT NOTE */}
        <div className="mt-20 sm:mt-24 text-center">
          <div className="bg-white border border-emerald-100 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5">
              MedConnectNG
            </h2>

            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
              Bridging the gap between healthcare providers and patients through
              technology-driven solutions that improve transparency,
              accessibility, and healthcare experiences across Nigeria.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mt-8">
              <button className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-full shadow-lg">
                Trusted Healthcare
              </button>

              <button className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 sm:px-8 py-3 rounded-full shadow-lg">
                Digital Innovation
              </button>

              <button className="w-full sm:w-auto bg-green-100 text-green-700 px-6 sm:px-8 py-3 rounded-full shadow-lg">
                Patient First
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;
