import React from "react";
import { motion } from "framer-motion";
import blog3 from "../assets/blog3.jpg";

const NutritionDetails = () => {
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
              Nutrition & Healthy Living
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#065f46] mt-5 leading-tight">
              The Importance of Proper Nutrition for Healthy Living
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed text-base sm:text-lg">
              Proper nutrition is one of the foundations of a healthy life.
              Healthy eating habits help strengthen the immune system, improve
              body performance, support mental health, and reduce the risk of
              chronic diseases.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              A balanced diet provides the body with essential nutrients,
              vitamins, minerals, carbohydrates, proteins, and healthy fats
              required for growth, development, and energy production.
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed text-base sm:text-lg">
              Nutrition also plays an important role in disease prevention.
              Healthy eating habits can reduce the risk of obesity, diabetes,
              heart disease, and other long-term health conditions while
              improving overall wellbeing.
            </p>
          </motion.div>

          {/* Right Side Image */}
          <div className="lg:w-1/3 relative">
            <img
              src={blog3}
              alt="Nutrition"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* CONTENT CARDS */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Balanced Diet",
              text: "Eating balanced meals provides essential nutrients that help maintain body functions, support immunity, and improve overall health.",
            },
            {
              title: "Hydration",
              text: "Proper hydration helps regulate body temperature, improve digestion, maintain energy levels, and support healthy organ function.",
            },
            {
              title: "Healthy Fruits & Vegetables",
              text: "Fruits and vegetables provide vitamins, antioxidants, and fiber that support healthy digestion and disease prevention.",
            },
            {
              title: "Protein & Energy",
              text: "Proteins are important for muscle development, tissue repair, body growth, and maintaining healthy body performance.",
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
                Good nutrition continues to improve health outcomes and supports
                healthier lifestyles for individuals of all ages globally.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NutritionDetails;
