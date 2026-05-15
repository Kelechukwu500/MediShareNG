import React from "react";
import { motion } from "framer-motion";
import blog6 from "../assets/blog6.jpg";

const GadgetsDetails = () => {
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
              Smart Medical Gadgets
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              Smart Gadgets Improving Modern Healthcare
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Smart medical gadgets are transforming healthcare systems through
              real-time health monitoring, digital diagnostics, wearable
              technology, and remote patient management solutions.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Healthcare professionals and patients now rely on smart devices to
              monitor heart rate, blood pressure, glucose levels, oxygen levels,
              sleep patterns, and overall health performance more efficiently.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              These healthcare gadgets improve preventive healthcare, strengthen
              patient monitoring systems, and provide real-time data that
              supports faster medical intervention and improved healthcare
              decisions.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog6}
              alt="Gadgets"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* GADGET CARDS */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Wearable Devices",
              text: "Wearable healthcare gadgets allow individuals to track daily health activities, fitness levels, and vital body functions in real time.",
            },
            {
              title: "Heart Monitoring Systems",
              text: "Smart heart monitoring devices help patients and doctors track heart performance and identify health risks earlier.",
            },
            {
              title: "Remote Patient Monitoring",
              text: "Remote monitoring systems help healthcare professionals monitor patients from different locations efficiently.",
            },
            {
              title: "Digital Diagnostics",
              text: "Advanced diagnostic gadgets improve disease detection, medical analysis, and patient monitoring through accurate digital systems.",
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
                Smart healthcare gadgets continue improving patient monitoring,
                healthcare accessibility, disease prevention, and digital
                healthcare management worldwide.
              </p>
            </motion.div>
          ))}
        </div>

        {/* LONG ARTICLE */}
        <div className="mt-20 bg-white rounded-[35px] shadow-2xl p-8 sm:p-10 lg:p-14 border border-[#dff4ea]">
          <h2 className="text-3xl sm:text-4xl font-black text-[#065f46] mb-8">
            The Future of Smart Healthcare Devices
          </h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Smart healthcare devices are becoming increasingly important in
            modern healthcare systems as patients and healthcare providers rely
            more on digital health monitoring technologies. Wearable healthcare
            devices are helping individuals track their health conditions more
            efficiently while supporting preventive healthcare management.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Healthcare gadgets such as smartwatches, blood pressure monitors,
            glucose trackers, and oxygen monitoring systems provide valuable
            real-time health data that helps healthcare professionals detect
            medical issues earlier and improve treatment outcomes.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Remote healthcare technologies are also improving healthcare
            accessibility by allowing patients to receive monitoring and medical
            support from different locations without frequent hospital visits.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            As healthcare technology continues to evolve, future smart medical
            gadgets will become more intelligent, more connected, and more
            efficient in supporting healthcare systems globally.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GadgetsDetails;
