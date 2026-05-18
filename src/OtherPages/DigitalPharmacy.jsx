import React, { useState, useEffect } from "react";
import {
  Truck,
  Pill,
  Search,
  PackageCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

// FIREBASE INTEGRATION IMPORTS
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const DigitalPharmacy = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // REAL-TIME FIRESTORE DATA STATES
  const [pharmacies, setPharmacies] = useState([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState([]);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    medicationDetails: "",
    deliveryAddress: "",
    selectedPharmacy: "",
  });

  // REAL-TIME SUBSCRIPTION TO PHARMACIES & ORDERS LIST
  useEffect(() => {
    const unsubPharmacies = onSnapshot(
      collection(db, "pharmacies"),
      (snap) => {
        // Fallback hardcoded fallback array if Firestore "pharmacies" collection is empty
        if (snap.empty) {
          setPharmacies([
            {
              name: "MedPlus Pharmacy",
              location: "Lagos Island",
              delivery: "Same-day delivery",
              status: "Active",
              rating: 4.8,
            },
            {
              name: "HealthHub Pharmacy",
              location: "Ikeja",
              delivery: "2–4 hours",
              status: "Active",
              rating: 4.7,
            },
            {
              name: "CarePoint Pharmacy",
              location: "Victoria Island",
              delivery: "Express delivery",
              status: "Active",
              rating: 4.9,
            },
          ]);
        } else {
          setPharmacies(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
        }
      },
      (err) => console.error("Pharmacy loading error:", err.message),
    );

    const unsubOrders = onSnapshot(
      collection(db, "prescriptionOrders"),
      (snap) => {
        setPrescriptionOrders(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) => console.error("Orders collection loading error:", err.message),
    );

    return () => {
      unsubPharmacies();
      unsubOrders();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HANDLES PRESCRIPTION SUBMISSIONS
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await addDoc(collection(db, "prescriptionOrders"), {
        patientName: formData.patientName,
        phone: formData.phone,
        medicine: formData.medicationDetails,
        deliveryAddress: formData.deliveryAddress,
        pharmacy: formData.selectedPharmacy || "Any Available Partner",
        status: "In Transit",
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        patientName: "",
        phone: "",
        medicationDetails: "",
        deliveryAddress: "",
        selectedPharmacy: "",
      });

      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error("Prescription upload error:", err);
      alert("Error uploading prescription notes. Please check connection.");
    }
    setLoading(false);
  };

  const filtered = pharmacies.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
              <Pill /> Digital Pharmacy
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Prescriptions are sent instantly to our network pharmacies for
              same-day delivery right to your front door.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium self-start md:self-auto">
            <ShieldCheck size={16} />
            Verified Pharmacies Only
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl border border-emerald-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b bg-gray-50">
          {/* SEARCH */}
          <div className="flex items-center gap-2 w-full md:w-96 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs">
            <Search className="text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pharmacies..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* UPLOAD PRESCRIPTION */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition-all shadow-md self-start md:self-auto"
          >
            <Upload size={16} />
            Upload Prescription
          </button>
        </div>

        {/* PHARMACY GRID */}
        <div className="p-4 md:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div
              key={p.id || i}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-emerald-700 text-base">
                    {p.name}
                  </h3>
                  <span className="text-yellow-500 text-sm font-semibold whitespace-nowrap">
                    ⭐ {p.rating || "4.5"}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{p.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span>{p.delivery || "Standard Delivery"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                  {p.status || "Active"}
                </span>

                <button
                  onClick={() => {
                    setFormData({ ...formData, selectedPharmacy: p.name });
                    setIsOpen(true);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 text-xs font-bold transition-colors"
                >
                  <Truck size={14} />
                  Send Prescription Here
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER TRACKING SECTION */}
        <div className="p-4 md:p-6 border-t bg-gray-50/50">
          <h2 className="text-base font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <PackageCheck size={18} /> Recent Prescription Orders
          </h2>

          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-xs">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Medicine Required</th>
                  <th className="py-3 px-4">Selected Pharmacy</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700">
                {prescriptionOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-gray-400 text-xs"
                    >
                      No prescription order dispatches found. Use the
                      application form above to test.
                    </td>
                  </tr>
                ) : (
                  prescriptionOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {o.patientName || "Guest"}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        {o.medicine}
                      </td>
                      <td className="py-3 px-4">{o.pharmacy}</td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">
                        {o.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            o.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP MODAL DRAWER FOR PRESCRIPTION ENTRY COLLECTION */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-1.5">
                <Upload size={18} className="text-emerald-600" />
                Upload Digital Prescription
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-gray-800">
                  Uploaded Successfully!
                </h4>
                <p className="text-xs text-gray-400">
                  Our pharmacy dispatch network has received your requirements.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handlePrescriptionSubmit}
                className="space-y-4 pt-3 text-sm"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full p-2.5 border rounded-xl outline-emerald-600 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Contact number"
                      className="w-full p-2.5 border rounded-xl outline-emerald-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Target Pharmacy Network
                    </label>
                    <input
                      type="text"
                      name="selectedPharmacy"
                      disabled
                      value={
                        formData.selectedPharmacy || "Any Available Partner"
                      }
                      className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Medication Specification / Notes
                  </label>
                  <textarea
                    name="medicationDetails"
                    rows="3"
                    required
                    value={formData.medicationDetails}
                    onChange={handleChange}
                    placeholder="Type out your medication list or dosage instructions here..."
                    className="w-full p-2.5 border rounded-xl outline-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Home Delivery Address
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Where should we ship the medicines?"
                    className="w-full p-2.5 border rounded-xl outline-emerald-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold transition-colors shadow-sm disabled:bg-gray-400 text-xs uppercase tracking-wider"
                >
                  {loading
                    ? "Processing Upload..."
                    : "Dispatch Prescription Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalPharmacy;
