import React, { useState } from "react";
import {
  Search,
  Clock,
  Stethoscope,
  Building2,
  Pill,
  FlaskConical,
} from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const suggestions = [
    "Find a doctor near me",
    "Book consultation",
    "Nearest hospital",
    "Pharmacy delivery",
  ];

  return (
    <section className="w-full min-h-screen bg-[#f8fbfa] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl text-center space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Search MedConnectNG
          </h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Find doctors, hospitals, pharmacies, and health services instantly
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, hospitals, medicines..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-green-50 hover:border-green-200 transition"
              onClick={() => setQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <Stethoscope className="mx-auto text-green-600" />
            <p className="mt-2 text-sm font-medium">Doctors</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <Building2 className="mx-auto text-blue-600" />
            <p className="mt-2 text-sm font-medium">Hospitals</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <Pill className="mx-auto text-purple-600" />
            <p className="mt-2 text-sm font-medium">Pharmacies</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <FlaskConical className="mx-auto text-rose-600" />
            <p className="mt-2 text-sm font-medium">Labs</p>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="text-left pt-8">
          <h3 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
            <Clock size={16} /> Recent Searches
          </h3>

          <div className="space-y-2">
            {[
              "Cardiologist Lagos",
              "General hospital Ikeja",
              "Ibuprofen price",
            ].map((item, i) => (
              <div
                key={i}
                className="text-gray-500 text-sm bg-white px-4 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
