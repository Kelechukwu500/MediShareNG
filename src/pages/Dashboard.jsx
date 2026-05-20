import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LabPharma from "./LabPharma"; // Adjust the relative path path based on your file structure
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

    // CLEAN SNAPSHOT WRAPPER FOR PRIVILEGED USERS ONLY
    const unsubProviders = onSnapshot(
      collection(db, "users"),
      (snap) => {
        // Since providers are users with medical designations, filter them safely out of the users stream
        // to resolve the unconfigured Firestore collection permission crash
        const filteredProviders = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.role === "doctor" || u.role === "admin-doctor");
        setProviders(filteredProviders);
      },
      (err) => console.error("Providers query tracking error:", err.message),
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
      unsubPartners();""
    };
  }, [isAdminAuthorized]);


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

          {/* PROVIDERS RENDER VIEW */}
          {activeTab === "providers" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Medical Providers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="pb-3 font-semibold">Medical Specialist</th>
                      <th className="pb-3 font-semibold">Clinic Email</th>
                      <th className="pb-3 font-semibold">Status Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 text-sm">
                    {providers.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3">{p.fullName}</td>
                        <td className="py-3">{p.email}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {p.role === "admin-doctor"
                              ? "Chief Executive Admin"
                              : "Practitioner"}
                          </span>
                        </td>
                      </tr>
                    ))}
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
          {/* PLACE THIS SINGLE COMPONENT BELOW YOUR APPOINTMENTS OR OVERVIEW TAB WINDOW */}
          <LabPharma activeTab={activeTab} dark={dark} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
