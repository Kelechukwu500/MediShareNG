
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import EcosystemSection from "../components/EcosystemSection";
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Bolt,
  Building2,
  PhoneCall,
} from "lucide-react";

import medcta from "../assets/medcta.jpg";
import meddigital from "../assets/meddigital.jpg";
import medmed from "../assets/medmed.jpg";


import counseling1 from "../assets/counseling1.jpg";
import counseling2 from "../assets/counseling2.jpg";
import counseling3 from "../assets/counseling3.jpg";
import counseling4 from "../assets/counseling4.jpg";
import counseling5 from "../assets/counseling5.jpg";
import counseling6 from "../assets/counseling6.jpg";
import counseling7 from "../assets/counseling7.jpg";
import counseling8 from "../assets/counseling8.jpg";
import counseling9 from "../assets/counseling9.jpg";
import counseling10 from "../assets/counseling10.jpg";

const images = [
  counseling1,
  counseling2,
  counseling3,
  counseling4,
  counseling5,
  counseling6,
  counseling7,
  counseling8,
  counseling9,
  counseling10,
];




const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const badgeFloat = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};


const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};


const breatheAnimation = {
  scale: [1, 1.03, 1],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};



{
  /* TESTIMONIAL DATA */
}
const testimonials = [
  {
    name: "Chinedu Okafor",
    text: "MedConnectNG helped me book a doctor instantly without stress. The experience was smooth and professional.",
  },
  {
    name: "Aisha Bello",
    text: "I never imagined healthcare could be this easy. MedConnectNG made accessing medical care fast and reliable.",
  },
  {
    name: "Adeola Johnson",
    text: "From online consultations to pharmacy access, MedConnectNG has completely changed how I manage my health.",
  },
  {
    name: "Ifeoma Eze",
    text: "The platform is modern, simple, and very responsive. I recommend MedConnectNG to everyone.",
  },
  {
    name: "Musa Abdullahi",
    text: "Excellent healthcare platform with trusted doctors and quick appointment scheduling.",
  },
  {
    name: "Temitope Adebayo",
    text: "MedConnectNG gives a truly next-generation healthcare experience. Everything works seamlessly.",
  },
  {
    name: "Ucheoma Nwosu", 
    text: "MedConnectNG has revolutionized the way I access healthcare. It's efficient, user-friendly, and reliable.",
  },
  {
    name: "Emeka Chukwuemeka",
    text: "MedConnectNG has transformed my healthcare experience. It's innovative and easy to use.",
  },
  {
    name: "Fatima Yusuf",
    text: "MedConnectNG is a game-changer in healthcare. The platform is intuitive and the service is excellent.",
  },
  {
    name: "Queeneth Osifo",
    text: "MedConnectNG has made healthcare accessible and convenient. I can't imagine going back to the old way.",
  },
];



