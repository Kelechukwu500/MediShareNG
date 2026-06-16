import React, { useState } from "react";
import {
  Mail,
  Phone,
  Clock3,
  MapPin,
  Send,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

/* FIREBASE */
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // SIMPLE VALIDATION
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      /* SAVE TO FIREBASE */
      await addDoc(collection(db, "contactMessages"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      // SHOW SUCCESS ALERT
      setSuccess(true);

      // CLEAR FORM
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });

      // HIDE ALERT AFTER 4 SECONDS
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      console.log(error);
      alert("Failed to send message.");
    }
  };

  return (
    <section className="w-full bg-[#f5f7f6] py-16 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full shadow-sm border border-[#b7e4d2]">
              <BadgeCheck size={18} />
              <span className="font-semibold text-sm tracking-wide uppercase">
                Contact Support
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#065f46] leading-tight">
                Get in Touch
              </h1>

              <p className="mt-5 text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
                Have questions or need assistance? Reach out to our team and
                we’ll get back to you quickly.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#dff4ea] flex items-center justify-center shadow-sm">
                  <Mail className="text-[#065f46]" size={24} />
                </div>

                <div>
                  <h3 className="text-[#065f46] font-bold text-xl">Email</h3>
                  <p className="text-gray-600 mt-1 text-base sm:text-lg">
                    medisharehub@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#dff4ea] flex items-center justify-center shadow-sm">
                  <Phone className="text-[#065f46]" size={24} />
                </div>

                <div>
                  <h3 className="text-[#065f46] font-bold text-xl">Phone</h3>
                  <p className="text-gray-600 mt-1 text-base sm:text-lg">
                    +234 7061619424
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#dff4ea] flex items-center justify-center shadow-sm">
                  <Clock3 className="text-[#065f46]" size={24} />
                </div>

                <div>
                  <h3 className="text-[#065f46] font-bold text-xl">
                    Working Hours
                  </h3>
                  <p className="text-gray-600 mt-1 text-base sm:text-lg">
                    24/7 Digital Support
                  </p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-[#dff4ea] flex items-center justify-center shadow-sm">
                  <MapPin className="text-[#065f46]" size={24} />
                </div>

                <div>
                  <h3 className="text-[#065f46] font-bold text-xl">Office</h3>
                  <p className="text-gray-600 mt-1 text-base sm:text-lg leading-relaxed">
                    54 Umoji Street Independence Layout,
                    <br />
                    Enugu, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="bg-white border border-gray-200 rounded-[2rem] shadow-xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* SUCCESS ALERT */}
            {success && (
              <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-5 py-4 rounded-2xl flex items-center gap-3 animate-pulse">
                <CheckCircle2 size={24} />
                <span className="font-semibold">
                  Message sent successfully!
                </span>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-[#065f46] leading-tight">
                Send us a Message
              </h2>

              <p className="text-gray-500 mt-3 text-base">
                Fill the form below and our support team will respond shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#b7e4d2] transition-all duration-300 text-gray-700"
                />

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#b7e4d2] transition-all duration-300 text-gray-700"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#b7e4d2] transition-all duration-300 text-gray-700"
              />

              {/* Subject */}
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#b7e4d2] transition-all duration-300 text-gray-700"
              />

              {/* Message */}
              <textarea
                rows="7"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#b7e4d2] transition-all duration-300 text-gray-700 resize-none"
              ></textarea>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#065f46] hover:bg-[#044e3a] transition-all duration-300 text-white h-14 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02]"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-20">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full shadow-sm border border-[#b7e4d2]">
              <MapPin size={18} />
              <span className="font-semibold text-sm uppercase tracking-wide">
                Our Location
              </span>
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#065f46]">
              Visit Our Office
            </h2>

            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              54 Umoji Street Independence Layout Enugu, Nigeria
            </p>
          </div>

          {/* Google Map */}
          <div className="w-full h-[350px] sm:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=54%20Umoji%20Street%20Independence%20Layout%20Enugu%20Nigeria&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
