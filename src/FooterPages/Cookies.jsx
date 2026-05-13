import React from "react";
import { motion } from "framer-motion";
import hospital1 from "../assets/hospital1.jpg";
import {
  Cookie,
  Eye,
  Settings,
  ShieldCheck,
  Activity,
  Database,
} from "lucide-react";

const Cookies = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center py-24 px-4 sm:px-6 lg:px-10 relative"
      style={{ backgroundImage: `url(${hospital1})` }}
    >
      {/* DARKER OVERLAY (REDUCED BRIGHTNESS MORE) */}
      <div className="absolute inset-0 bg-black/85"></div>

      <div className="relative max-w-6xl mx-auto text-white">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-black">Cookies Policy</h1>

          <p className="mt-4 text-gray-300 leading-relaxed">
            At <span className="text-[#2bb673] font-semibold">MediShareNG</span>
            , we use cookies to improve your healthcare experience, secure your
            sessions, and personalize your medical journey across our platform.
          </p>
        </div>

        {/* EXPANDED INFO SECTION */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Cookie />,
              title: "What Are Cookies?",
              text: "Cookies are small data files stored on your device that help us recognize your preferences and improve your experience on MediShare.NG.",
            },
            {
              icon: <Activity />,
              title: "Why We Use Cookies",
              text: "We use cookies to enhance doctor search results, improve booking speed, and personalize healthcare recommendations.",
            },
            {
              icon: <Eye />,
              title: "User Experience Tracking",
              text: "Cookies help us understand how users interact with the platform so we can improve usability and navigation.",
            },
            {
              icon: <Database />,
              title: "Healthcare Data Safety",
              text: "Cookies do NOT store sensitive medical records. All health data remains encrypted in secure Firebase storage.",
            },
            {
              icon: <ShieldCheck />,
              title: "Security & Authentication",
              text: "We use cookies to maintain secure login sessions and prevent unauthorized access to patient accounts.",
            },
            {
              icon: <Settings />,
              title: "Cookie Control",
              text: "You can manage or disable cookies in your browser settings at any time, but some features may be affected.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 relative overflow-hidden"
            >
              {/* FLOATING ICON */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="text-[#2bb673] absolute top-5 right-5"
              >
                {item.icon}
              </motion.div>

              {/* TITLE */}
              <h2 className="text-xl font-bold text-white">{item.title}</h2>

              {/* TEXT */}
              <p className="mt-3 text-gray-200 leading-relaxed text-sm sm:text-base">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM NOTICE */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            By continuing to use{" "}
            <span className="text-[#2bb673] font-semibold">MediShareNG</span>,
            you agree to our use of cookies as described above. We continuously
            improve our policies to ensure transparency, privacy, and a safe
            digital healthcare experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Cookies;
