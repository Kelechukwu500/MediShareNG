import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Standardized to match common react-router routes
import {
  FlaskConical,
  FileText,
  Activity,
  Clock3,
  ShieldCheck,
  Search,
  ArrowRight,
  BadgeCheck,
  X,
} from "lucide-react";

// FIREBASE INTEGRATION IMPORTS
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import labHero from "../assets/counseling4.jpg";

const LaboratoryTests = () => {
  // MODAL & FORM STATE CONTROLS
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    testType: "",
    appointmentDate: "",
    appointmentTime: "",
    additionalNotes: "",
  });

  const labFeatures = [
    {
      icon: <FlaskConical size={28} />,
      title: "Advanced Lab Testing",
      text: "Access accurate diagnostic tests including blood, urine, and specialized screenings.",
    },
    {
      icon: <FileText size={28} />,
      title: "Digital Reports",
      text: "Receive instant lab results directly on your dashboard securely.",
    },
    {
      icon: <Activity size={28} />,
      title: "Health Monitoring",
      text: "Track your health metrics and trends over time with smart reports.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Data Storage",
      text: "Your medical test results are encrypted and safely stored.",
    },
    {
      icon: <Clock3 size={28} />,
      title: "Fast Turnaround",
      text: "Get results quickly with efficient laboratory processing.",
    },
    {
      icon: <Search size={28} />,
      title: "Find Nearby Labs",
      text: "Locate verified laboratories close to your location instantly.",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // Writes straight into "labBookings" collection
      await addDoc(collection(db, "labBookings"), {
        patientName: formData.name,
        phone: formData.phone,
        testType: formData.testType,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        additionalNotes: formData.additionalNotes,
        status: "pending", // Default administrative state
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        testType: "",
        appointmentDate: "",
        appointmentTime: "",
        additionalNotes: "",
      });

      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error("Lab Booking Save Failure:", err);
      alert("Error processing booking request. Please check connection.");
    }
    setLoading(false);
  };

  return (
    <section className="w-full bg-[#f5f7f6] overflow-hidden">
      {/* HERO SECTION */}
      <div
        className="relative min-h-[90vh] flex items-center bg-cover bg-center pt-28 px-4 sm:px-6 lg:px-10"
        style={{ backgroundImage: `url(${labHero})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-[#dff4ea]/90 text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2] backdrop-blur-md"
          >
            <BadgeCheck size={18} />
            <span className="text-sm font-semibold uppercase">
              Laboratory Services
            </span>
          </motion.div>

          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Accurate Lab Tests
            <span className="block text-[#2bb673]">Anytime, Anywhere</span>
          </h1>

          <p className="mt-6 text-gray-200 text-base sm:text-lg max-w-2xl">
            MediShareNG connects you to certified laboratories for fast,
            reliable, and secure medical testing with instant digital results.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            {/* HOOKED INTERACTION ACTION */}
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#2bb673] hover:bg-[#22a363] text-white px-8 h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Book Test Now
              <ArrowRight size={18} />
            </button>

           
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2]"
            >
              <Activity size={18} />
              <span className="text-sm font-semibold uppercase">
                Lab Features
              </span>
            </motion.div>

            <h2 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
              Modern Diagnostic Experience
            </h2>

            <p className="mt-5 text-gray-600 max-w-2xl mx-auto">
              Fast, secure and reliable laboratory services designed for modern
              healthcare needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {labFeatures.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#dff4ea] text-[#065f46] rounded-2xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#065f46]">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA SECTION */}
          <div className="mt-20 bg-gradient-to-r from-[#065f46] to-[#2bb673] rounded-[3rem] p-10 text-white text-center">
            <h3 className="text-3xl sm:text-4xl font-black">
              Need a Lab Test Today?
            </h3>

            <p className="mt-4 text-white/90">
              Book a laboratory test and get fast, accurate results delivered
              digitally.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-5">
              <button
                onClick={() => setIsOpen(true)}
                className="bg-white text-[#065f46] px-8 h-14 rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-sm"
              >
                Book Now
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* POPUP OVERLAY MODAL WINDOW FOR TEST BOOKING REQUESTS */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#065f46] flex items-center gap-2">
                  <FlaskConical size={22} className="text-[#2bb673]" />
                  Schedule Laboratory Test
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">
                    Booking Submitted!
                  </h4>
                  <p className="text-xs text-gray-500">
                    Your lab schedule request was dispatched successfully.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter patient name"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Contact details"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Select Diagnostic Test
                    </label>
                    <select
                      name="testType"
                      required
                      value={formData.testType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673] bg-white"
                    >
                      <option value="">-- Choose Diagnostic Profile --</option>
                      <option value="Complete Blood Count (CBC)">
                        Complete Blood Count (CBC)
                      </option>
                      <option value="Malaria Parasite Screening">
                        Malaria Parasite Screening
                      </option>
                      <option value="Typhoid Panel Profile">
                        Typhoid Panel Profile
                      </option>
                      <option value="Lipid Profile (Cholesterol)">
                        Lipid Profile (Cholesterol)
                      </option>
                      <option value="Urinalysis Assessment">
                        Urinalysis Assessment
                      </option>
                      <option value="Full Comprehensive Body Checkup">
                        Full Comprehensive Body Checkup
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        required
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Preferred Time Window
                      </label>
                      <input
                        type="time"
                        name="appointmentTime"
                        required
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Additional Symptoms / Notes (Optional)
                    </label>
                    <textarea
                      name="additionalNotes"
                      rows="3"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      placeholder="Share clinical context or history if applicable..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-[#2bb673]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#065f46] hover:bg-[#044331] text-white p-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors mt-2 disabled:bg-gray-400"
                  >
                    {loading
                      ? "Registering Schedule..."
                      : "Confirm Schedule Request"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LaboratoryTests;
