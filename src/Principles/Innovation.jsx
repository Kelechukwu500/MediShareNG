import React from "react";
import { motion } from "framer-motion";
import { Users, Building2 } from "lucide-react";
import hospital2 from "../assets/hospital2.jpg";

const Innovation = () => {
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

        <h2 className="text-3xl font-bold text-white">Innovation</h2>

        <p className="text-gray-200 mt-5 leading-relaxed text-base">
          At <span className="text-[#2bb673] font-semibold">MediShareNG</span>,
          innovation is the foundation of our healthcare transformation mission.
          We leverage modern digital technology to create smarter, faster, and
          more connected healthcare experiences for patients and medical
          professionals across Nigeria.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed text-base">
          From secure virtual consultations and intelligent appointment systems
          to digital health records and real-time healthcare access, MediShareNG
          continues to develop innovative solutions that simplify healthcare
          delivery and improve patient experiences.
        </p>

        <p className="text-gray-300 mt-4 leading-relaxed text-base">
          We believe the future of healthcare depends on continuous improvement
          and technological advancement. That is why we remain committed to
          building forward-thinking healthcare solutions that increase
          convenience, strengthen communication, and make quality healthcare
          more accessible to everyone.
        </p>

        <span className="inline-block mt-6 bg-[#2bb673] text-white px-4 py-1 rounded-full text-xs">
          MediShareNG Core Value
        </span>
      </motion.div>
    </section>
  );
};

export default Innovation;
