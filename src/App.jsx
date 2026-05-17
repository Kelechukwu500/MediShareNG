import React from "react";
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
import { auth } from "./firebase";

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

// ROBUST DUAL-ROLE ROUTE PROTECTION LAYER
const ProtectedRoute = ({ children, allowedRoles, user }) => {
  const token = localStorage.getItem("userId") || user?.uid;
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Cross-channel bypass: Allow 'admin-doctor' to pass validation checks for doctor views
    if (role === "admin-doctor" && allowedRoles.includes("doctor")) {
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
          {/* ALWAYS PUBLIC VISIBLE VIEWS */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* APPLICATION MAIN PAGES */}
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* PROTECTED ROUTING MATRIX (Role verified & synced across Firebase instances) */}
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
            path="/video-call/:roomId"
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

          {/* UTILITY CORE PAGES */}
          <Route path="/view-specialists" element={<ViewSpecialists />} />
          <Route path="/ai-symptoms-checker" element={<AISymptomsChecker />} />
          <Route
            path="/connected-diagnostics"
            element={<ConnectedDiagnostics />}
          />
          <Route
            path="/smart-health-records"
            element={<SmartHealthRecords />}
          />
          <Route path="/digital-pharmacy" element={<DigitalPharmacy />} />
          <Route
            path="/certified-specialists"
            element={<CertifiedSpecialists />}
          />
          <Route path="/become-a-partner" element={<BecomeAPartner />} />

          {/* INFORMATION & COMPLIANCE FOOTER VIEWS */}
          <Route path="/online-consultation" element={<OnlineConsultation />} />
          <Route path="/consultation-flow" element={<ConsultationFlow />} />
          <Route path="/laboratory-tests" element={<LaboratoryTests />} />
          <Route path="/lab-finder" element={<LabFinder />} />
          <Route path="/pricing-plans" element={<PricingPlans />} />
          <Route path="/health-tips" element={<HealthTips />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/meet-our-board" element={<MeetOurBoard />} />

          {/* SYSTEM GUIDING PRINCIPLES */}
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/efficiency" element={<Efficiency />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/patient-centered" element={<PatientCentered />} />

          {/* MEDIA BLOG ARCHIVE & REVIEWS */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/technology" element={<TechnologyDetails />} />
          <Route path="/blog/wellness" element={<WellnessDetails />} />
          <Route path="/blog/nutrition" element={<NutritionDetails />} />
          <Route path="/blog/healthcare" element={<HealthcareDetails />} />
          <Route path="/blog/surgery" element={<SurgeryDetails />} />
          <Route path="/blog/gadgets" element={<GadgetsDetails />} />

          {/* FALLBACK SYSTEM */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
