import React, { useState, useEffect } from "react";
import partner from "../assets/partner.jpg";

import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BecomeAPartner = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    phone: "",
    officeAddress: "",
    state: "",
    idType: "",
    idNumber: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to become a partner.");
      return;
    }

    if (loading) return; // prevent double submit

    setLoading(true);

    try {
      await addDoc(collection(db, "partnerRequests"), {
        name: formData.name,
        organization: formData.organization,
        phone: formData.phone,
        officeAddress: formData.officeAddress,
        state: formData.state,
        idType: formData.idType,
        idNumber: formData.idNumber,
        message: formData.message,

        userId: user.uid,
        email: user.email,

        // 🔥 NEW CONSISTENT SYSTEM FIELDS
        status: "pending",
        verified: false, // ✅ IMPORTANT NEW FIELD
        read: false,

        createdAt: serverTimestamp(),
      });

      setSubmitted(true);

      setFormData({
        name: "",
        organization: "",
        phone: "",
        officeAddress: "",
        state: "",
        idType: "",
        idNumber: "",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* IMAGE */}
        <img
          src={partner}
          alt="Partner"
          className="rounded-2xl h-full object-cover"
        />

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {!user ? (
            <p className="text-red-600 font-semibold">
              Please login to submit partnership request
            </p>
          ) : (
            <p className="text-green-600 mb-4">Logged in as: {user.email}</p>
          )}

          {submitted && (
            <div className="bg-green-100 p-2 rounded mb-3 text-green-700">
              Request submitted successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.name}
              className="w-full p-3 border rounded"
              required
            />

            <input
              name="organization"
              placeholder="Organization"
              onChange={handleChange}
              value={formData.organization}
              className="w-full p-3 border rounded"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              value={formData.phone}
              className="w-full p-3 border rounded"
              required
            />

            <input
              name="officeAddress"
              placeholder="Office Address"
              onChange={handleChange}
              value={formData.officeAddress}
              className="w-full p-3 border rounded"
              required
            />

            <input
              name="state"
              placeholder="State of Residence"
              onChange={handleChange}
              value={formData.state}
              className="w-full p-3 border rounded"
              required
            />

            <select
              name="idType"
              onChange={handleChange}
              value={formData.idType}
              className="w-full p-3 border rounded"
              required
            >
              <option value="">Select ID Type</option>
              <option value="International Passport">
                International Passport
              </option>
              <option value="Driver's License">Driver's License</option>
              <option value="Voter's Card">Voter's Card</option>
              <option value="NIN">NIN</option>
              <option value="National ID">National ID</option>
            </select>

            <input
              name="idNumber"
              placeholder="ID Number"
              onChange={handleChange}
              value={formData.idNumber}
              className="w-full p-3 border rounded"
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              onChange={handleChange}
              value={formData.message}
              className="w-full p-3 border rounded"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeAPartner;
