import React, { useState } from "react";
import {
  Truck,
  Pill,
  Search,
  PackageCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Upload,
} from "lucide-react";

const DigitalPharmacy = () => {
  const [search, setSearch] = useState("");

  const pharmacies = [
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
  ];

  const orders = [
    {
      medicine: "Amoxicillin 500mg",
      pharmacy: "MedPlus Pharmacy",
      status: "Delivered",
      date: "2026-05-10",
    },
    {
      medicine: "Vitamin C Tablets",
      pharmacy: "HealthHub Pharmacy",
      status: "In Transit",
      date: "2026-05-11",
    },
  ];

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

          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
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
          <div className="flex items-center gap-2 w-full md:w-96 bg-white px-4 py-2 rounded-xl border">
            <Search className="text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pharmacies..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* UPLOAD PRESCRIPTION */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <Upload size={16} />
            Upload Prescription
          </button>
        </div>

        {/* PHARMACY GRID */}
        <div className="p-4 md:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-emerald-700">{p.name}</h3>
                <span className="text-yellow-500 text-sm">⭐ {p.rating}</span>
              </div>

              {/* INFO */}
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{p.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{p.delivery}</span>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-3">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {p.status}
                </span>
              </div>

              {/* ACTION */}
              <button className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 text-sm">
                <Truck size={16} />
                Send Prescription
              </button>
            </div>
          ))}
        </div>

        {/* ORDER TRACKING SECTION */}
        <div className="p-4 md:p-6 border-t bg-gray-50">
          <h2 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <PackageCheck /> Recent Orders
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Medicine</th>
                  <th>Pharmacy</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} className="border-b hover:bg-white">
                    <td className="py-3">{o.medicine}</td>
                    <td>{o.pharmacy}</td>
                    <td>{o.date}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          o.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-xs text-gray-500 mt-6">
        All prescriptions are securely processed and delivered through verified
        pharmacy partners.
      </p>
    </div>
  );
};

export default DigitalPharmacy;
