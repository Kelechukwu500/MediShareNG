import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"



 // PAGES //
import Home from "./pages/home"
import SearchPage from "./pages/SearchPage"
import History from "./pages/History"
import Dashboard from "./pages/Dashboard"
import Services from "./pages/Services"
import Contact from "./pages/Contact"


//Other imports //
import AISymptomsChecker from "./OtherPages/AISymptomsChecker"
import ConnectedDiagnostics from "./OtherPages/ConnectedDiagnostics"
import WellnessCoaching from "./OtherPages/WellnessCoaching"
import SmartHealthRecords from "./OtherPages/SmartHealthRecords"
import DigitalPharmacy from "./OtherPages/DigitalPharmacy"
import CertifiedSpecialists from "./OtherPages/CertifiedSpecialists"
import BecomeAPartner from "./OtherPages/BecomeAPartner"


// Footer Pages //
import OnlineConsultation from "./FooterPages/OnlineConsultation"
import ConsultationFlow from "./FooterPages/ConsultationFlow"
import LaboratoryTests from "./FooterPages/LaboratoryTests"
import LabFinder from "./FooterPages/LabFinder"
import PricingPlans from "./FooterPages/PricingPlans"
import HealthTips from "./FooterPages/HealthTips"
import Privacy  from "./FooterPages/Privacy"
import Terms from "./FooterPages/Terms"
import FAQ from "./FooterPages/FAQ"
import Cookies from "./FooterPages/Cookies"
import MeetOurBoard from "./FooterPages/MeetOurBoard"





//Consult Pages //
import Signup from "./ConsultPages/Signup"
import Login from "./ConsultPages/Login"
import DoctorsPage from "./ConsultPages/DoctorsPage"
import DoctorDashboard from './ConsultPages/DoctorDashboard'

import VideoCall from "./ConsultPages/VideoCall"
import BookConsultation from "./ConsultPages/BookConsultation"



import AdminRoute from "./routes/AdminRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";









const App = () => {

  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/history" element={<History />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute user={user}>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

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
        <Route path="/become-a-partner" element={<BecomeAPartner />} />

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

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors-page" element={<DoctorsPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/videocall/:roomId" element={<VideoCall />} />

        <Route path="/book-consultation" element={<BookConsultation />} />
      </Routes>
      <Footer />
    </div>
  );
}



export default App