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
// import WellnessCoaching from "./OtherPages/WellnessCoaching";
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
import ProtectedRoute from "./ConsultPages/ProtectedRoute";
import VideoCall from "./ConsultPages/VideoCall";
import BookConsultation from "./ConsultPages/BookConsultation";
import PatientDashboard from "./ConsultPages/PatientDashboard";

// ROUTES
import AdminRoute from "./routes/AdminRoute";
import PartnerRoute from "./routes/PartnerRoute";

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

const App = () => {
  const [user, loading] = useAuthState(auth);
  const isAuthenticated = !!user;

  // LOADING SCREEN
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
    <div className="overflow-hidden">
      <Navbar user={user} />
      <Routes>
        {/* AUTH PAGES (ALWAYS PUBLIC) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED APP AREA */}
        {isAuthenticated ? (
          <>
            {/* MAIN APP */}
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />

            {/* CONSULTATION */}
            <Route
              path="/doctors-page"
              element={
                <ProtectedRoute>
                  <DoctorsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-consultation/:id"
              element={
                <ProtectedRoute>
                  <BookConsultation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/videocall/:roomId"
              element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              }
            />

            <Route path="/patient-dashboard" element={<PatientDashboard />} />

            {/* ADMIN */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute user={user}>
                  <Dashboard />
                </AdminRoute>
              }
            />

            {/* OTHER APP ROUTES */}
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
            <Route path="/digital-pharmacy" element={<DigitalPharmacy />} />
            <Route
              path="/certified-specialists"
              element={<CertifiedSpecialists />}
            />

            {/* FOOTER PAGES */}
            <Route
              path="/online-consultation"
              element={<OnlineConsultation />}
            />
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

            {/* BLOG */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/technology" element={<TechnologyDetails />} />
            <Route path="/blog/wellness" element={<WellnessDetails />} />
            <Route path="/blog/nutrition" element={<NutritionDetails />} />
            <Route path="/blog/healthcare" element={<HealthcareDetails />} />
            <Route path="/blog/surgery" element={<SurgeryDetails />} />
            <Route path="/blog/gadgets" element={<GadgetsDetails />} />

            {/* PRINCIPLES */}
            <Route path="/values/accessibility" element={<Accessibility />} />
            <Route path="/values/transparency" element={<Transparency />} />
            <Route path="/values/efficiency" element={<Efficiency />} />
            <Route path="/values/innovation" element={<Innovation />} />
            <Route path="/values/trust" element={<Trust />} />
            <Route
              path="/values/patient-centered"
              element={<PatientCentered />}
            />
          </>
        ) : (
          // If NOT logged in → force login page
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
