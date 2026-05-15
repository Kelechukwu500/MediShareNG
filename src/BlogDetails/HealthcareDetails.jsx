import React from "react";
import { motion } from "framer-motion";
import blog4 from "../assets/blog4.jpg";

const HealthcareDetails = () => {
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
              Modern Healthcare
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              Improving Lives Through Modern Healthcare Systems
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Modern healthcare systems continue to evolve rapidly through
              innovation, digital transformation, improved medical facilities,
              and patient-centered healthcare services. Hospitals and healthcare
              providers are focusing more on delivering safer, faster, and more
              accessible healthcare experiences for patients globally.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Healthcare institutions now use advanced medical technologies,
              electronic health records, telemedicine systems, and smart patient
              monitoring devices to improve medical efficiency and treatment
              outcomes. These systems help reduce delays, improve diagnosis, and
              support better communication between patients and healthcare
              professionals.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Healthcare professionals such as doctors, nurses, surgeons,
              pharmacists, and laboratory scientists continue to play essential
              roles in maintaining healthy communities and improving quality of
              life through medical expertise, compassionate care, and preventive
              healthcare services.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog4}
              alt="Healthcare"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* CARDS SECTION */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Patient-Centered Care",
              text: "Healthcare providers are focusing more on personalized care, patient comfort, safety, and improved communication to create better healthcare experiences.",
            },
            {
              title: "Digital Healthcare",
              text: "Digital systems are helping hospitals manage appointments, patient records, prescriptions, and medical reports more efficiently.",
            },
            {
              title: "Preventive Healthcare",
              text: "Preventive healthcare services help individuals reduce health risks through regular medical checkups, screenings, vaccinations, and healthy lifestyle education.",
            },
            {
              title: "Healthcare Accessibility",
              text: "Modern healthcare systems are improving access to medical services for people living in remote and underserved communities.",
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
                Modern healthcare systems continue to improve patient safety,
                healthcare efficiency, medical accessibility, and treatment
                quality across healthcare institutions worldwide.
              </p>
            </motion.div>
          ))}
        </div>

        {/* LONG ARTICLE */}
        <div className="mt-20 bg-white rounded-[35px] shadow-2xl p-8 sm:p-10 lg:p-14 border border-[#dff4ea]">
          <h2 className="text-3xl sm:text-4xl font-black text-[#065f46] mb-8">
            The Future of Healthcare Services
          </h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Healthcare systems globally are becoming more advanced as hospitals,
            governments, and medical organizations invest heavily in healthcare
            infrastructure, digital transformation, and modern treatment
            technologies. These improvements are helping healthcare providers
            deliver safer and more efficient healthcare services.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Telemedicine and remote healthcare platforms have significantly
            improved healthcare accessibility for individuals who previously had
            limited access to medical services. Patients can now receive medical
            consultations, prescriptions, and healthcare support remotely.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Healthcare innovation is also improving medical research and disease
            management. Researchers continue to develop advanced vaccines,
            treatment methods, and diagnostic technologies that improve disease
            prevention and patient recovery outcomes globally.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            As healthcare innovation continues to evolve, future medical systems
            will become even more connected, efficient, and patient-focused.
            These advancements will continue improving quality healthcare access
            for millions of people around the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HealthcareDetails;
