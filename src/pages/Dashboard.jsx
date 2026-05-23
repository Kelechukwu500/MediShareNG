import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LabPharma from "./LabPharma"; // Adjust the relative path path based on your file structure
import Providers from "../OtherPages/Providers";
import { FlaskConical, Pill } from "lucide-react"; 


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
  const audioRef = useRef(new Audio("/beep.mp3"));
  const isInitialLoad = useRef(true); // Track appointments load
  const isInitialNotificationLoad = useRef(true);
  
  

  // FIXED: Standardize state checks locally to bypass race conditions with custom tracking hooks
  const cachedRole = localStorage.getItem("userRole");
  const cachedUserId = localStorage.getItem("userId");

  const isAdminAuthorized =
    cachedUserId && (cachedRole === "admin" || cachedRole === "admin-doctor");

  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

  
    


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

  const menuItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "providers", label: "Providers", icon: Hospital },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "eLab", label: "E-Lab ", icon: FlaskConical },
    { key: "ePharmacy", label: "E-Pharmacy ", icon: Pill },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "partners", label: "Partner Requests", icon: Handshake },
  ];

  // REAL-TIME SESSION WATCHER FOR ABSOLUTE LOGOUT PROTECTION
  useEffect(() => {
    const checkActiveCacheSession = () => {
      const activeId = localStorage.getItem("userId");
      const activeRole = localStorage.getItem("userRole");

      // If local storage is wiped while viewing the page, kick them to login immediately
      if (!activeId || !activeRole) {
        navigate("/login", { replace: true });
      }
    };

    // Listen to cross-tab modifications automatically
    window.addEventListener("storage", checkActiveCacheSession);
    return () => window.removeEventListener("storage", checkActiveCacheSession);
  }, [navigate]);

  useEffect(() => {
    // Prevent non-admins from registering listening pipes entirely
    if (!isAdminAuthorized) return;

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => {
        setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => console.error("Users query tracking error:", err.message),
    );

    // REAL-TIME LISTENER FOR REGISTERED PROVIDER FORM ENTRIES
    const unsubProviders = onSnapshot(
      collection(db, "providers"),
      (snap) => {
        setProviders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) =>
        console.error("Providers registration tracking error:", err.message),
    );
  
  

    // 1. RESTORED APPOINTMENTS LISTENER (PASTE THIS)
    const unsubAppointments = onSnapshot(
      collection(db, "appointments"),
      (snap) => {
        const appointmentList = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (!isInitialLoad.current) {
          snap.docChanges().forEach((change) => {
            if (change.type === "added") {
              audioRef.current.play().catch((err) => {
                console.log(
                  "Audio playback held until user interacts with UI:",
                  err.message,
                );
              });
            }
          });
        } else {
          isInitialLoad.current = false;
        }

        setAppointments(appointmentList);
      },
      (err) => console.error("Appointments query tracking error:", err.message),
    );

    // 2. CLEAN SINGLE NOTIFICATIONS LISTENER (PASTE THIS)
    const unsubNotifications = onSnapshot(
      collection(db, "notifications"),
      (snap) => {
        if (!isInitialNotificationLoad.current) {
          snap.docChanges().forEach((change) => {
            if (change.type === "added") {
              audioRef.current.play().catch((err) => {
                console.log(
                  "Audio playback held until user interacts with UI:",
                  err.message,
                );
              });
            }
          });
        } else {
          isInitialNotificationLoad.current = false;
        }

        setNotifications(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) =>
        console.error("Notifications query tracking error:", err.message),
    );

    const unsubPartners = onSnapshot(
      collection(db, "partnerRequests"),
      (snap) => {
        setPartnerRequests(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (err) =>
        console.error("Partner requests query tracking error:", err.message),
    );

    return () => {
      unsubUsers();
      unsubProviders();
      unsubAppointments();
      unsubNotifications();
      unsubPartners();
      ("");
    };
  }, [isAdminAuthorized]);


    const updateProviderStatus = async (id, newStatus) => {
      try {
        await updateDoc(doc(db, "providers", id), {
          status: newStatus,
        });
        alert(`Facility status updated to: ${newStatus}`);
      } catch (err) {
        console.error("Failed to update status:", err);
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

  // FIXED: Enforce role-based access safely using local state checks
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm">
          <p className="text-red-500 font-bold text-xl mb-2">Access Denied</p>
          <p className="text-gray-600 text-sm">
            Your profile role ({cachedRole || "none"}) is not authorized to
            access this administrative panel.
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

        {/* DUAL VIEW NAVIGATION TOGGLE */}
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

      {/* MOBILE MENU */}
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
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 cursor-pointer text-gray-700"
                >
                  <Icon size={18} />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <aside className="hidden lg:block bg-white rounded-2xl shadow-md p-5 space-y-5 h-fit">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                  activeTab === item.key
                    ? "bg-emerald-100 text-emerald-700 font-semibold"
                    : "hover:bg-emerald-50 text-gray-600"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </aside>

        {/* MAIN DISPLAY HUB */}
        <main className="lg:col-span-3 space-y-6">
          {activeTab === "overview" && (
            <>
              <h2 className="text-xl font-bold text-gray-800">Welcome 👨‍⚕️</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl bg-gradient-to-r ${c.color} text-white shadow-sm`}
                  >
                    <p className="text-sm opacity-90">{c.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{c.value}</h3>
                  </div>
                ))}
              </div>

              {/* ANALYTICS GRAPH PREVIEW */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  User Growth Trends
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#047857"
                        strokeWidth={3}
                        dot={{ fill: "#047857" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* USERS RENDER VIEW */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Registered Platform Users
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="py-3">{u.fullName || "Anonymous"}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3 font-medium capitalize">
                          {u.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROVIDERS TAB PANEL VIEW (SYNCS DIRECTLY TO REGISTERED FORM DATA) */}
          {activeTab === "providers" && (
            <div className="bg-white p-6 rounded-3xl shadow-sm text-black border">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Healthcare Facilities Registration
                  </h2>
                  <p className="text-sm text-gray-500">
                    Review comprehensive on-boarding applications submitted via
                    the Provider form.
                  </p>
                </div>
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {providers.length} Total Applied
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-700 text-xs uppercase font-bold">
                      <th className="p-4">Facility Details</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Location (City/State)</th>
                      <th className="p-4">Licensing Info</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y text-sm">
                    {providers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center p-8 text-gray-400"
                        >
                          No provider facility submission records found in
                          Firebase Firestore.
                        </td>
                      </tr>
                    ) : (
                      providers.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">
                              {p.facilityName || "Unnamed Facility"}
                            </p>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                              {p.facilityType}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-900 font-medium">
                              {p.phoneNumbers}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.officialEmail}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-900">{p.lga || "N/A"}</p>
                            <p className="text-xs text-gray-500">
                              {p.state || "N/A"}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block">
                              Num: {p.licensingNumber || "None"}
                            </p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                p.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {p.status || "pending"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedProvider(p)}
                                className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition"
                              >
                                View All Details
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateProviderStatus(p.id, "approved")
                                }
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateProviderStatus(p.id, "rejected")
                                }
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPOINTMENTS RENDER VIEW */}
          {activeTab === "appointments" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                All Scheduled Consultations
              </h3>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No medical bookings logged.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/30"
                    >
                      <p className="text-sm text-gray-700">
                        <b>Room Key ID:</b>{" "}
                        <span className="text-xs text-gray-500 font-mono">
                          {a.videoRoomId || "unassigned"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <b>Status:</b>{" "}
                        <span className="capitalize font-semibold text-emerald-600">
                          {a.status || "pending"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Performance Metrics
              </h3>
              <p className="text-gray-500 text-sm">
                System performance metrics and core operational parameters are
                running normally.
              </p>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                System Logs
              </h3>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 border rounded-xl bg-gray-50 text-sm"
                    >
                      <p className="font-semibold text-gray-800">{n.title}</p>
                      <p className="text-gray-600 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PARTNERS TAB */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                Enterprise Partner Inquiries
              </h3>

              {partnerRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No partner requests yet.
                </p>
              ) : (
                partnerRequests.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                      <p>
                        <b>Full Name:</b> {p.name || "N/A"}
                      </p>

                      <p>
                        <b>Organization:</b> {p.organization || "N/A"}
                      </p>

                      <p>
                        <b>Phone Number:</b> {p.phone || "N/A"}
                      </p>

                      <p>
                        <b>Office Address:</b> {p.officeAddress || "N/A"}
                      </p>

                      <p>
                        <b>State:</b> {p.state || "N/A"}
                      </p>

                      <p>
                        <b>ID Type:</b> {p.idType || "N/A"}
                      </p>

                      <p>
                        <b>ID Number:</b> {p.idNumber || "N/A"}
                      </p>

                      <p>
                        <b>Status:</b>{" "}
                        <span
                          className={`font-semibold capitalize ${
                            p.status === "approved"
                              ? "text-emerald-600"
                              : p.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {p.status || "pending"}
                        </span>
                      </p>

                      <p>
                        <b>Verified:</b> {p.verified ? "Yes" : "No"}
                      </p>

                      <p>
                        <b>Read:</b> {p.read ? "Yes" : "No"}
                      </p>
                    </div>

                    {/* MESSAGE */}
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 mb-1">
                        Message
                      </p>

                      <div className="bg-gray-50 border rounded-xl p-3 text-sm text-gray-700">
                        {p.message || "No message provided"}
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="mt-4 text-xs text-gray-500">
                      Submitted:{" "}
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleString()
                        : "Unknown date"}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => approvePartner(p.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Approve Partner
                      </button>

                      <button
                        onClick={() => rejectPartner(p.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
                      >
                        Reject Request
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}


          {/* APPOINTMENTS OR OVERVIEW TAB WINDOW */}
          <LabPharma activeTab={activeTab} dark={dark} />
        </main>

        {/* FULL FIELD DETAIL SIDE DRAWER */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 text-black backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto p-6 md:p-8 shadow-2xl relative flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedProvider.facilityName}
                  </h3>
                  <p className="text-sm text-emerald-600 font-medium">
                    {selectedProvider.facilityType} —{" "}
                    {selectedProvider.ownershipType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content Scrolling Body */}
              <div className="flex-1 space-y-8 pr-1 overflow-y-auto">
                {/* SECTION A & B */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Facility Identity & Contact info
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-xs">
                    <div>
                      <span className="text-gray-500 block">
                        Regulatory Body
                      </span>
                      <strong>
                        {selectedProvider.regulatoryBody || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">
                        Year Established
                      </span>
                      <strong>
                        {selectedProvider.yearEstablished || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">
                        Licensing Number
                      </span>
                      <strong>
                        {selectedProvider.licensingNumber || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Landmark</span>
                      <strong>{selectedProvider.landmark || "N/A"}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block">
                        Physical Address
                      </span>
                      <strong>
                        {selectedProvider.physicalAddress || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">State / City</span>
                      <strong>
                        {selectedProvider.state} / {selectedProvider.lga}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Website Links</span>
                      <a
                        href={selectedProvider.websiteSocial}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 underline"
                      >
                        {selectedProvider.websiteSocial || "None"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* SECTION F: STAFF COUNTS */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    SECTION F: Resource Capacity
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-xl font-bold text-blue-700">
                        {selectedProvider.numDoctors || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Doctors
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="text-xl font-bold text-purple-700">
                        {selectedProvider.numNurses || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Nurses
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <p className="text-xl font-bold text-amber-700">
                        {selectedProvider.numBeds || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Beds
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-xl">
                      <p className="text-xl font-bold text-teal-700">
                        {selectedProvider.numLabStaff || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Lab Staff
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <p className="text-xl font-bold text-gray-700">
                        {selectedProvider.numOtherStaff || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Others
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION D & E: AVAILABILITY & PAYMENTS */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Operation Windows
                    </h4>
                    <p className="text-xs text-gray-600">
                      Hours:{" "}
                      <strong className="text-black">
                        {selectedProvider.operatingHours || "N/A"}
                      </strong>
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedProvider.operationDays?.map((day) => (
                        <span
                          key={day}
                          className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded"
                        >
                          {day}
                        </span>
                      )) || (
                        <span className="text-xs text-gray-400">
                          None checked
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Payment & HMO Methods
                    </h4>
                    <p className="text-xs text-gray-600">
                      HMO Network:{" "}
                      <strong className="text-black">
                        {selectedProvider.acceptedHmos || "None"}
                      </strong>
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedProvider.paymentMethods?.map((method) => (
                        <span
                          key={method}
                          className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded"
                        >
                          {method}
                        </span>
                      )) || (
                        <span className="text-xs text-gray-400">
                          None checked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* FIXED SERVICES CHECKLISTS MATCHING PROVIDER FIELD NAMES */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    SECTION C: Services Checklists
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto border p-3 rounded-2xl bg-gray-50 text-xs">
                    {selectedProvider.clinicalGeneral?.length > 0 && (
                      <div>
                        <p className="font-bold text-emerald-800 mb-1">
                          General Clinical
                        </p>
                        <p>{selectedProvider.clinicalGeneral.join(", ")}</p>
                      </div>
                    )}
                    {selectedProvider.clinicalSpecialist?.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="font-bold text-emerald-800 mb-1">
                          Specialist Services
                        </p>
                        <p>{selectedProvider.clinicalSpecialist.join(", ")}</p>
                      </div>
                    )}
                    {selectedProvider.diagnosticLab?.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="font-bold text-emerald-800 mb-1">
                          Laboratory
                        </p>
                        <p>{selectedProvider.diagnosticLab.join(", ")}</p>
                      </div>
                    )}
                    {selectedProvider.diagnosticImaging?.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="font-bold text-emerald-800 mb-1">
                          Imaging
                        </p>
                        <p>{selectedProvider.diagnosticImaging.join(", ")}</p>
                      </div>
                    )}
                    {selectedProvider.alliedSupport?.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="font-bold text-emerald-800 mb-1">
                          Allied & Support
                        </p>
                        <p>{selectedProvider.alliedSupport.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION K: HIGH-END SPECIALIZED SERVICES */}
                {selectedProvider.specializedServices?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      SECTION K: Advanced Sub-Specialties
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProvider.specializedServices.map((srv) => (
                        <span
                          key={srv}
                          className="text-xs px-2.5 py-1 bg-purple-100 text-purple-800 font-semibold rounded-lg"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* DECLARATION DATA */}
                <div className="border-t pt-4 bg-gray-50 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Legal Declaration Details
                  </h4>
                  <p className="text-xs text-gray-500 italic mb-2">
                    "I hereby confirm that the information provided is accurate
                    and up to date."
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Full Name</span>
                      <strong>
                        {selectedProvider.declarationName || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Designation</span>
                      <strong>
                        {selectedProvider.declarationDesignation || "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Signed Date</span>
                      <strong>
                        {selectedProvider.declarationDate || "N/A"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action footer bar */}
              <div className="border-t pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateProviderStatus(selectedProvider.id, "rejected");
                    setSelectedProvider(null);
                  }}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateProviderStatus(selectedProvider.id, "approved");
                    setSelectedProvider(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition"
                >
                  Approve and Verify Facility ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