const Hero = () => {
  const scrollRef = useRef(null);

  const [current, setCurrent] = useState(0);

  const [showVideo, setShowVideo] = useState(false);

  // testimonial auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // carousel auto scroll
 useEffect(() => {
   const container = scrollRef.current;
   if (!container) return;

   let scrollAmount = 0;
   const speed = 2; // adjust speed here

   const interval = setInterval(() => {
     scrollAmount += speed;
     container.scrollLeft = scrollAmount;

     // 🔥 smooth infinite loop (NO JUMP)
     if (scrollAmount >= container.scrollWidth / 2) {
       scrollAmount = 0;
     }
   }, 16);

   return () => clearInterval(interval);
 }, []);

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="w-full min-h-screen bg-[#eef3f1] overflow-hidden flex items-center px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {/* TOP MINI LABEL */}
              <div className="inline-flex items-center gap-3 bg-[#dff3ea] border border-[#b7e4d1] rounded-full px-5 py-3 shadow-sm">
                <Zap className="text-[#065f46]" size={18} />
                <span className="text-[#065f46] font-bold uppercase tracking-wider text-sm">
                  Healthcare Powered By Innovation
                </span>
              </div>

              <h1 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[4rem] leading-[0.9] font-black tracking-tight">
                <span className="text-[#065f46] block">Smart Care</span>
                <span className="text-[#065f46] block">Meets</span>
                <span className="text-[#2bb673] block">Human Care</span>
              </h1>

              <p className="text-gray-500 text-base sm:text-lg leading-8 max-w-xl pt-4">
                <span className="text-[#2bb673] font-semibold">
                  MediShareNG
                </span>{" "}
                is an integrated digital healthcare platform built for today’s
                world. From AI-powered medical support to effortless doctor
                discovery, it transforms and improves every stage of your
                healthcare experience.
              </p>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <Link to="/online-consultation">
                <button className="bg-[#065f46] hover:bg-[#044e3a] transition-all duration-300 text-white px-8 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-105">
                  Get Started Now
                  <ArrowRight size={10} />
                </button>
              </Link>

              <button
                onClick={() => setShowVideo(true)}
                className="bg-white text-black px-8 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300"
              >
                <Play size={10} fill="black" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE SECTION */}
          <motion.div
            animate={floatingAnimation}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[620px]">
              <div className="overflow-hidden rounded-[40px] shadow-2xl border border-white/30 backdrop-blur-lg">
                <img
                  src={medcta}
                  alt="Healthcare AI"
                  className="w-full h-[260px] sm:h-[430px] lg:h-[500px] object-cover"
                />
              </div>

              {/* BADGES */}
              <motion.div
                animate={badgeFloat}
                className="absolute top-8 left-[-10px] sm:left-[-30px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-[28px] px-5 py-4 flex items-center gap-4 border border-white"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <HeartPulse className="text-green-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Heart Rate
                  </p>
                  <h3 className="font-bold text-2xl text-gray-900">72 BPM</h3>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  ...badgeFloat,
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute bottom-10 right-[-5px] sm:right-[-40px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-[28px] px-5 py-4 flex items-center gap-4 border border-white"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <ShieldCheck className="text-blue-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Security</p>
                  <h3 className="font-bold text-2xl text-gray-900 leading-tight">
                    End-to-
                    <br />
                    End
                  </h3>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  ...badgeFloat,
                  transition: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute bottom-[-20px] left-[20%] sm:left-[30%] bg-white/90 backdrop-blur-xl shadow-2xl rounded-[28px] px-5 py-4 flex items-center gap-4 border border-white"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Activity className="text-emerald-600" size={28} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    AI Monitoring
                  </p>
                  <h3 className="font-bold text-xl text-gray-900">
                    24/7 Active
                  </h3>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* TRUSTED USERS + STATS */}
          <div className="pt-8 sm:pt-10 lg:col-span-2">
            {/* TRUSTED USERS */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center -space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="user"
                  className="w-12 h-12 rounded-full border-[3px] border-[#eef3f1] object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="user"
                  className="w-12 h-12 rounded-full border-[3px] border-[#eef3f1] object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="user"
                  className="w-12 h-12 rounded-full border-[3px] border-[#eef3f1] object-cover"
                />
                <div className="w-12 h-12 rounded-full border-[3px] border-[#eef3f1] bg-[#065f46] flex items-center justify-center text-white text-sm font-bold">
                  +5k
                </div>
              </div>

              <p className="text-gray-500 text-[15px] sm:text-base">
                Trusted by{" "}
                <span className="font-bold text-[#065f46]">7,000+</span>{" "}
                patients worldwide
              </p>
            </div>

            {/* STATS */}
            <div className="mt-12 mx-auto sm:mt-14 bg-[#f8fbfa] py-10 sm:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
                  {/* Stat Items */}
                  <div className="flex flex-col w-full items-center text-center">
                    <Globe className="text-[#2bb673] mb-4" size={26} />
                    <h2 className="text-[2.5rem] sm:text-[2.2rem] font-extrabold text-[#065f46] leading-none tracking-tight">
                      99.9%
                    </h2>
                    <p className="mt-3 text-gray-500 uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                      System Uptime
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <Bolt className="text-[#f59e0b] mb-4" size={26} />
                    <h2 className="text-[2.5rem] sm:text-[2.2rem] font-black text-[#065f46] leading-none">
                      15min
                    </h2>
                    <p className="mt-3 text-gray-500 uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                      Avg. Response Time
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <Building2 className="text-[#2563eb] mb-4" size={26} />
                    <h2 className="text-[2.5rem] sm:text-[2.2rem] font-black text-[#065f46] leading-none">
                      100+
                    </h2>
                    <p className="mt-3 text-gray-500 uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                      Partner Hospitals
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <PhoneCall className="text-[#ef4444] mb-4" size={26} />
                    <h2 className="text-[2.5rem] sm:text-[2.2rem] font-black text-[#065f46] leading-none">
                      24/7
                    </h2>
                    <p className="mt-3 text-gray-500 uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                      Emergency Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 text-white text-2xl z-10"
            >
              ✕
            </button>

            {/* VIDEO AUTO PLAY */}
            <video
              src="/medivideo.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* ==================== ECOSYSTEM SECTION ==================== */}
      <EcosystemSection />

      <section class="w-full bg-gray-200 py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                💬
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                AI Symptom Checker
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                Our proprietary LLM analyzes your symptoms and provides an
                immediate triage level before you even book a call.
              </p>
              <Link
                to="/ai-symptoms-checker"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                📋
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                Smart Health Records
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                All your lab results, prescriptions, and medical history stored
                in a secure, immutable digital vault accessible anywhere.
              </p>
              <Link
                to="/smart-health-records"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                🏅
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                Certified Specialists
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                Connect with board-certified practitioners across 40+
                specialties within minutes via HD video or chat.
              </p>
              <Link
                to="/certified-specialists"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                💊
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                Digital Pharmacy
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                Prescriptions are sent instantly to our network pharmacies for
                same-day delivery right to your front door.
              </p>
              <Link
                to="/digital-pharmacy"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                🧪
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                Connected Diagnostics
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                Schedule home-collection for lab tests. Results sync directly to
                your profile and your doctor's dashboard.
              </p>
              <Link
                to="/connected-diagnostics"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                🧘
              </div>
              <h3 class="text-2xl font-bold text-emerald-800 mb-3">
                Wellness Coaching
              </h3>
              <p class="text-gray-600 leading-relaxed mb-8">
                Ongoing support for mental health, nutrition, and chronic
                condition management from dedicated professionals.
              </p>
              <Link
                to="/wellness-coaching"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore More
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#0a3d2f] py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                animate={badgeFloat}
                className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium tracking-wider"
              >
                PLATFORM INTELLIGENCE
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-white leading-tight">
                Your Health,
                <br />
                Under One Command
              </h2>

              <p className="text-base sm:text-lg text-white/80 max-w-lg">
                Enjoy a beautifully intuitive and lightning-fast interface
                designed for clarity. Our advanced dashboard provides a
                comprehensive panoramic view of your vitals, appointments,
                medications, and smart health insights — all in one place.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-white/90">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Real-time vitals sync from wearable devices</span>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>One-click emergency response activation</span>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>AI-powered health trend forecasting</span>
                </div>
                <div className="flex items-start gap-3 text-white/90">
                  <span className="text-emerald-400 mt-1">✔</span>
                  <span>Secure collaborative care for family members</span>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative flex justify-center lg:justify-end pt-8 lg:pt-0">
              <motion.div
                animate={floatingAnimation}
                className="relative w-full max-w-[520px] lg:max-w-[620px]"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    src={meddigital}
                    alt="MedConnectNG Platform Dashboard"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Top Performance Card - Better mobile positioning */}
                <div className="absolute -bottom-6 left-4 sm:left-6 lg:-left-8 bg-white rounded-2xl p-5 sm:p-6 shadow-xl max-w-[260px]">
                  <div className="font-semibold text-emerald-700 mb-1">
                    Top Performance
                  </div>
                  <p className="text-gray-600 text-sm leading-tight">
                    Our platform processes over <br />
                    <span className="font-bold text-gray-900">
                      10k requests per second
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Side - Image (Reduced Size) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="relative flex justify-center lg:justify-start"
            >
              <div className="w-full max-w-[520px] lg:max-w-[620px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src={medmed}
                  alt="Global Medical Network"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-800 leading-tight">
                  Excellence in Care Across Nigeria
                </h2>
              </div>

              <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                At{" "}
                <span className="text-[#2bb673] font-semibold">
                  MediShareNG
                </span>
                , we partner with leading hospitals, laboratories, and
                pharmacies to make world-class healthcare accessible to you
                anytime, anywhere — just one click away..
              </p>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-y-8 pt-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    450+
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Hospitals
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    1,200+
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Pharmacies
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    800+
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Laboratories
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    5,000+
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Practitioners
                  </p>
                </div>
              </div>

              {/* Button */}
              <Link to="/become-a-partner">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 px-8 py-4 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white rounded-2xl font-medium text-base sm:text-lg transition-all duration-300 mx-auto lg:mx-0 block"
                >
                  Become a Partner
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-200 py-16 md:py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={breatheAnimation}
            className="bg-emerald-700 rounded-[2.75rem] px-8 md:px-16 py-16 md:py-20 text-center text-white relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Step into the Future of Care
              </h2>

              {/* Subtext */}
              <p className="text-lg md:text-xl text-emerald-100 max-w-lg mx-auto">
                Your healthcare experience should be simple and stress-free.
                Begin your next-generation journey with{" "}
                <span className="text-[#2bb673] font-semibold">
                  MediShareNG
                </span>{" "}
                today.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link to="/online-consultation">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-3xl hover:bg-emerald-50 transition-all duration-300"
                  >
                    Get Started for Free
                  </motion.button>
                </Link>

                <Link to="/pricing-plans">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 border-2 border-white text-white font-semibold text-lg rounded-3xl hover:bg-white/10 transition-all duration-300"
                  >
                    View Enterprise Plans
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="w-full bg-[#f8fbfa] py-14 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden relative">
        {/* Floating Background Images */}
        <img
          src={counseling1}
          alt=""
          className="absolute top-20 left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling2}
          alt=""
          className="absolute top-32 right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling3}
          alt=""
          className="absolute top-[45%] left-4 sm:left-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling4}
          alt=""
          className="absolute top-[40%] right-6 sm:right-16 w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling5}
          alt=""
          className="absolute bottom-32 left-10 sm:left-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling6}
          alt=""
          className="absolute bottom-28 right-10 sm:right-24 w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover opacity-90"
        />

        <img
          src={counseling7}
          alt=""
          className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover opacity-90 hidden md:block"
        />

        <img
          src={counseling8}
          alt=""
          className="absolute top-1/3 right-1/4 w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover opacity-90 hidden md:block"
        />

        <img
          src={counseling9}
          alt=""
          className="absolute bottom-20 left-1/3 w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover opacity-90 hidden md:block"
        />

        <img
          src={counseling10}
          alt=""
          className="absolute bottom-16 right-1/3 w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover opacity-90 hidden md:block"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Heading */}
          <button className="bg-green-100 text-green-700 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold mb-5 sm:mb-6 cursor-default">
            Testimonials
          </button>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            What Nigerians Are Saying About{" "}
            <span className="text-green-600">MediShareNG</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto mb-10 sm:mb-14 px-2 sm:px-0">
            Trusted by patients across Nigeria for seamless, reliable, and
            modern healthcare access.
          </p>

          {/* Carousel */}
          <div className="relative w-full flex items-center justify-center min-h-[260px] sm:min-h-[300px] md:min-h-[320px]">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className={`absolute w-full flex justify-center transition-all duration-1000 ease-in-out transform ${
                  index === current
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 sm:translate-y-10 scale-95"
                }`}
              >
                <div className="bg-white shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 w-[92%] sm:w-[85%] md:max-w-3xl mx-auto border border-green-100">
                  <FaQuoteLeft className="text-green-500 text-3xl sm:text-4xl mb-4 sm:mb-6 mx-auto" />

                  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                    "{item.text}"
                  </p>

                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      {item.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 ${
                  current === index
                    ? "w-8 sm:w-10 bg-green-600"
                    : "w-2.5 sm:w-3 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-200 py-14 sm:py-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6" />
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our Counseling Gallery
          </h2>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-2 max-w-2xl mx-auto">
            A glimpse into our professional counseling and care environment.
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden w-full">
          <div className="flex gap-4 animate-scroll w-[100%]">
            {[...images, ...images].map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[25%]"
              >
                <img
                  src={img}
                  alt={`counseling-${index + 1}`}
                  className="w-full h-80 sm:h-60 md:h-72 object-cover rounded-2xl shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar (optional but clean UI) */}
        <style>
          {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
        </style>
      </section>
    </>
  );
};

export default Hero;
