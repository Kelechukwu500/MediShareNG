import React from "react";
import { Link } from "react-router";
import {
  Bot,
  FileText,
  Stethoscope,
  Pill,
  FlaskConical,
  HeartPulse,
  ArrowRight,
} from "lucide-react";

/* ================= IMAGES ================= */
import specialists from "../assets/specialists.jpg";
import medrecords from "../assets/medrecords.jpg";
import digipharm from "../assets/digipharm.jpg";
import diagnostics from "../assets/diagnostics.jpg";
import wellness from "../assets/wellness.jpg";
import aicheck from "../assets/aicheck.jpg";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#ecfdf5] overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="text-center px-4 md:px-10 pt-20 pb-14">
        <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold shadow-sm">
          MedConnectNG Healthcare Ecosystem
        </span>

        <h1 className="text-4xl md:text-6xl font-black mt-6 text-gray-900 leading-tight">
          Smart Digital Healthcare
          <span className="block text-emerald-600">
            Built For Modern Living
          </span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
          Experience healthcare beyond traditional systems. MedConnectNG brings
          together AI-powered diagnostics, secure health records, certified
          specialists, wellness coaching, digital pharmacy delivery, and smart
          diagnostics into one connected ecosystem designed for speed,
          accessibility, and patient-centered care.
        </p>

        {/* BADGES */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            "AI Healthcare",
            "Secure Records",
            "Certified Doctors",
            "24/7 Support",
            "Same-Day Pharmacy",
            "Connected Diagnostics",
          ].map((item, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-white border border-emerald-100 rounded-full text-sm font-medium text-emerald-700 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ================= SERVICES GRID ================= */}
      <div className="px-4 md:px-8 lg:px-10 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ================= SPECIALISTS ================= */}
          <SectionCard
            badge="FAST ACCESS"
            image={specialists}
            icon={<Stethoscope size={28} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
            title="Certified Specialists"
            subtitle="Connect with verified healthcare professionals instantly"
            description="Access board-certified specialists across over 40 medical fields through secure HD video consultations and instant messaging. MedConnectNG ensures patients receive fast, professional, and reliable medical guidance without long hospital waiting times."
            features={[
              "40+ medical specialties available",
              "HD video consultations",
              "Verified licensed practitioners",
              "Secure real-time doctor messaging",
            ]}
            route="/specialists"
          />

          {/* ================= HEALTH RECORDS ================= */}
          <SectionCard
            badge="SECURE VAULT"
            image={medrecords}
            icon={<FileText size={28} className="text-blue-600" />}
            iconBg="bg-blue-100"
            title="Smart Health Records"
            subtitle="Securely store and access your health history"
            description="Your prescriptions, medical history, diagnoses, and laboratory reports are safely stored in an encrypted cloud vault accessible anytime and anywhere. Share your records instantly with doctors while maintaining full privacy and security."
            features={[
              "Encrypted cloud storage",
              "Instant medical history access",
              "Shareable doctor records",
              "Cross-device synchronization",
            ]}
            route="/health-records"
          />

          {/* ================= PHARMACY ================= */}
          <SectionCard
            badge="SAME-DAY DELIVERY"
            image={digipharm}
            icon={<Pill size={28} className="text-purple-600" />}
            iconBg="bg-purple-100"
            title="Digital Pharmacy"
            subtitle="Fast prescription fulfillment and doorstep delivery"
            description="Prescriptions are instantly routed to trusted pharmacies within the MedConnectNG network for rapid preparation and same-day delivery directly to your location. Patients can also track medication orders in real-time."
            features={[
              "Instant prescription routing",
              "Real-time medication tracking",
              "Verified pharmacy partners",
              "Same-day doorstep delivery",
            ]}
            route="/digital-pharmacy"
          />

          {/* ================= DIAGNOSTICS ================= */}
          <SectionCard
            badge="HOME TESTING"
            image={diagnostics}
            icon={<FlaskConical size={28} className="text-orange-600" />}
            iconBg="bg-orange-100"
            title="Connected Diagnostics"
            subtitle="Schedule tests and receive digital lab reports instantly"
            description="Book home sample collection services for laboratory tests and diagnostic procedures directly from the platform. Results are synced automatically to your health profile and can also be reviewed by your doctor."
            features={[
              "Home sample collection",
              "Automated digital results",
              "Doctor dashboard integration",
              "Smart health tracking",
            ]}
            route="/connected-diagnostics"
          />

          {/* ================= WELLNESS ================= */}
          <SectionCard
            badge="WELLNESS CARE"
            image={wellness}
            icon={<HeartPulse size={28} className="text-pink-600" />}
            iconBg="bg-pink-100"
            title="Wellness Coaching"
            subtitle="Long-term support for mental and physical health"
            description="Receive continuous guidance from healthcare professionals focused on nutrition, mental health, chronic illness management, and healthier lifestyle practices designed to improve your long-term wellbeing."
            features={[
              "Nutrition and fitness guidance",
              "Mental health support",
              "Lifestyle coaching programs",
              "Chronic disease management",
            ]}
            route="/wellness-coaching"
          />

          {/* ================= AI SYMPTOMS ================= */}
          <SectionCard
            badge="AI POWERED"
            image={aicheck}
            icon={<Bot size={28} className="text-red-600" />}
            iconBg="bg-red-100"
            title="AI Symptoms Checker"
            subtitle="Instant AI-driven symptom analysis and triage"
            description="Describe your symptoms and receive immediate AI-powered health analysis, triage recommendations, and risk insights. MedAI helps patients make faster and more informed healthcare decisions before visiting a clinic."
            features={[
              "AI symptom analysis",
              "Voice-enabled consultations",
              "Medical triage support",
              "Instant clinical insights",
            ]}
            route="/ai-symptoms-checker"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;

/* ================= REUSABLE CARD ================= */

const SectionCard = ({
  badge,
  image,
  icon,
  iconBg,
  title,
  subtitle,
  description,
  features,
  route,
}) => {

    
  return (
  <div className="bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
    
    {/* IMAGE HOLDER */}
    <div className="w-full h-[220px] sm:h-[520px] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition duration-500"
      />
    </div>

    {/* CONTENT */}
    <div className="p-5 md:p-6 flex flex-col flex-1">
      
      {/* TOP */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`${iconBg} p-3 rounded-xl shadow-sm`}>
          {icon}
        </div>

        <div>
          <span className="inline-block text-[10px] font-semibold tracking-wide bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            {badge}
          </span>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 leading-tight">
            {title}
          </h2>

          <p className="text-emerald-600 font-medium text-sm mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 leading-relaxed text-sm mb-5 flex-1">
        {description}
      </p>

      {/* FEATURES */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <Link to={route}>
        <button className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition duration-300">
          Explore More
          <ArrowRight size={16} />
        </button>
      </Link>
    </div>
  </div>
)};
