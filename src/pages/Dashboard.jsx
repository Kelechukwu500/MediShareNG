import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../utils/useAdminAuth";

import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

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
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "partners", label: "Partner Requests", icon: Handshake },
  ];

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

    const unsubPartners = onSnapshot(
      collection(db, "partnerRequests"),
      (snap) => {
        setPartnerRequests(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
    );

    return () => {
      unsubUsers();
      unsubProviders();
      unsubAppointments();
      unsubNotifications();
      unsubPartners();
    };
  }, []);

  // ✅ CLEAN ADMIN ACTIONS (ONLY ONCE)
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
          MediShareNG Dashboard
        </h1>

        <button onClick={() => setDark(!dark)}>
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
                    ? "bg-emerald-100 text-emerald-700"
                    : "hover:bg-emerald-50"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </aside>

        {/* MAIN */}
        <main className="lg:col-span-3 space-y-6">
          {activeTab === "overview" && (
            <>
              <h2 className="text-xl font-bold">Welcome 👨‍⚕️</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl bg-gradient-to-r ${c.color} text-white`}
                  >
                    <p>{c.title}</p>
                    <h3 className="text-2xl font-bold">{c.value}</h3>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PARTNERS TAB ONLY */}
          {activeTab === "partners" && (
            <div className="space-y-3">
              {partnerRequests.length === 0 ? (
                <p className="text-gray-500">No partner requests yet.</p>
              ) : (
                partnerRequests.map((p) => (
                  <div key={p.id} className="border p-4 rounded-xl space-y-2">
                    <p>
                      <b>Name:</b> {p.name}
                    </p>
                    <p>
                      <b>Email:</b> {p.email}
                    </p>
                    <p>
                      <b>Org:</b> {p.organization}
                    </p>
                    <p>
                      <b>Status:</b>{" "}
                      <span className="font-semibold">{p.status}</span>
                    </p>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => approvePartner(p.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectPartner(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
