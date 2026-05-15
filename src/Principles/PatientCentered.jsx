import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Building2 } from "lucide-react";
import hospital2 from "../assets/hospital2.jpg";

const PatientCentered = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hospital2})` }}
      />
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        animate={{ y: [0, 15, 0] }}
        className="absolute top-10 right-6 text-white/20 hidden lg:block"
      >
        <Building2 size={120} />
      </motion.div>

      <motion.div className="relative z-10 max-w-4xl bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center">
        <div className="bg-green-500 w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white mb-5">
          <HeartHandshake />
        </div>

        <h2 className="text-3xl font-bold text-white">Patient-Centered Care</h2>

        <p className="text-gray-200 mt-5 leading-relaxed">
          <span className="text-green-400 font-semibold">MediShareNG</span>{" "}
          places patients at the heart of every decision. Every feature,
          consultation, and system improvement is designed with patient comfort
          and satisfaction in mind.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed">
          We personalize healthcare experiences based on individual needs,
          ensuring every patient receives tailored medical attention.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed">
          Our mission is to create a healthcare ecosystem where patients feel
          heard, valued, and fully supported throughout their journey.
        </p>

        <span className="inline-block mt-6 bg-green-500 text-white px-4 py-1 rounded-full text-xs">
          MediShareNG Core Value
        </span>
      </motion.div>
    </section>
  );
};

export default PatientCentered;
