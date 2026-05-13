import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Apple,
  Droplets,
  Moon,
  Smile,
  ShieldCheck,
} from "lucide-react";

const tips = [
  {
    title: "Stay Hydrated Daily",
    text: "Drinking enough water improves brain function, digestion, and energy levels.",
    icon: <Droplets />,
  },
  {
    title: "Eat Balanced Meals",
    text: "Include fruits, vegetables, proteins, and healthy fats in every meal.",
    icon: <Apple />,
  },
  {
    title: "Get Enough Sleep",
    text: "7–8 hours of sleep helps the body recover and boosts immunity.",
    icon: <Moon />,
  },
  {
    title: "Exercise Regularly",
    text: "At least 30 minutes of activity daily improves heart health and mood.",
    icon: <Activity />,
  },
  {
    title: "Reduce Stress",
    text: "Meditation, breathing exercises, and breaks help mental wellness.",
    icon: <Smile />,
  },
  {
    title: "Regular Health Checkups",
    text: "Early detection prevents serious diseases and improves treatment success.",
    icon: <ShieldCheck />,
  },
];

const HealthTips = () => {
  return (
    <section className="min-h-screen bg-gray-200 py-20 px-4 sm:px-6 lg:px-10">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full">
          <Activity size={18} />
          <span className="text-sm font-semibold uppercase">
            MediShare.NG Health Tips
          </span>
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
          Daily Wellness & Health Guide
        </h1>

        <p className="mt-4 text-gray-600">
          Simple habits that improve your lifestyle, health, and long-term
          wellbeing.
        </p>
      </div>

      {/* CARDS */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="bg-white rounded-3xl shadow-lg p-7 border hover:-translate-y-2 transition-all relative overflow-hidden"
          >
            {/* FLOATING ICON */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-[#2bb673]"
            >
              {tip.icon}
            </motion.div>

            <h2 className="mt-5 text-xl font-bold text-[#065f46]">
              {tip.title}
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">{tip.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HealthTips;
