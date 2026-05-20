import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { FlaskConical, Pill, Truck, CheckCircle } from "lucide-react";

const LabPharma = ({ activeTab, dark }) => {
  const [labBookings, setLabBookings] = useState([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState([]);

  // Real-time listener for E-Lab bookings
  useEffect(() => {
    if (activeTab !== "eLab") return;

    const unsubLab = onSnapshot(
      collection(db, "labBookings"),
      (snap) => {
        const fetchedLabs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLabBookings(
          fetchedLabs.sort(
            (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
          ),
        );
      },
      (err) => console.error("Lab collection loading error:", err.message),
    );
    return () => unsubLab();
  }, [activeTab]);

  // Real-time listener for E-Pharmacy requests
  useEffect(() => {
    if (activeTab !== "ePharmacy") return;

    const unsubPharmacy = onSnapshot(
      collection(db, "prescriptionOrders"),
      (snap) => {
        const fetchedPharmacy = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrescriptionOrders(
          fetchedPharmacy.sort(
            (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
          ),
        );
      },
      (err) => console.error("Pharmacy collection loading error:", err.message),
    );
    return () => unsubPharmacy();
  }, [activeTab]);

  // Update Status handler for Lab
  const updateLabStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "labBookings", id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update lab status:", err);
    }
  };

  // Update Status handler for Pharmacy
  const updatePharmacyStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "prescriptionOrders", id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update pharmacy status:", err);
    }
  };

  // RENDER E-LAB INTERFACE
  if (activeTab === "eLab") {
    return (
      <div
        className={`p-6 rounded-2xl border ${dark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-100 text-gray-800"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FlaskConical className="text-emerald-500" /> E-Lab Test Records
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className={`text-xs uppercase ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-700"}`}
            >
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Test Requirement</th>
                <th className="px-4 py-3">Appointment Window</th>
                <th className="px-4 py-3">Admin Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {labBookings.map((lab) => (
                <tr
                  key={lab.id}
                  className={dark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}
                >
                  <td className="px-4 py-4 font-medium">
                    <div>{lab.patientName}</div>
                    <div className="text-xs text-gray-400 font-normal">
                      {lab.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-emerald-600 font-semibold">
                    {lab.testType}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div>📅 {lab.appointmentDate}</div>
                    <div className="text-gray-400">
                      🕒 {lab.appointmentTime}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        lab.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {lab.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    {lab.status === "pending" && (
                      <button
                        onClick={() => updateLabStatus(lab.id, "approved")}
                        className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-gray-800 p-1 rounded"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // RENDER E-PHARMACY INTERFACE
  if (activeTab === "ePharmacy") {
    return (
      <div
        className={`p-6 rounded-2xl border ${dark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-100 text-gray-800"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Pill className="text-emerald-500" /> E-Pharmacy Order Records
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className={`text-xs uppercase ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-700"}`}
            >
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Medications Requested</th>
                <th className="px-4 py-3">Fulfillment Pharmacy</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {prescriptionOrders.map((order) => (
                <tr
                  key={order.id}
                  className={dark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}
                >
                  <td className="px-4 py-4 font-medium">
                    <div>{order.patientName}</div>
                    <div className="text-xs text-gray-400 font-normal">
                      {order.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-xs truncate">
                    {order.medicine}
                  </td>
                  <td className="px-4 py-4 text-xs">{order.pharmacy}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "In Transit"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <button
                      onClick={() =>
                        updatePharmacyStatus(order.id, "Dispatched")
                      }
                      className="text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800 p-1 rounded"
                      title="Dispatch"
                    >
                      <Truck size={18} />
                    </button>
                    <button
                      onClick={() =>
                        updatePharmacyStatus(order.id, "Delivered")
                      }
                      className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-gray-800 p-1 rounded"
                      title="Deliver"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default LabPharma;
