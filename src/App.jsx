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
          {/* ALWAYS PUBLIC VISIBLE AUTH CHANNELS */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 🔓 UNLOCKED GUEST CHANNELS (Only Become a Partner remains completely public) */}
          <Route path="/become-a-partner" element={<BecomeAPartner />} />

          {/* MASTER SECURITY INTERCEPT GATEWAY */}
          {!user ? (
            /* IF FIREBASE SAYS UNVERIFIED, REDIRECT STRANGERS TO LOGIN IMMEDATELY */
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : (
            /* ONLY MOUNT APPLICATION MAP IF AN AUTHENTICATED ACCOUNT EXISTS */
            <>
              {/* APPLICATION MAIN PAGES */}
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* 🔒 LOCKED SECURE HEALTH SERVICE PIPELINES */}
              <Route
                path="/e-pharmacy"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <DigitalPharmacy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/digital-pharmacy" /* Added matching fallback route found on footer link */
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
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
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <LaboratoryTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/laboratory-tests" /* Added matching fallback route found on footer link */
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
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
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <LabFinder />
                  </ProtectedRoute>
                }
              />

              {/* 🔒 PROTECTED FOOTER PAGES (Moved inside the auth boundary) */}
              <Route
                path="/meet-our-board"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <MeetOurBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/online-consultation"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <OnlineConsultation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pricing-plans"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <PricingPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health-tips"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <HealthTips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <Blog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <Privacy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/terms"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <Terms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cookies"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <Cookies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "patient",
                      "doctor",
                      "admin",
                      "admin-doctor",
                    ]}
                    user={user}
                  >
                    <FAQ />
                  </ProtectedRoute>
                }
              />

              {/* PROTECTED ROUTING MATRIX */}
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
                path="/videocall/:roomId"
                element={
                  <ProtectedRoute
                    allowedRoles={["doctor", "patient", "admin-doctor"]}
                    user={user}
                  >
                    <VideoCall />
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

              <Route path="/view-specialists" element={<ViewSpecialists />} />
              <Route
                path="/ai-symptoms-checker"
                element={<AISymptomsChecker />}
              />
              <Route
                path="/connected-diagnostics"
                element={<ConnectedDiagnostics />}
              />
              <Route
                path="/smart-health-records"
                element={<SmartHealthRecords />}
              />
              <Route
                path="/certified-specialists"
                element={<CertifiedSpecialists />}
              />
              <Route path="/consultation-flow" element={<ConsultationFlow />} />

              {/* CORE PRINCIPLE ROUTING */}
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/efficiency" element={<Efficiency />} />
              <Route path="/innovation" element={<Innovation />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/patient-centered" element={<PatientCentered />} />

              {/* RE-ROUTING WILDCARD CATCH FOR ACTIVE SESSIONS */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
