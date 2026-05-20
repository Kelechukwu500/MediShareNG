import React from "react";
import doctors2 from "../assets/doctors2.jpg";
import { Link } from "react-router-dom";

const EcosystemSection = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left - Text */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <button className="w-fit mx-auto lg:mx-0 px-5 py-2.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              Comprehensive Ecosystem
            </button>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Everything You Need for a Healthy Life
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              At{" "}
              <span className="text-gray-600 font-semibold">MediShareNG</span>,
              we've brought every medical touchpoint together into one powerful,
              cohesive platform. Whether you are a patient seeking seamless
              health delivery or a healthcare professional looking to expand
              your reach, our ecosystem empowers providers to deliver quality
              care efficiently while eliminating fragmented patient experiences.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/services" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                  Explore the Full Ecosystem
                  <span className="text-xl">→</span>
                </button>
              </Link>

              <Link to="/providers" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-700 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95">
                  Become a Provider
                </button>
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[520px]">
              <img
                src={doctors2}
                alt="Doctors"
                className="w-full h-auto rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
