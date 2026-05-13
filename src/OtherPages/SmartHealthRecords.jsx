import React, { useState } from "react";
import {
  FileText,
  FilePlus,
  Activity,
  ShieldCheck,
  Lock,
  Download,
  Search,
} from "lucide-react";

const SmartHealthRecords = () => {
  const [activeTab, setActiveTab] = useState("labs");

  const labResults = [
    {
      title: "Blood Test",
      date: "2026-05-10",
      result: "Normal",
      status: "Stable",
    },
    {
      title: "Malaria Test",
      date: "2026-04-22",
      result: "Negative",
      status: "Clear",
    },
  ];

  const prescriptions = [
    {
      drug: "Paracetamol 500mg",
      doctor: "Dr. Smith",
      date: "2026-05-01",
      duration: "5 Days",
    },
    {
      drug: "Vitamin C",
      doctor: "Dr. John",
      date: "2026-04-18",
      duration: "10 Days",
    },
  ];

  const history = [
    {
      event: "General Checkup",
      hospital: "Lagos Clinic",
      date: "2026-03-10",
    },
    {
      event: "Dental Cleaning",
      hospital: "Smile Care Center",
      date: "2026-02-20",
    },
  ];

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
        activeTab === id
          ? "bg-emerald-600 text-white shadow-md"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 flex items-center gap-2">
              <ShieldCheck /> Smart Health Records
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Secure, immutable digital health vault powered by MedConnectNG
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm w-fit">
            <Lock size={16} />
            Encrypted & Secure Vault
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-emerald-100">
        {/* TOP BAR */}
        <div className="p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" />
            <input
              placeholder="Search medical records..."
              className="w-full md:w-96 outline-none text-sm"
            />
          </div>

          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-emerald-700">
            <Download size={16} />
            Export Records
          </button>
        </div>

        {/* TABS */}
        <div className="p-4 md:p-6 flex flex-wrap gap-3 border-b bg-gray-50">
          <TabButton id="labs" label="Lab Results" icon={Activity} />
          <TabButton id="prescriptions" label="Prescriptions" icon={FilePlus} />
          <TabButton id="history" label="Medical History" icon={FileText} />
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-6">
          {/* LABS */}
          {activeTab === "labs" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {labResults.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg text-emerald-700">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.date}</p>

                  <div className="mt-3 flex justify-between text-sm">
                    <span>Result: {item.result}</span>
                    <span className="text-emerald-600 font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRESCRIPTIONS */}
          {activeTab === "prescriptions" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {prescriptions.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border bg-white shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-emerald-700">
                    {item.drug}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Prescribed by {item.doctor}
                  </p>

                  <div className="mt-3 flex justify-between text-sm">
                    <span>{item.date}</span>
                    <span className="text-gray-600">
                      Duration: {item.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-emerald-700">
                      {item.event}
                    </h3>
                    <p className="text-sm text-gray-500">{item.hospital}</p>
                  </div>

                  <span className="text-sm text-gray-600">{item.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SECURITY NOTE */}
      <div className="text-center text-xs text-gray-500 mt-6">
        All records are encrypted and stored securely in compliance with medical
        data protection standards.
      </div>
    </div>
  );
};

export default SmartHealthRecords;
