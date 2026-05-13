import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../utils/useAdminAuth";

import { db } from "../firebase";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
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
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { isAdmin, loading } = useAdminAuth();

  // Dynamic Firebase Data
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const data = [
    { name: "Mon", users: 400 },
    { name: "Tue", users: 800 },
    { name: "Wed", users: 600 },
    { name: "Thu", users: 1200 },
    { name: "Fri", users: 900 },
  ];

  // ✅ FIXED: LIVE FIREBASE VALUES
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
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  // Real-time Firebase Listeners (UNCHANGED - already correct)
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubProviders = onSnapshot(collection(db, "providers"), (snap) => {
      setProviders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAppointments = onSnapshot(
      collection(db, "appointments"),
      (snap) => {
        setAppointments(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
    );

    const unsubNotifications = onSnapshot(
      collection(db, "notifications"),
      (snap) => {
        setNotifications(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
    );

    return () => {
      unsubUsers();
      unsubProviders();
      unsubAppointments();
      unsubNotifications();
    };
  }, []);


  if (loading) return <p className="p-6">Checking access...</p>;
  if (!isAdmin) return <p className="p-6 text-red-500">Access Denied</p>;




  return (
    <div
      className={
        dark
          ? "bg-gray-950 text-white min-h-screen"
          : "bg-gray-100 min-h-screen"
      }
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-gray-100 shadow-sm sticky top-0 z-50">
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <h1 className="text-base md:text-xl font-bold text-emerald-600">
          MedConnectNG Dashboard
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40">
          <div className="w-72 h-full bg-white p-5 shadow-xl">
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
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 cursor-pointer"
                >
                  <Icon size={18} className="text-emerald-600" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR (UNCHANGED) */}
        <aside className="hidden lg:block bg-white rounded-2xl shadow-md p-5 space-y-5 h-fit">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  activeTab === item.key
                    ? "bg-emerald-100 text-emerald-700"
                    : "hover:bg-emerald-50"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-3 space-y-6">
          {/* OVERVIEW (LIVE NOW) */}
          {activeTab === "overview" && (
            <>
              <h2 className="text-xl md:text-2xl font-bold">
                Welcome, Doctor 👨‍⚕️
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl shadow-md bg-gradient-to-r ${c.color} text-white`}
                  >
                    <p className="text-sm opacity-80">{c.title}</p>
                    <h3 className="text-2xl font-bold">
                      {typeof c.value === "number"
                        ? c.value.toLocaleString()
                        : c.value}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#10b981"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* USERS (UNCHANGED) */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Date Joined</th>
                    <th>Last Active</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id || i} className="border-b hover:bg-gray-50">
                      <td className="py-3">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.dateJoined || u.createdAt}</td>
                      <td>{u.lastActive || "N/A"}</td>
                      <td>
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          {u.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PROVIDERS (UNCHANGED) */}
          {activeTab === "providers" && (
            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Providers</h2>
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Hospital Name</th>
                    <th>Specialty</th>
                    <th>Date Registered</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p, i) => (
                    <tr key={p.id || i} className="border-b hover:bg-gray-50">
                      <td className="py-3">{p.name}</td>
                      <td>{p.specialty}</td>
                      <td>{p.dateRegistered}</td>
                      <td>{p.time}</td>
                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            p.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* APPOINTMENTS (UNCHANGED) */}
          {activeTab === "appointments" && (
            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Appointments</h2>
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Patient</th>
                    <th>Hospital</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={a.id || i} className="border-b hover:bg-gray-50">
                      <td className="py-3">{a.name || a.patientName}</td>
                      <td>{a.hospital}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            a.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ANALYTICS + NOTIFICATIONS (UNCHANGED) */}
          {activeTab === "analytics" && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
              <p className="text-gray-500 text-sm mb-6">
                System performance and healthcare activity insights
              </p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Notifications Center</h2>

              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <div
                    key={n.id || i}
                    className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {n.title || n.message}
                      </p>
                    </div>
                    <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
