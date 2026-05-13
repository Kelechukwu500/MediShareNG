import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Basic Care",
    price: "₦0",
    desc: "Perfect for individuals exploring digital healthcare for the first time.",
    features: [
      "Access to basic consultations",
      "Find nearby doctors",
      "Health tips & articles",
    ],
    icon: <HeartPulse />,
    badge: "Free Plan",
  },
  {
    name: "Pro Health",
    price: "₦5,000 / month",
    desc: "Ideal for active users who need regular consultations and support.",
    features: [
      "Unlimited doctor consultations",
      "Priority booking",
      "Digital prescriptions",
      "24/7 support",
    ],
    icon: <Stethoscope />,
    badge: "Most Popular",
  },
  {
    name: "Premium Care",
    price: "₦12,000 / month",
    desc: "Full healthcare coverage with premium specialists and emergency access.",
    features: [
      "All Pro features",
      "Emergency video calls",
      "Specialist access",
      "Family health plan",
    ],
    icon: <ShieldCheck />,
    badge: "Best Value",
  },
];

const PricingPlans = () => {
  return (
    <section className="min-h-screen bg-gray-200 py-20 px-4 sm:px-6 lg:px-10">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full">
          <Sparkles size={18} />
          <span className="text-sm font-semibold uppercase">
            MediShare.NG Pricing
          </span>
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
          Choose Your Healthcare Plan
        </h1>

        <p className="mt-4 text-gray-600">
          Affordable, flexible, and designed to give you access to quality
          healthcare anytime.
        </p>
      </div>

      {/* CARDS */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 border hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            {/* FLOATING EFFECT */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-5 right-5 text-[#2bb673]"
            >
              {plan.icon}
            </motion.div>

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-4 py-1 rounded-full text-sm font-semibold">
              <BadgeCheck size={14} />
              {plan.badge}
            </div>

            {/* TITLE */}
            <h2 className="mt-6 text-2xl font-bold text-[#065f46]">
              {plan.name}
            </h2>

            {/* PRICE */}
            <p className="text-2xl font-black text-[#2bb673] mt-2">
              {plan.price}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-3 text-gray-600">{plan.desc}</p>

            {/* FEATURES */}
            <ul className="mt-5 space-y-2 text-gray-700 text-sm">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            {/* BUTTON */}
            <button className="mt-6 w-full bg-[#065f46] text-white py-3 rounded-xl font-semibold hover:bg-[#044c39]">
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;
