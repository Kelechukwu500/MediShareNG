import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* ICONS */
import { FaUserMd, FaUserTie, FaMoneyBillWave } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";

/* IMAGES */
import chairman from "../assets/chairman.jpg";
import chairwoman from "../assets/chairwoman.jpg";
import finance from "../assets/finance.jpg";
import hospitalBg from "../assets/hospital1.jpg";

const MeetOurBoard = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const board = [
    {
      name: "Dr. Ezema, Godian Chibueze",
      title: "Managing Director",
      qualifications: "(MBBS, PGD (psy), PDIPC, MPH (Int'l), FWACP)",
      icon: <FaUserMd className="text-xl" />,
      badge: "MD",
      image: chairman,
      description: `
Godian Chibueze Ezema is a distinguished Public/Community Health Physician, health systems expert, and development professional with over two decades of experience spanning clinical medicine, public health programming, healthcare management, infection prevention and control (IPC), and community health systems strengthening across Nigeria and international settings.

Currently, he is a Deputy Director with the Nigerian Ministry of Defence and is widely recognized for his leadership in public health program implementation, healthcare workforce development, and infectious disease management. Dr. Ezema has worked extensively in HIV/AIDS, tuberculosis, COVID-19 response, Lassa fever management, community mental health, and healthcare quality improvement initiatives.

A Fellow of the West African College of Physicians (FWACP) in Community Health, Dr. Ezema also holds a Master of Public Health (MPH International) from the University of Leeds, where he received the prestigious Ruth Griffith Prize. He further earned a Professional Diploma in Infection Prevention and Control from the University of Lagos and a Postgraduate Diploma in Psychology with distinction from the University of Nigeria.

Throughout his career, he has led and supported major public health interventions in collaboration with organizations such as the Nigeria Centre for Disease Control, United States Centers for Disease Control and Prevention, PEPFAR, and other national and international partners.

He is an accomplished trainer, mentor, and researcher with multiple peer-reviewed publications in infectious diseases, HIV care, mental health, and health systems strengthening.

As Managing Director of MediShareNG, Dr. Ezema brings a unique blend of medical expertise, public health leadership, operational management, and digital health innovation to drive healthcare transformation.
      `,
    },

    {
      name: "Mrs. Ngozi Ezema",
      title: "Executive Director",
      qualifications: "",
      icon: <FaUserTie className="text-xl" />,
      badge: "ED",
      image: chairwoman,
      description: `
Ngozi Ezema is a seasoned public health and development leader with over 20 years of progressive experience in program management, strategic operations, and health systems strengthening across Nigeria.

She has directed multimillion-dollar donor investments, overseen large-scale program portfolios, and advanced health outcomes for millions through innovative, evidence-based interventions.

Her professional career began with FHI 360, where she played pivotal roles in landmark HIV/AIDS programs including GHAIN and SIDHAS, and pioneered Nigeria’s first public-private partnership ART program under the NiDAR project—a model that redefined decentralized HIV care delivery.

She later served as Zonal Program Manager for Southeast Nigeria and State Program Manager for Anambra State, leading the expansion of HIV prevention, care, and treatment services across hundreds of health facilities during Nigeria’s most ambitious scale-up phase.

Currently, as Director of Program Management at FHI 360 Nigeria, she provides strategic oversight across multiple national portfolios, guiding technical assistance to government and private sector partners.

Ngozi Ezema holds a master’s degree in development studies from the University of Nigeria and is a Fellow of the Institute of Management Consultants (FIMC). She is a Certified Management Consultant (CMC) under the International Council of Management Consulting Institutes (ICMCI), and a Certified Project and Risk Management Expert accredited by the Project Management Institute (PMI).

Beyond her professional achievements, she is deeply family-oriented. She is a devoted wife, mother, mother-in-love, and grandmother. These roles ground her leadership in empathy, resilience, and inclusivity, inspiring her commitment to mentoring and nurturing teams.
      `,
    },

    {
      name: "Eyimoga Akwuludo James",
      title: "Chief Financial Officer",
      icon: <FaMoneyBillWave className="text-xl" />,
      badge: "CFO",
      image: finance,
      description: `
A highly experienced finance executive with strong expertise in healthcare financial systems, donor fund management, budgeting, compliance, and organizational sustainability.

He has over 15 years of experience in financial planning, risk management, and strategic investment oversight across healthcare and development sectors.

As CFO of MediShareNG, he ensures financial discipline, transparency, and long-term sustainability while supporting scalable healthcare innovation and operational excellence.
      `,
    },
  ];

  return (
    <section
      className="relative w-full min-h-screen py-24 px-4 sm:px-6 lg:px-20 text-white"
      style={{
        backgroundImage: `url(${hospitalBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-green-400 flex items-center justify-center gap-2">
            <HiOutlineBadgeCheck />
            Meet Our Leadership Board
          </h2>
          <p className="text-gray-300 mt-3 text-sm sm:text-base">
            Driving innovation, governance, and excellence in healthcare
            delivery
          </p>
        </div>

        {/* CARDS */}
        <div ref={ref} className="space-y-16">
          {board.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col lg:flex-row gap-10 items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* BADGE */}
              <div className="absolute -top-4 left-6 bg-green-500 text-white px-4 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
                {member.icon}
                {member.badge}
              </div>

              {/* IMAGE */}
              <div className="w-full lg:w-1/3">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[340px] object-cover rounded-2xl shadow-xl"
                />
              </div>

              {/* TEXT */}
              <div className="w-full lg:w-2/3">
                <h3 className="text-2xl sm:text-3xl font-bold text-green-300">
                  {member.name}
                </h3>

                {member.qualifications && (
                  <p className="text-gray-300 mt-1 text-sm font-medium">
                    {member.qualifications}
                  </p>
                )}

                <p className="text-gray-200 mt-5 text-sm leading-relaxed whitespace-pre-line">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurBoard;
