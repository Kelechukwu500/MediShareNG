import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHospital, FaUserMd, FaHandshake, FaMedkit } from "react-icons/fa";
import partner from "../assets/partner.jpg";

/* FIREBASE */
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const BecomeAPartner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "partnerRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        organization: "",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const floatingIcon = (delay = 0) => ({
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    },
  });

  return (
    <div className="w-full bg-gray-200 py-12 md:py-16 px-4 sm:px-6 lg:px-20 relative overflow-hidden">
      {/* Floating Icons (hidden on small screens for cleanliness) */}
      <div className="hidden md:block absolute top-10 left-10 text-green-600 text-3xl">
        <motion.div animate={floatingIcon(0)}>
          <FaHospital />
        </motion.div>
      </div>

      <div className="hidden md:block absolute top-20 right-16 text-blue-600 text-3xl">
        <motion.div animate={floatingIcon(0.5)}>
          <FaUserMd />
        </motion.div>
      </div>

      <div className="hidden md:block absolute bottom-20 left-20 text-purple-600 text-3xl">
        <motion.div animate={floatingIcon(1)}>
          <FaHandshake />
        </motion.div>
      </div>

      <div className="hidden md:block absolute bottom-10 right-10 text-red-500 text-3xl">
        <motion.div animate={floatingIcon(1.5)}>
          <FaMedkit />
        </motion.div>
      </div>

      {/* HEADER */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800">
          Become a Partner
        </h1>
        <p className="text-gray-500 mt-2 md:mt-3 text-sm md:text-base">
          Join our healthcare network and grow with us
        </p>

        <div className="flex justify-center gap-2 md:gap-3 mt-4 flex-wrap">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm">
            Trusted Network
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm">
            Fast Collaboration
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs md:text-sm">
            Verified Institutions
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={partner}
            alt="Partner"
            className="w-full h-64 sm:h-80 md:h-full object-cover"
          />
        </motion.div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl shadow-xl"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6 text-gray-800">
            Partnership Form
          </h2>

          {submitted && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              🎉 Submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-sm md:text-black focus:ring-2 focus:ring-gray-300"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-sm md:text-black focus:ring-2 focus:ring-gray-300"
              required
            />

            <input
              type="text"
              name="organization"
              placeholder="Hospital / Organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-sm md:text-black focus:ring-2 focus:ring-gray-300"
              required
            />

            <textarea
              name="message"
              placeholder="Tell us about your partnership interest..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-lg text-sm md:text-black focus:ring-2 focus:ring-gray-300"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm md:text-base"
            >
              {loading ? "Submitting..." : "Submit Partnership Request"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 md:mt-16">
        {[
          {
            title: "Healthcare Integration",
            desc: "Seamless system integration with hospitals.",
          },
          {
            title: "Data Collaboration",
            desc: "Secure real-time medical data sharing.",
          },
          {
            title: "Growth Partnership",
            desc: "Expand healthcare reach globally.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-5 md:p-6 rounded-2xl shadow-md border"
          >
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BecomeAPartner;
