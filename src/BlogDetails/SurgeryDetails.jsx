import React from "react";
import { motion } from "framer-motion";
import blog5 from "../assets/blog5.jpg";

const SurgeryDetails = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#eefaf4] py-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="bg-[#dff4ea] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold">
              Surgical Innovation
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              Surgical Advancements Transforming Modern Medicine
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Surgery has experienced significant advancements over the years
              through improved medical technologies, robotic systems, advanced
              surgical equipment, and modern treatment techniques that improve
              patient safety and recovery outcomes.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Modern surgical procedures are now more precise, less invasive,
              and more efficient than traditional surgery methods. These
              improvements help reduce pain, minimize risks, shorten hospital
              stays, and improve patient recovery times.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Surgical specialists continue to use advanced imaging systems,
              robotic-assisted procedures, laser technologies, and minimally
              invasive techniques to improve surgical accuracy and patient care.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog5}
              alt="Surgery"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* SURGERY CARDS */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Robotic Surgery",
              text: "Robotic-assisted surgeries provide greater precision, flexibility, and control during complex medical procedures while reducing complications.",
            },
            {
              title: "Minimally Invasive Surgery",
              text: "Minimally invasive procedures help reduce pain, improve healing time, and minimize surgical scars for patients.",
            },
            {
              title: "Laser Technology",
              text: "Laser-assisted surgical systems improve precision during delicate procedures while reducing damage to surrounding tissues.",
            },
            {
              title: "Faster Recovery",
              text: "Modern surgical innovations continue to improve recovery outcomes and reduce hospital stays for patients globally.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#065f46] mb-5">
                {item.title}
              </h2>

              <p className="text-gray-600 leading-relaxed">{item.text}</p>

              <p className="text-gray-600 leading-relaxed mt-4">
                Surgical advancements continue improving healthcare quality,
                patient safety, and medical precision across hospitals and
                healthcare institutions worldwide.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SurgeryDetails;
