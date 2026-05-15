import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES
import Home from "./pages/home";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

// Other Pages
import AISymptomsChecker from "./OtherPages/AISymptomsChecker";
import ConnectedDiagnostics from "./OtherPages/ConnectedDiagnostics";
import WellnessCoaching from "./OtherPages/WellnessCoaching";
import SmartHealthRecords from "./OtherPages/SmartHealthRecords";
import DigitalPharmacy from "./OtherPages/DigitalPharmacy";
import CertifiedSpecialists from "./OtherPages/CertifiedSpecialists";
import BecomeAPartner from "./OtherPages/BecomeAPartner";
import ViewSpecialists from "./OtherPages/ViewSpecialists";

// Footer Pages
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

// Consult Pages
import Signup from "./ConsultPages/Signup";
import Login from "./ConsultPages/Login";
import DoctorsPage from "./ConsultPages/DoctorsPage";
import DoctorDashboard from "./ConsultPages/DoctorDashboard";
import ProtectedRoute from "./ConsultPages/ProtectedRoute";
import VideoCall from "./ConsultPages/VideoCall";
import BookConsultation from "./ConsultPages/BookConsultation";

// Routes
import AdminRoute from "./routes/AdminRoute";
import PartnerRoute from "./routes/PartnerRoute";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// Principles
import Accessibility from "./Principles/Accessibility";
import Transparency from "./Principles/Transparency";
import Efficiency from "./Principles/Efficiency";
import Innovation from "./Principles/Innovation";
import Trust from "./Principles/Trust";
import PatientCentered from "./Principles/PatientCentered";

// Blog Details
import NutritionDetails from "./BlogDetails/NutritionDetails";
import HealthcareDetails from "./BlogDetails/HealthcareDetails";
import SurgeryDetails from "./BlogDetails/SurgeryDetails";
import GadgetsDetails from "./BlogDetails/GadgetsDetails";
import TechnologyDetails from "./BlogDetails/Technology Details";
import WellnessDetails from "./BlogDetails/WellnessDetails";

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute user={user}>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/become-a-partner"
          element={
            <PartnerRoute user={user}>
              {" "}
              {/* ← Pass user here */}
              <BecomeAPartner />
            </PartnerRoute>
          }
        />
        <Route path="/view-specialists" element={<ViewSpecialists />} />

        {/* Other Pages */}
        <Route path="/ai-symptoms-checker" element={<AISymptomsChecker />} />
        <Route
          path="/connected-diagnostics"
          element={<ConnectedDiagnostics />}
        />
        <Route path="/wellness-coaching" element={<WellnessCoaching />} />
        <Route path="/smart-health-records" element={<SmartHealthRecords />} />
        <Route path="/digital-pharmacy" element={<DigitalPharmacy />} />
        <Route
          path="/certified-specialists"
          element={<CertifiedSpecialists />}
        />

        {/* Footer Pages */}
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

        {/* Consult Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors-page" element={<DoctorsPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/videocall/:roomId" element={<VideoCall />} />

        <Route
          path="/book-consultation/:id"
          element={
            <ProtectedRoute>
              <BookConsultation />
            </ProtectedRoute>
          }
        />

        <Route path="/blog" element={<Blog />} />

        {/* Principles */}
        <Route path="/values/accessibility" element={<Accessibility />} />
        <Route path="/values/transparency" element={<Transparency />} />
        <Route path="/values/efficiency" element={<Efficiency />} />
        <Route path="/values/innovation" element={<Innovation />} />
        <Route path="/values/trust" element={<Trust />} />
        <Route path="/values/patient-centered" element={<PatientCentered />} />

        {/* Blog Details */}
        <Route path="/blog/technology" element={<TechnologyDetails />} />
        <Route path="/blog/wellness" element={<WellnessDetails />} />
        <Route path="/blog/nutrition" element={<NutritionDetails />} />
        <Route path="/blog/healthcare" element={<HealthcareDetails />} />
        <Route path="/blog/surgery" element={<SurgeryDetails />} />
        <Route path="/blog/gadgets" element={<GadgetsDetails />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
