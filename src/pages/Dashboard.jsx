import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Hospital,
  Calendar,
  Bell,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  Handshake,
  ArrowRight,
  FlaskConical,
  Pill,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Standardize state checks locally to bypass race conditions with custom tracking hooks
  const cachedRole = localStorage.getItem("userRole");
  const cachedUserId = localStorage.getItem("userId");

  const isAdminAuthorized =
    cachedUserId && (cachedRole === "admin" || cachedRole === "admin-doctor");

  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);

  // NEW STREAM STORAGE STATES
  const [labBookings, setLabBookings] = useState([]);
  const [pharmacyOrders, setPharmacyOrders] = useState([]);

  const data = [
    { name: "Mon", users: 400 },
    { name: "Tue", users: 800 },
    { name: "Wed", users: 600 },
    { name: "Thu", users: 1200 },
    { name: "Fri", users: 900 },
  ];

  const cards = [
    {
      title: "Total Users",
      value: users.length,
      color: "from-blue-500 to-blue-300",
    },
    {
      title: "Providers",
      value: providers.length,
      color: "from-emerald-500 to-emerald-300",
    },
    {
      title: "Appointments",
      value: appointments.length,
      color: "from-purple-500 to-purple-300",
    },
  ];

  // EXPANDED MENU DEFINITIONS
  const menuItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "providers", label: "Providers", icon: Hospital },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "labBookings", label: "Lab Bookings", icon: FlaskConical },
    { key: "pharmacyOrders", label: "Pharmacy Orders", icon: Pill },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "partners", label: "Partner Requests", icon: Handshake },
  ];

  // REAL-TIME SESSION WATCHER FOR ABSOLUTE LOGOUT PROTECTION
  useEffect(() => {
    const checkActiveCacheSession = () => {
      const activeId = localStorage.getItem("userId");
      const activeRole = localStorage.getItem("userRole");

      if (!activeId || !activeRole) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", checkActiveCacheSession);
    return () => window.removeEventListener("storage", checkActiveCacheSession);
  }, [navigate]);

  useEffect(() => {
    if (!isAdminAuthorized) return;

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => {
        setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => console.error("Users query error:", err.message),
    );

    const unsubProviders = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const filteredProviders = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.role === "doctor" || u.role === "admin-doctor");
        setProviders(filteredProviders);
      },
      (err) => console.error("Providers query error:", err.message),
    );

    const unsubAppointments = onSnapshot(
      collection(db, "appointments"),
      (snap) => {
        setAppointments(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) => console.error("Appointments query error:", err.message),
    );

    const unsubNotifications = onSnapshot(
      collection(db, "notifications"),
      (snap) => {
        setNotifications(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) => console.error("Notifications query error:", err.message),
    );

    const unsubPartners = onSnapshot(
      collection(db, "partnerRequests"),
      (snap) => {
        setPartnerRequests(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) => console.error("Partner requests query error:", err.message),
    );

    // NEW REAL-TIME SNAPSHOT LISTENER CHANNELS
    const unsubLab = onSnapshot(
      collection(db, "labBookings"),
      (snap) => {
        setLabBookings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => console.error("Lab bookings snapshot track error:", err.message),
    );

    const unsubPharmacy = onSnapshot(
      collection(db, "prescriptionOrders"),
      (snap) => {
        setPharmacyOrders(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) =>
        console.error(
          "Pharmacy prescription orders snapshot track error:",
          err.message,
        ),
    );

    return () => {
      unsubUsers();
      unsubProviders();
      unsubAppointments();
      unsubNotifications();
      unsubPartners();
      unsubLab();
      unsubPharmacy();
    };
  }, [isAdminAuthorized]);

  // ACTION OPERATIONS FOR LABS & ORDERS
  const updateLabStatus = async (id, nextStatus) => {
    try {
      await updateDoc(doc(db, "labBookings", id), { status: nextStatus });
    } catch (err) {
      console.error("Lab state write failure:", err);
    }
  };

  const updatePharmacyOrderStatus = async (id, nextStatus) => {
    try {
      await updateDoc(doc(db, "prescriptionOrders", id), {
        status: nextStatus,
      });
    } catch (err) {
      console.error("Pharmacy status write failure:", err);
    }
  };

  const approvePartner = async (id) => {
    try {
      await updateDoc(doc(db, "partnerRequests", id), {
        status: "approved",
        verified: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const rejectPartner = async (id) => {
    try {
      await updateDoc(doc(db, "partnerRequests", id), {
        status: "rejected",
        verified: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm">
          <p className="text-red-500 font-bold text-xl mb-2">Access Denied</p>
          <p className="text-gray-600 text-sm">
            Your profile role ({cachedRole || "none"}) is not authorized to
            access this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        dark
          ? "bg-gray-950 text-white min-h-screen"
          : "bg-gray-100 min-h-screen"
      }
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <h1 className="text-base md:text-xl font-bold text-emerald-600">
            MediShareNG Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {cachedRole === "admin-doctor" && (
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors shadow-sm"
            >
              <span>Switch to Doctor View</span>
              <ArrowRight size={14} className="text-emerald-600" />
            </button>
          )}

          <button onClick={() => setDark(!dark)} className="text-gray-700">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE LAYOUT */}
      <div className="flex">
        {/* DESKTOP SIDEBAR PANEL */}
        <div className="hidden lg:block w-64 bg-white min-h-[calc(100vh-68px)] p-4 shadow-sm border-r border-gray-100">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.key
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSPACE DYNAMIC CONTENT AREA */}
        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-sm`}
                  >
                    <p className="text-sm opacity-90 font-medium">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-800 font-bold mb-4">
                  Registration Trends
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC E-LABORATORY DISPATCH TAB */}
          {activeTab === "labBookings" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-800">
                  E-Laboratory Appointment Slots
                </h2>
                <p className="text-xs text-gray-500">
                  Track and schedule user-requested laboratory diagnostic
                  panels.
                </p>
              </div>

              {labBookings.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No active diagnostic testing requests found.
                </p>
              ) : (
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-600 border-b">
                      <tr>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Test Requested</th>
                        <th className="p-3">Schedule Time</th>
                        <th className="p-3">Notes</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                      {labBookings.map((lab) => (
                        <tr key={lab.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-gray-900">
                            {lab.patientName}
                          </td>
                          <td className="p-3 font-mono text-xs">{lab.phone}</td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded font-medium border border-emerald-100">
                              {lab.testType}
                            </span>
                          </td>
                          <td className="p-3 text-xs">
                            {lab.appointmentDate}{" "}
                            <span className="text-gray-400 font-mono">
                              ({lab.appointmentTime})
                            </span>
                          </td>
                          <td className="p-3 text-xs text-gray-500 max-w-xs truncate">
                            {lab.additionalNotes || "None"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-bold ${lab.status === "Approved" ? "bg-green-100 text-green-700" : lab.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {lab.status || "pending"}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() =>
                                updateLabStatus(lab.id, "Cancelled")
                              }
                              className="bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-semibold hover:bg-red-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                updateLabStatus(lab.id, "Approved")
                              }
                              className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-green-700"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC E-PHARMACY ORDERS WORKSPACE */}
          {activeTab === "pharmacyOrders" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-800">
                  E-Pharmacy Prescription Dispatches
                </h2>
                <p className="text-xs text-gray-500">
                  Monitor incoming prescriptions, targets, and shipment
                  logistics.
                </p>
              </div>

              {pharmacyOrders.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No script tracking submissions listed.
                </p>
              ) : (
                <div className="space-y-4">
                  {pharmacyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-900 text-base">
                            {order.patientName || "Anonymous Patient"}
                          </h4>
                          <span className="text-xs px-2 py-0.5 font-bold rounded bg-blue-50 text-blue-700 border border-blue-100">
                            {order.pharmacy}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">
                          Contact:{" "}
                          <span className="font-mono font-normal">
                            {order.phone}
                          </span>
                        </p>
                        <div className="bg-white p-2.5 rounded border text-xs text-gray-700 mt-2 font-mono whitespace-pre-wrap">
                          {order.medicine}
                        </div>
                        <p className="text-xs text-gray-500 pt-1">
                          📍{" "}
                          <span className="font-medium text-gray-700">
                            Shipping To:
                          </span>{" "}
                          {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 justify-between">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide uppercase ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {order.status || "In Transit"}
                        </span>
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() =>
                              updatePharmacyOrderStatus(order.id, "In Transit")
                            }
                            className="bg-amber-50 text-amber-700 border px-2.5 py-1 rounded text-xs font-semibold hover:bg-amber-100"
                          >
                            Hold
                          </button>
                          <button
                            onClick={() =>
                              updatePharmacyOrderStatus(order.id, "Delivered")
                            }
                            className="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-emerald-700"
                          >
                            Deliver
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PARTNER REQUESTS RENDER WORKSPACE */}
          {activeTab === "partners" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Partnership Requests Management
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review, audit, and approve external corporate profile
                  applications.
                </p>
              </div>

              {partnerRequests.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No partnership requests recorded.
                </p>
              ) : (
                <div className="space-y-4">
                  {partnerRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">
                            {request.name || "Unnamed Request"}
                          </h3>
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">
                            {request.organization || "No Organization"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${request.status === "approved" ? "bg-green-100 text-green-700" : request.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {request.status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-xs border-t border-gray-100 pt-3 mt-2 text-gray-600">
                        <div>
                          <span className="font-semibold text-gray-500">
                            Email Reference:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {request.email || "Guest / Not Provided"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">
                            Phone Number:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {request.phone || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">
                            State of Residence:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {request.state || "N/A"}
                          </span>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <span className="font-semibold text-gray-500">
                            Office Address:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {request.officeAddress || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">
                            ID Verification Type:
                          </span>{" "}
                          <span className="text-gray-800 font-medium">
                            {request.idType || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">
                            ID Document Number:
                          </span>{" "}
                          <span className="text-gray-800 font-medium font-mono">
                            {request.idNumber || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-100 mt-3 text-xs">
                        <p className="font-semibold text-gray-500 mb-1">
                          Applicant Message Statement:
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {request.message ||
                            "No custom cover statement details shared."}
                        </p>
                      </div>

                      {request.status !== "approved" &&
                        request.status !== "rejected" && (
                          <div className="flex justify-end gap-2 mt-4 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => rejectPartner(request.id)}
                              className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                              Reject Application
                            </button>
                            <button
                              onClick={() => approvePartner(request.id)}
                              className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Approve & Verify
                            </button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROP MENU WRAPPER DRAWER PANEL */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-72 h-full bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-emerald-600 mb-6">Menu</h2>
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setActiveTab(item.key);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 text-sm ${
                    activeTab === item.key
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
