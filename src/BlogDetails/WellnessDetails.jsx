import React from "react";
import { motion } from "framer-motion";
import blog2 from "../assets/blog2.jpg";

const WellnessDetails = () => {
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
              Wellness & Lifestyle
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              Building Wellness for a Healthier and Better Life
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Wellness is one of the most important aspects of maintaining a
              healthy and balanced lifestyle. It focuses not only on physical
              health but also on emotional wellbeing, mental stability, stress
              management, and healthy daily habits that improve overall quality
              of life.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Modern wellness practices encourage individuals to prioritize
              healthy living through proper nutrition, regular physical
              activity, quality sleep, hydration, mindfulness, and emotional
              self-care. These healthy habits help reduce the risk of chronic
              diseases while improving long-term health and happiness.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              In today's fast-paced world, stress and unhealthy lifestyles have
              become common challenges affecting millions of people globally.
              Wellness programs and preventive healthcare practices are helping
              individuals manage stress, improve emotional health, and maintain
              healthier lifestyles.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog2}
              alt="Wellness"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* WELLNESS CARDS */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Mental Wellness",
              text: "Mental wellness focuses on emotional stability, stress management, self-awareness, and maintaining a healthy mindset that supports productivity and happiness.",
            },
            {
              title: "Physical Fitness",
              text: "Regular physical exercise helps strengthen the body, improve heart health, boost energy levels, and support long-term physical wellbeing.",
            },
            {
              title: "Healthy Sleep",
              text: "Quality sleep is essential for recovery, brain function, emotional balance, and maintaining overall physical health and wellness.",
            },
            {
              title: "Stress Management",
              text: "Managing stress through meditation, relaxation techniques, healthy routines, and emotional support improves mental health and overall wellness.",
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
                Wellness practices continue to help individuals improve their
                lifestyle, strengthen emotional resilience, and maintain a more
                balanced and healthier life both physically and mentally.
              </p>
            </motion.div>
          ))}
        </div>

        {/* LONG ARTICLE */}
        <div className="mt-20 bg-white rounded-[35px] shadow-2xl p-8 sm:p-10 lg:p-14 border border-[#dff4ea]">
          <h2 className="text-3xl sm:text-4xl font-black text-[#065f46] mb-8">
            Why Wellness Matters in Modern Society
          </h2>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Wellness has become increasingly important in modern society as more
            individuals recognize the importance of preventive healthcare and
            healthy living. Wellness programs are helping people improve their
            emotional, mental, and physical health while encouraging healthier
            daily habits and long-term lifestyle improvements.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Emotional wellness is especially important in today's world where
            stress, anxiety, and burnout are becoming more common due to work
            pressure, financial challenges, and busy lifestyles. Maintaining
            emotional balance through mindfulness, self-care, meditation, and
            healthy social relationships can greatly improve overall wellbeing.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
            Physical wellness also plays a major role in maintaining good
            health. Regular exercise, healthy eating habits, hydration, and
            proper sleep improve body strength, energy levels, immunity, and
            long-term disease prevention. Preventive healthcare practices help
            individuals reduce health risks and maintain active lifestyles.
          </p>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            As wellness awareness continues to grow globally, healthcare
            providers, organizations, and communities are encouraging healthier
            lifestyles through education, wellness campaigns, fitness programs,
            and mental health awareness initiatives that support healthier
            societies and better quality of life.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WellnessDetails;
