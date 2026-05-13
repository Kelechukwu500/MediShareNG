import React, { useState } from "react";
import {
  FlaskConical,
  Calendar,
  Clock,
  MapPin,
  Activity,
  ClipboardCheck,
  Search,
  Truck,
  ShieldCheck,
} from "lucide-react";

const ConnectedDiagnostics = () => {
  const [search, setSearch] = useState("");

  const tests = [
    {
      name: "Full Blood Count (FBC)",
      type: "Blood Test",
      price: "₦12,000",
      duration: "24 hrs",
    },
    {
      name: "Malaria Parasite Test",
      type: "Blood Test",
      price: "₦5,000",
      duration: "6 hrs",
    },
    {
      name: "Liver Function Test",
      type: "Comprehensive",
      price: "₦18,000",
      duration: "24–48 hrs",
    },
    {
      name: "Urinalysis",
      type: "Urine Test",
      price: "₦4,500",
      duration: "12 hrs",
    },
  ];

  const bookings = [
    {
      test: "Full Blood Count",
      date: "2026-05-10",
      status: "Completed",
      doctor: "Dr. Smith",
    },
    {
      test: "Malaria Test",
      date: "2026-05-12",
      status: "Processing",
      doctor: "Dr. Amina",
    },
    {
      test: "Liver Function Test",
      date: "2026-05-14",
      status: "Scheduled",
      doctor: "Dr. John",
    },
  ];

  const filtered = tests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
              <FlaskConical /> Connected Diagnostics
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Schedule home-collection for lab tests. Results sync directly to
              your profile and your doctor's dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
            <ShieldCheck size={16} />
            Secure Lab Network
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl border border-emerald-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b bg-gray-50">
          <div className="flex items-center gap-2 w-full md:w-96 bg-white px-4 py-2 rounded-xl border">
            <Search className="text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lab tests..."
              className="w-full outline-none text-sm"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <Calendar size={16} />
            Schedule Home Collection
          </button>
        </div>

        {/* TEST CARDS */}
        <div className="p-4 md:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((test, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-emerald-700">{test.name}</h3>

              <p className="text-sm text-gray-500 mt-1">{test.type}</p>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>Result: {test.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity size={14} />
                  <span>{test.price}</span>
                </div>
              </div>

              <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 text-sm">
                Book Collection
              </button>
            </div>
          ))}
        </div>

        {/* BOOKINGS TRACKING */}
        <div className="p-4 md:p-6 border-t bg-gray-50">
          <h2 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
            <ClipboardCheck /> Your Test Schedule
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Test</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i} className="border-b hover:bg-white">
                    <td className="py-3">{b.test}</td>
                    <td>{b.date}</td>
                    <td>{b.doctor}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          b.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="p-4 md:p-6 border-t bg-white text-sm text-gray-600 flex flex-col md:flex-row md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck size={16} />
            Home sample collection available nationwide
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            Results synced directly to your doctor dashboard
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-center text-xs text-gray-500 mt-6">
        All diagnostic data is encrypted and securely shared with authorized
        healthcare providers only.
      </p>
    </div>
  );
};

export default ConnectedDiagnostics;
