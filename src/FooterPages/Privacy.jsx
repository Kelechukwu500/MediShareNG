import React from "react";
import { motion } from "framer-motion";
import hospital1 from "../assets/hospital1.jpg";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  Eye,
  FileWarning,
} from "lucide-react";

const Privacy = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center py-24 px-4 sm:px-6 lg:px-10 relative"
      style={{ backgroundImage: `url(${hospital1})` }}
    >
      {/* DARKER OVERLAY (REDUCED IMAGE BRIGHTNESS MORE) */}
      <div className="absolute inset-0 bg-black/88"></div>

      <div className="relative max-w-6xl mx-auto text-white">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-black">Privacy Policy</h1>

          <p className="mt-4 text-gray-300 leading-relaxed">
            At{" "}
            <span className="text-[#2bb673] font-semibold">MediShare.NG</span>,
            we are committed to protecting your personal, medical, and digital
            identity across all our healthcare services.
          </p>
        </div>

        {/* POLICY CARDS */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Lock />,
              title: "Data Protection",
              text: "All user data including medical records, consultations, and personal details are encrypted using advanced security protocols.",
            },
            {
              icon: <Database />,
              title: "Secure Storage",
              text: "Your information is securely stored using Firebase cloud infrastructure with restricted access control systems.",
            },
            {
              icon: <UserCheck />,
              title: "User Control",
              text: "You have full control over your account, including access, updates, and deletion of your personal data.",
            },
            {
              icon: <Eye />,
              title: "Data Usage Transparency",
              text: "We only use your data to improve healthcare services, consultation accuracy, and platform performance.",
            },
            {
              icon: <ShieldCheck />,
              title: "No Unauthorized Sharing",
              text: "We do not sell, rent, or share your personal health data with third parties under any circumstances.",
            },
            {
              icon: <FileWarning />,
              title: "Healthcare Compliance",
              text: "MediShare.NG follows standard digital healthcare privacy principles to ensure ethical handling of patient data.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 relative overflow-hidden"
            >
              {/* FLOATING ICON */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute top-5 right-5 text-[#2bb673]"
              >
                {item.icon}
              </motion.div>

              {/* TITLE */}
              <h2 className="text-xl font-bold text-white">{item.title}</h2>

              {/* TEXT */}
              <p className="mt-3 text-gray-200 leading-relaxed border-l-4 border-[#2bb673] pl-3 text-sm sm:text-base">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-14 text-center max-w-3xl mx-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            By using{" "}
            <span className="text-[#2bb673] font-semibold">MediShareNG</span>,
            you agree to this Privacy Policy. We continuously update our
            security systems and policies to ensure your data remains safe,
            confidential, and protected at all times.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
