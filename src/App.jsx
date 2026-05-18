import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES
import Home from "./pages/home";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

// OTHER PAGES
import AISymptomsChecker from "./OtherPages/AISymptomsChecker";
import ConnectedDiagnostics from "./OtherPages/ConnectedDiagnostics";
import SmartHealthRecords from "./OtherPages/SmartHealthRecords";
import DigitalPharmacy from "./OtherPages/DigitalPharmacy";
import CertifiedSpecialists from "./OtherPages/CertifiedSpecialists";
import BecomeAPartner from "./OtherPages/BecomeAPartner";
import ViewSpecialists from "./OtherPages/ViewSpecialists";

// FOOTER PAGES
import OnlineConsultation from "./FooterPages/OnlineConsultation";
import ConsultationFlow from "./FooterPages/ConsultationFlow";
import LaboratoryTests from "./FooterPages/LaboratoryTests";
import LabFinder from "./FooterPages/LabFinder";
import PricingPlans from "./FooterPages/PricingPlans";
import HealthTips from "./FooterPages/HealthTips";
import Privacy from "./FooterPages/Privacy";
import Terms from "./FooterPages/Terms";
import FAQ from "./FooterPages/FAQ";
import Cookies from "./FooterPages/Cookies";
import MeetOurBoard from "./FooterPages/MeetOurBoard";
import Blog from "./FooterPages/Blog";

// CONSULT PAGES
import Signup from "./ConsultPages/Signup";
import Login from "./ConsultPages/Login";
import DoctorsPage from "./ConsultPages/DoctorsPage";
import DoctorDashboard from "./ConsultPages/DoctorDashboard";
import VideoCall from "./ConsultPages/VideoCall";
import BookConsultation from "./ConsultPages/BookConsultation";
import PatientDashboard from "./ConsultPages/PatientDashboard";

// FIREBASE
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// PRINCIPLES
import Accessibility from "./Principles/Accessibility";
import Transparency from "./Principles/Transparency";
import Efficiency from "./Principles/Efficiency";
import Innovation from "./Principles/Innovation";
import Trust from "./Principles/Trust";
import PatientCentered from "./Principles/PatientCentered";

// BLOG DETAILS
import NutritionDetails from "./BlogDetails/NutritionDetails";
import HealthcareDetails from "./BlogDetails/HealthcareDetails";
import SurgeryDetails from "./BlogDetails/SurgeryDetails";
import GadgetsDetails from "./BlogDetails/GadgetsDetails";
import TechnologyDetails from "./BlogDetails/Technology Details";
import WellnessDetails from "./BlogDetails/WellnessDetails";

// ASYNCHRONOUS SECURE ROUTE PROTECTION LAYER
const ProtectedRoute = ({ children, allowedRoles, user }) => {
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("userRole"),
  );
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const verifySessionSecurity = async () => {
      if (!user) {
        localStorage.clear();
        sessionStorage.clear();
        setCurrentRole(null);
        setCheckingRole(false);
        return;
      }

      if (user && !localStorage.getItem("userRole")) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const role = docSnap.data().role;
            localStorage.setItem("userId", user.uid);
            localStorage.setItem("userRole", role);
            setCurrentRole(role);
          }
        } catch (err) {
          console.error("Failed to re-sync user permission metadata:", err);
        }
      } else {
        setCurrentRole(localStorage.getItem("userRole"));
      }
      setCheckingRole(false);
    };

    verifySessionSecurity();
  }, [user]);

  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#2bb673] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !localStorage.getItem("userId")) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    if (currentRole === "admin-doctor" && allowedRoles.includes("doctor")) {
      return children;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2bb673] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-6 text-2xl font-bold text-[#065f46]">
            Loading MediShareNG...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-slate-50 min-h-screen flex flex-col justify-between overflow-hidden">
      <Navbar user={user} />
      <main className="flex-grow">
        <Routes>
          {/* =========================================================
             PUBLIC UNRESTRICTED CHANNELS
             ========================================================= */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/become-a-partner" element={<BecomeAPartner />} />

          {/* =========================================================
             PROTECTED ROUTE MATRIX (All wrapped safely to prevent drops)
             ========================================================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute user={user}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute user={user}>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute user={user}>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* 🎥 PEER-TO-PEER VIDEO CONSULTATION ROOM */}
          <Route
            path="/video-call/:roomId"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <VideoCall />
              </ProtectedRoute>
            }
          />

          {/* LOCKED CORE MEDICAL PIPELINES */}
          <Route
            path="/e-pharmacy"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <DigitalPharmacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/digital-pharmacy"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <DigitalPharmacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e-laboratory"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <LaboratoryTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laboratory-tests"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <LaboratoryTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-finder"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin", "admin-doctor"]}
                user={user}
              >
                <LabFinder />
              </ProtectedRoute>
            }
          />

          {/* PROTECTED FOOTER INFRASTRUCTURE */}
          <Route
            path="/meet-our-board"
            element={
              <ProtectedRoute user={user}>
                <MeetOurBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/online-consultation"
            element={
              <ProtectedRoute user={user}>
                <OnlineConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing-plans"
            element={
              <ProtectedRoute user={user}>
                <PricingPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-tips"
            element={
              <ProtectedRoute user={user}>
                <HealthTips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute user={user}>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute user={user}>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute user={user}>
                <Terms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cookies"
            element={
              <ProtectedRoute user={user}>
                <Cookies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute user={user}>
                <FAQ />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD ACCESS ROUTING PORTS */}
          <Route
            path="/doctors-page"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "admin-doctor"]}
                user={user}
              >
                <DoctorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-consultation/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]} user={user}>
                <BookConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["doctor", "admin-doctor"]}
                user={user}
              >
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]} user={user}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "admin-doctor"]}
                user={user}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADDITIONAL UTILITY MODULE ROUTES */}
          <Route
            path="/view-specialists"
            element={
              <ProtectedRoute user={user}>
                <ViewSpecialists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-symptoms-checker"
            element={
              <ProtectedRoute user={user}>
                <AISymptomsChecker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connected-diagnostics"
            element={
              <ProtectedRoute user={user}>
                <ConnectedDiagnostics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-health-records"
            element={
              <ProtectedRoute user={user}>
                <SmartHealthRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certified-specialists"
            element={
              <ProtectedRoute user={user}>
                <CertifiedSpecialists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultation-flow"
            element={
              <ProtectedRoute user={user}>
                <ConsultationFlow />
              </ProtectedRoute>
            }
          />

          {/* MEDICAL SYSTEM CORE PRINCIPLES */}
          <Route
            path="/accessibility"
            element={
              <ProtectedRoute user={user}>
                <Accessibility />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transparency"
            element={
              <ProtectedRoute user={user}>
                <Transparency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/efficiency"
            element={
              <ProtectedRoute user={user}>
                <Efficiency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/innovation"
            element={
              <ProtectedRoute user={user}>
                <Innovation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trust"
            element={
              <ProtectedRoute user={user}>
                <Trust />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-centered"
            element={
              <ProtectedRoute user={user}>
                <PatientCentered />
              </ProtectedRoute>
            }
          />

          {/* =========================================================
             GLOBAL SAFETY FALLBACK SECURITY INTERCEPT
             ========================================================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
