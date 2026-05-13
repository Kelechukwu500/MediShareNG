import React from "react";
import { motion } from "framer-motion";
import hospital2 from "../assets/hospital2.jpg";
import {
  HelpCircle,
  ShieldCheck,
  Clock,
  Video,
  Stethoscope,
  Lock,
} from "lucide-react";

const FAQ = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center py-24 px-4 sm:px-6 lg:px-10 relative"
      style={{ backgroundImage: `url(${hospital2})` }}
    >
      {/* DARKER OVERLAY (IMPROVED FOR READABILITY) */}
      <div className="absolute inset-0 bg-black/88"></div>

      <div className="relative max-w-6xl mx-auto text-white">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-black">Frequently Asked Questions</h1>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Everything you need to know about using{" "}
            <span className="text-[#2bb673] font-semibold">MediShareNG</span>,
            your digital healthcare platform for consultations, prescriptions,
            and lab access.
          </p>
        </div>

        {/* FAQ CARDS */}
        <div className="mt-12 space-y-6">
          {[
            {
              icon: <HelpCircle />,
              q: "How do I book a consultation on MediShare.NG?",
              a: "Simply create an account, choose a doctor based on specialty, and book an available time slot instantly. You will receive confirmation and video call details immediately.",
            },
            {
              icon: <Stethoscope />,
              q: "Are the doctors on the platform verified?",
              a: "Yes. All doctors, specialists, and healthcare providers are fully verified and licensed before being added to MediShare.NG.",
            },
            {
              icon: <Video />,
              q: "How does the video consultation work?",
              a: "After booking, you will receive a secure video session link. You can join directly from your phone or computer without installing extra apps.",
            },
            {
              icon: <ShieldCheck />,
              q: "Is my medical data safe?",
              a: "Absolutely. All patient data is encrypted using industry-standard security. We do not share your personal health information with third parties.",
            },
            {
              icon: <Lock />,
              q: "Can anyone access my account?",
              a: "No. Your account is protected with authentication and secure login sessions. Only you can access your medical dashboard.",
            },
            {
              icon: <Clock />,
              q: "Is MediShare.NG available 24/7?",
              a: "Yes. You can book consultations, access doctors, and use platform services anytime, including emergencies depending on doctor availability.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              {/* QUESTION */}
              <div className="flex items-center gap-3 text-[#2bb673]">
                {item.icon}
                <h2 className="font-bold text-lg sm:text-xl">{item.q}</h2>
              </div>

              {/* ANSWER */}
              <p className="mt-4 text-gray-200 leading-relaxed text-sm sm:text-base border-l-4 border-[#2bb673] pl-4">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM NOTE */}
        <div className="mt-14 text-center max-w-3xl mx-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            If you still have questions, you can contact{" "}
            <span className="text-[#2bb673] font-semibold">MediShareNG</span>{" "}
            support anytime through the help section or live chat. We are
            committed to providing safe, fast, and reliable healthcare access
            for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
