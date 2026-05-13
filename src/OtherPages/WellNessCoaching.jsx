import React from "react";
import { HeartPulse, Brain, Apple } from "lucide-react";

const WellnessCoaching = () => {
  const coaches = [
    { name: "Mental Health Coach", icon: Brain },
    { name: "Nutrition Expert", icon: Apple },
    { name: "Chronic Care Specialist", icon: HeartPulse },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-700">
          Wellness Coaching
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Ongoing support for mental health, nutrition, and chronic condition
          management from dedicated professionals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {coaches.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <Icon className="mx-auto text-emerald-600 mb-3" size={32} />
              <h2 className="font-bold text-lg">{c.name}</h2>
              <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl">
                Connect Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessCoaching;
