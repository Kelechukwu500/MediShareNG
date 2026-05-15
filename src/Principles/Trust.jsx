import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Building2 } from "lucide-react";
import hospital2 from "../assets/hospital2.jpg";

const Trust = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hospital2})` }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        animate={{ y: [0, -15, 0] }}
        className="absolute top-10 left-6 text-white/20 hidden lg:block"
      >
        <Building2 size={120} />
      </motion.div>

      <motion.div className="relative z-10 max-w-4xl bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center">
        <div className="bg-red-500 w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white mb-5">
          <ShieldCheck />
        </div>

        <h2 className="text-3xl font-bold text-white">Trust</h2>

        <p className="text-gray-200 mt-5 leading-relaxed">
          At <span className="text-red-400 font-semibold">MediShareNG</span>,
          trust is the foundation of everything we do. All doctors are carefully
          verified, ensuring patients receive care only from qualified
          professionals.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed">
          Patient data is fully encrypted and protected, ensuring complete
          confidentiality during every consultation and transaction.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed">
          We are committed to building long-term relationships between patients
          and healthcare providers through reliability and honesty.
        </p>

        <span className="inline-block mt-6 bg-red-500 text-white px-4 py-1 rounded-full text-xs">
          MediShareNG Core Value
        </span>
      </motion.div>
    </section>
  );
};

export default Trust;
