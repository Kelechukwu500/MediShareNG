import React, { useState } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const Provider = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    facilityName: "",
    facilityType: "",
    ownershipType: "",
    yearEstablished: "",
    licensingNumber: "",
    regulatoryBody: "",

    physicalAddress: "",
    state: "",
    lga: "",
    landmark: "",
    phoneNumbers: "",
    officialEmail: "",
    websiteSocial: "",

    operatingHours: "",
    acceptedHmos: "",

    numDoctors: "",
    numNurses: "",
    numBeds: "",
    numLabStaff: "",
    numOtherStaff: "",

    declarationName: "",
    declarationDesignation: "",
    declarationSignature: "",
    declarationDate: "",

    primaryContact: {
      name: "",
      position: "",
      phone: "",
      email: "",
    },

    secondaryContact: {
      name: "",
      position: "",
      phone: "",
      email: "",
    },

    clinicalGeneral: [],
    clinicalSpecialist: [],
    diagnosticLab: [],
    diagnosticImaging: [],
    alliedSupport: [],
    operationDays: [],
    paymentMethods: [],
    specializedServices: [],
  });

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  const labelClass = "block text-sm font-semibold text-gray-800 mb-2";

  const sectionClass =
    "bg-white/90 backdrop-blur-xl border-2 border-black rounded-[32px] shadow-2xl p-6 md:p-10";

  const checkboxClass = "w-4 h-4 accent-emerald-600";

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const exists = prev[field].includes(value);

      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  // 3. ASYNC FIREBASE SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button & show loading state

    try {
      // Save form data into a Firestore collection named "providers"
      const docRef = await addDoc(collection(db, "providers"), {
        ...formData,
        status: "pending", // Useful flag for your Admin Dashboard to filter/approve entries
        submittedAt: serverTimestamp(), // Adds a reliable timestamp from Firebase servers for sorting
      });

      console.log("Document successfully written with ID: ", docRef.id);
      alert(
        "Application submitted successfully! Our admin team will review your details.",
      );

      // Optional: Reset form fields back to empty strings/arrays after success
      e.target.reset();
    } catch (error) {
      console.error("Firebase Submission Error: ", error);
      alert(
        "An error occurred while saving your data. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false); // Re-enable the submit button
    }
  };

  const renderCheckboxGroup = (title, field, options) => (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-gray-800">{title}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 text-gray-700">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={formData[field].includes(option)}
              onChange={() => handleCheckboxChange(field, option)}
            />

            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-teal-50 py-16 px-4">
      {/* BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl"></div>

      {/* FLOATING BADGES */}
      <div className="hidden lg:block absolute top-24 left-10 animate-bounce">
        <div className="bg-white border-2 border-black rounded-3xl shadow-2xl px-6 py-5">
          <p className="text-3xl font-bold text-emerald-600">500+</p>
          <p className="text-sm text-gray-600">Trusted Healthcare Providers</p>
        </div>
      </div>

      <div
        className="hidden lg:block absolute top-40 right-10 animate-bounce"
        style={{ animationDelay: "1s" }}
      >
        <div className="bg-white border-2 border-black rounded-3xl shadow-2xl px-6 py-5">
          <p className="text-3xl font-bold text-emerald-600">24/7</p>
          <p className="text-sm text-gray-600">Smart Healthcare Access</p>
        </div>
      </div>

      <div
        className="hidden lg:block absolute bottom-32 left-20 animate-bounce"
        style={{ animationDelay: "2s" }}
      >
        <div className="bg-white border-2 border-black rounded-3xl shadow-2xl px-6 py-5">
          <p className="text-3xl font-bold text-emerald-600">Digital</p>
          <p className="text-sm text-gray-600">Healthcare Transformation</p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-16">
          <div className="inline-flex px-6 py-3 rounded-full bg-emerald-100 text-emerald-700 font-semibold mb-6">
            MediShareNG Healthcare Ecosystem
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight max-w-5xl mx-auto">
            Healthcare Facility Service Registration Form
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join a connected healthcare ecosystem designed to empower hospitals,
            clinics, pharmacies, diagnostic centres, and specialist healthcare
            providers across Nigeria with digital healthcare innovation and
            nationwide patient reach.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION A */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION A: Facility Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Facility Name</label>

                <input
                  type="text"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Year Established</label>

                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Registration/Licensing Number
                </label>

                <input
                  type="text"
                  name="licensingNumber"
                  value={formData.licensingNumber}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Type of Facility</label>

                <select
                  name="facilityType"
                  value={formData.facilityType}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Hospital</option>
                  <option>Clinic</option>
                  <option>Diagnostic Centre</option>
                  <option>Pharmacy</option>
                  <option>Rehabilitation Centre</option>
                  <option>Wellness/Massage Centre</option>
                  <option>Medical Equipment Supplier</option>
                  <option>Biomedical Engineering Service</option>
                  <option>Home Care Service</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Ownership Type</label>

                <select
                  name="ownershipType"
                  value={formData.ownershipType}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>Private</option>
                  <option>Public/Government</option>
                  <option>NGO/Faith-Based</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Regulatory Body</label>

                <select
                  name="regulatoryBody"
                  value={formData.regulatoryBody}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option>MDCN</option>
                  <option>PCN</option>
                  <option>MLSCN</option>
                  <option>NMCN</option>
                  <option>NHIA</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION B: Location & Contact Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Physical Address</label>

                <textarea
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>LGA</label>

                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Landmark</label>

                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Phone Number(s)</label>

                  <input
                    type="text"
                    name="phoneNumbers"
                    value={formData.phoneNumbers}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Official Email Address</label>

                  <input
                    type="email"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Website / Social Media Links
                </label>

                <input
                  type="text"
                  name="websiteSocial"
                  value={formData.websiteSocial}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION C */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION C: Services Provided
            </h2>

            <div className="space-y-10">
              {renderCheckboxGroup(
                "General Clinical Services",
                "clinicalGeneral",
                [
                  "General Outpatient Care",
                  "Specialist Consultation",
                  "Emergency Services",
                  "Telemedicine",
                  "Home Care Services",
                ],
              )}

              {renderCheckboxGroup(
                "Specialist Services",
                "clinicalSpecialist",
                [
                  "Paediatrics",
                  "Obstetrics & Gynaecology",
                  "Surgery",
                  "Internal Medicine",
                  "Orthopaedics",
                  "Cardiology",
                  "Psychiatry",
                  "Ophthalmology",
                  "ENT",
                  "Dermatology",
                  "Dentistry",
                  "Physiotherapy",
                ],
              )}

              {renderCheckboxGroup("Laboratory Services", "diagnosticLab", [
                "Haematology",
                "Microbiology",
                "Clinical Chemistry",
                "Histopathology",
                "Molecular Diagnostics",
                "COVID-19 Testing",
              ])}

              {renderCheckboxGroup("Imaging Services", "diagnosticImaging", [
                "X-Ray",
                "Ultrasound",
                "CT Scan",
                "MRI",
                "ECG",
                "Echocardiography",
                "Mammography",
              ])}

              {renderCheckboxGroup(
                "Allied & Support Services",
                "alliedSupport",
                [
                  "Rehabilitation Services",
                  "Massage Therapy",
                  "Medical Equipment Supply",
                  "Ambulance Services",
                  "Biomedical Engineering Services",
                  "Occupational Health Services",
                  "Health Insurance Support",
                  "Wellness Services",
                ],
              )}
            </div>
          </div>

          {/* SECTION D */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION D: Service Availability
            </h2>

            <div className="space-y-8">
              {renderCheckboxGroup("Days of Operation", "operationDays", [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ])}

              <div>
                <label className={labelClass}>Operating Hours</label>

                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION E */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION E: Pricing & Payment
            </h2>

            <div className="space-y-8">
              {renderCheckboxGroup(
                "Accepted Payment Methods",
                "paymentMethods",
                [
                  "Cash",
                  "Bank Transfer",
                  "POS",
                  "Mobile Money",
                  "Insurance/HMO",
                  "Online Payment",
                ],
              )}

              <div>
                <label className={labelClass}>
                  Accepted HMOs / Insurance Providers
                </label>

                <textarea
                  name="acceptedHmos"
                  value={formData.acceptedHmos}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION F */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION F: Facility Capacity & Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className={labelClass}>Doctors</label>

                <input
                  type="number"
                  name="numDoctors"
                  value={formData.numDoctors}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Nurses</label>

                <input
                  type="number"
                  name="numNurses"
                  value={formData.numNurses}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Beds</label>

                <input
                  type="number"
                  name="numBeds"
                  value={formData.numBeds}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Lab Staff</label>

                <input
                  type="number"
                  name="numLabStaff"
                  value={formData.numLabStaff}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Other Staff</label>

                <input
                  type="number"
                  name="numOtherStaff"
                  value={formData.numOtherStaff}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION K */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              SECTION K: Specialized Services
            </h2>

            {renderCheckboxGroup(
              "Select Specialized Services",
              "specializedServices",
              [
                "Cardiology",
                "Endocrinology",
                "Gastroenterology",
                "Nephrology",
                "Pulmonology",
                "Neonatology",
                "IVF",
                "Psychiatry",
                "Oncology",
                "Stroke Management",
                "HIV/AIDS Care",
                "Laparoscopic Surgery",
                "Open Heart Surgery",
                "Brain Surgery",
                "Joint Replacement Surgery",
                "Kidney Stone Surgery",
                "Cosmetic Surgery",
                "Cataract Surgery",
                "MRI & CT Imaging",
                "Dialysis Services",
                "Robotic Surgery",
                "Stem Cell Therapy",
                "AI-Assisted Diagnostics",
                "Medical Tourism Coordination",
              ],
            )}
          </div>

          {/* DECLARATION */}
          <div className={sectionClass}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Declaration
            </h2>

            <p className="text-gray-700 mb-8">
              I hereby confirm that the information provided is accurate and up
              to date.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="declarationName"
                placeholder="Full Name"
                value={formData.declarationName}
                onChange={handleInputChange}
                className={inputClass}
              />

              <input
                type="text"
                name="declarationDesignation"
                placeholder="Designation"
                value={formData.declarationDesignation}
                onChange={handleInputChange}
                className={inputClass}
              />

              <input
                type="text"
                name="declarationSignature"
                placeholder="Signature"
                value={formData.declarationSignature}
                onChange={handleInputChange}
                className={inputClass}
              />

              <input
                type="date"
                name="declarationDate"
                value={formData.declarationDate}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>


          {/* SUBMIT */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl ${
                loading
                  ? "opacity-60 cursor-not-allowed scale-100 hover:scale-100"
                  : ""
              }`}
            >
              {loading ? "Registering Facility..." : "Register Facility →"}
            </button>
          </div>


        </form>
      </div>
    </section>
  );
};;;

export default Provider;
