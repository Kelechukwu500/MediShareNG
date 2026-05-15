import React from "react";
import { motion } from "framer-motion";
import { Users, Building2 } from "lucide-react";
import hospital2 from "../assets/hospital2.jpg";

const Accessibility = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hospital2})` }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-6 text-white/20 hidden lg:block"
      >
        <Building2 size={120} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center"
      >
        <div className="bg-[#2bb673] w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white mb-5">
          <Users />
        </div>

        <h2 className="text-3xl font-bold text-white">Accessibility</h2>

        <p className="text-gray-200 mt-5 leading-relaxed text-base">
          At <span className="text-[#2bb673] font-semibold">MediShareNG</span>,
          we are committed to ensuring that quality healthcare is never out of
          reach. Our platform eliminates geographical barriers by connecting
          patients in both urban and rural areas to certified medical
          professionals instantly.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed text-base">
          Whether you are in a remote village or a busy city, MediShareNG
          provides equal access to healthcare services through secure digital
          consultations, reducing long hospital queues and unnecessary delays.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed text-base">
          We believe healthcare should be a basic right—not a privilege. That is
          why our system is designed to be simple, affordable, and accessible to
          everyone, regardless of background or financial status.
        </p>

        <span className="inline-block mt-6 bg-[#2bb673] text-white px-4 py-1 rounded-full text-xs">
          MediShareNG Core Value
        </span>
      </motion.div>
    </section>
  );
};

export default Accessibility;
