import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// AUTH LAYOUTS
import Login from "./components/Login";

// APPLICATION DASHBOARDS
import PatientDashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/History"; // Placeholder routes mapped from your collection list
import AdminDashboard from "./pages/home";
import VideoCall from "./components/VideoCall";

// ROUTE PROTECTION COMPONENTS
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;

  // If user role falls inside the permitted checklist or matches our dual admin-doctor status
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin-doctor" && allowedRoles.includes("doctor")) {
      return children; // Grant cross-route access across channels automatically
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="app-container bg-slate-50 min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Views */}
          <Route path="/login" element={<Login />} />

          {/* Patient Access Routes */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor Access Routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor", "admin-doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Management Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "admin-doctor"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Live Video Streams Signaling Channel */}
          <Route
            path="/video-call/:roomId"
            element={
              <ProtectedRoute
                allowedRoles={["doctor", "patient", "admin-doctor"]}
              >
                <VideoCall />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
