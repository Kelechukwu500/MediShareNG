import React from "react";
import { motion } from "framer-motion";
import blog1 from "../assets/blog1.jpg";

const TechnologyDetails = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#eefaf4] py-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="bg-[#dff4ea] text-[#065f46] px-4 py-2 rounded-full text-sm font-semibold">
              Technology & Innovation
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              How Technology Is Revolutionizing Modern Healthcare
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Technology has become one of the strongest driving forces behind
              the transformation of healthcare systems globally. Hospitals,
              clinics, laboratories, and healthcare professionals now depend
              heavily on digital solutions to improve patient care, speed up
              diagnosis, reduce medical errors, and increase accessibility to
              healthcare services.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Modern healthcare technologies are helping doctors detect diseases
              earlier, improve treatment accuracy, and provide better monitoring
              systems for patients. Through digital transformation, healthcare
              institutions can now manage appointments, prescriptions, patient
              records, and consultations more efficiently than ever before.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              In recent years, Artificial Intelligence, cloud computing,
              telemedicine, robotics, and smart medical devices have completely
              changed the healthcare experience for both patients and healthcare
              providers. These technologies are improving healthcare delivery,
              increasing operational efficiency, and supporting better medical
              outcomes around the world.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog1}
              alt="Technology"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* CARDS SECTION */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Artificial Intelligence",
              text: "AI systems are helping healthcare professionals analyze patient data, identify medical patterns, and support early disease detection. AI-powered diagnostic systems improve efficiency, reduce errors, and enhance treatment planning.",
            },
            {
              title: "Telemedicine Services",
              text: "Telemedicine has made healthcare more accessible for millions of people globally. Patients can now connect with doctors remotely through video consultations, reducing travel stress and increasing convenience.",
            },
            {
              title: "Electronic Health Records",
              text: "Digital health records help healthcare providers securely manage patient information, medical history, prescriptions, and laboratory results while improving communication among healthcare professionals.",
            },
            {
              title: "Smart Healthcare Devices",
              text: "Wearable devices such as fitness trackers, smartwatches, glucose monitors, and heart rate monitors are improving preventive healthcare management and patient monitoring.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#065f46] mb-5">
                {item.title}
              </h2>

              <p className="text-gray-600 leading-relaxed text-base">
                {item.text}
              </p>

              <p className="text-gray-600 leading-relaxed text-base mt-4">
                These technological advancements continue to reshape healthcare
                systems by improving medical accuracy, supporting healthcare
                professionals, and creating more patient-focused healthcare
                experiences for individuals across the world.
              </p>
            </motion.div>
          ))}
        </div>

        {/* LONG ARTICLE SECTION */}
        <div className="mt-20 bg-white rounded-[35px] shadow-2xl p-8 sm:p-10 lg:p-14 border border-[#dff4ea]">
          <h2 className="text-3xl sm:text-4xl font-black text-[#065f46] mb-8">
            The Future of Digital Healthcare Innovation
          </h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Healthcare innovation continues to expand rapidly as hospitals,
            medical institutions, researchers, and technology companies work
            together to improve patient care and healthcare accessibility.
            Across the world, healthcare systems are becoming more intelligent,
            more connected, and more efficient through digital transformation
            and modern medical technologies.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Artificial Intelligence is expected to become even more advanced in
            helping doctors diagnose diseases earlier and more accurately.
            Machine learning systems are already being used to analyze medical
            scans, detect abnormalities, and support healthcare professionals in
            making faster decisions. These systems improve healthcare quality
            while reducing delays in treatment.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Robotics and automation are also changing healthcare environments.
            Robotic-assisted surgeries are improving precision during complex
            medical procedures while reducing risks and recovery times for
            patients. Automated healthcare systems are helping hospitals manage
            appointments, prescriptions, and patient records more efficiently.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Cloud computing and digital health platforms are improving how
            healthcare institutions store and manage medical information.
            Healthcare providers can securely access patient records, laboratory
            results, and medical histories from different locations, improving
            collaboration among healthcare teams and ensuring continuity of
            care.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            As healthcare innovation continues to evolve, future technologies
            such as predictive healthcare analytics, personalized medicine,
            biotechnology, and advanced robotics will continue to improve
            patient care globally. These innovations will help create safer,
            faster, and more accessible healthcare systems for people across
            every region of the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechnologyDetails;
