import React, { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

/* FIREBASE */
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Footer = () => {
  /* NEWSLETTER STATE */
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  /* NEWSLETTER SUBMIT */
  const handleNewsletter = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await addDoc(collection(db, "newsletterSubscribers"), {
        email,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setEmail("");

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      console.log(error);
      alert("Subscription failed");
    }
  };

  return (
    <div className="bg-white w-full">
      {/* Dummy content strip */}
      <div className="h-[30px] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-xs sm:text-sm"></span>
      </div>

      <footer className="bg-emerald-950 text-gray-300 relative overflow-hidden">
        {/* CTA SECTION */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-32 z-10">
          <div className="bg-gradient-to-r from-yellow-100 via-teal-100 to-pink-100 p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl text-center">
            <h2 className="text-base sm:text-lg md:text-3xl font-semibold text-gray-900 mb-6 leading-snug">
              Get to know the world-class board of directors governing our
              organization.
            </h2>

          <Link to="/meet-our-board">
            <button className="bg-slate-800 hover:bg-blue-700 text-white font-medium py-3 px-6 sm:py-3 sm:px-8 rounded-full transition duration-200 shadow-md text-sm sm:text-base">
              Meet our Board
            </button>
          </Link>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-32 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {/* COLUMN 1 */}
            <div className="lg:col-span-2">
              <p className="text-xs uppercase font-semibold text-gray-400 mb-3 tracking-wider">
                Sign up for Newsletter
              </p>

              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 mb-4"
              />

              <button
                onClick={handleNewsletter}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full py-3 text-sm mb-3"
              >
                Next
              </button>

              {/* SUCCESS MESSAGE */}
              {success && (
                <p className="text-green-400 text-sm mb-6">
                  Subscription successful!
                </p>
              )}

              <p className="text-xs uppercase font-semibold text-gray-400 mb-3 tracking-wider">
                Follow us
              </p>

              <div className="flex gap-6 text-gray-500">
                <a href="#" className="hover:text-emerald-600 transition p-2">
                  <FaFacebookF size={18} />
                </a>

                <a href="#" className="hover:text-emerald-600 transition p-2">
                  <FaLinkedinIn size={18} />
                </a>

                <a href="#" className="hover:text-emerald-600 transition p-2">
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 mb-3">
                Services
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <Link to="/online-consultation" className="hover:text-white">
                  Online Consultation
                </Link>

                <Link to="/laboratory-tests" className="hover:text-white">
                  Laboratory Tests
                </Link>

                <Link to="/ai-symptoms-checker" className="hover:text-white">
                  AI Health Check
                </Link>

                <Link to="/digital-pharmacy" className="hover:text-white">
                  E-Pharmacy
                </Link>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 mb-3">
                Support
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <Link to="/pricing-plans" className="hover:text-white">
                  Pricing Plans
                </Link>

                <Link to="/health-tips" className="hover:text-white">
                  Health Tips
                </Link>

                <Link to="/history" className="hover:text-white">
                  About Us
                </Link>
              </div>
            </div>

            {/* COLUMN 4 */}
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 mb-3">
                Resources
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <Link to="/events" className="hover:text-white">
                  Events
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-400 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 items-center">
              <Link to="/privacy" className="hover:text-gray-300">
                Privacy
              </Link>

              <Link to="/terms" className="hover:text-gray-300">
                Terms
              </Link>

              <Link to="/cookies" className="hover:text-gray-300">
                Cookies
              </Link>

              <Link to="/faq" className="hover:text-gray-300">
                FAQ
              </Link>

              {/* separator */}
              <span className="hidden sm:inline text-gray-400 mx-2">|</span>

              <span className="text-gray-400 font-medium">
                Built by Kaycee Tech
              </span>
            </div>

            <div className="text-center md:text-right">
              <span className="font-bold text-white">MediShareNG</span>
              <span className="block sm:inline ml-1">
                © 2026 All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
