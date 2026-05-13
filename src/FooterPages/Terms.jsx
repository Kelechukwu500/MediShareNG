import React from "react";
import { motion } from "framer-motion";
import hospital2 from "../assets/hospital2.jpg";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";

const Terms = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center py-24 px-4 sm:px-6 lg:px-10"
      style={{ backgroundImage: `url(${hospital2})` }}
    >
      <div className="bg-black/70 min-h-screen absolute inset-0"></div>

      <div className="relative max-w-6xl mx-auto text-white">
        <h1 className="text-center text-4xl font-black">Terms & Conditions</h1>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FileText />,
              title: "Service Usage",
              text: "Users must use MediShare.NG responsibly and legally.",
            },
            {
              icon: <AlertCircle />,
              title: "Restrictions",
              text: "No misuse of medical services or fake bookings allowed.",
            },
            {
              icon: <CheckCircle />,
              title: "Acceptance",
              text: "By using the platform, you agree to our terms.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 relative"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-4 right-4 text-[#2bb673]"
              >
                {item.icon}
              </motion.div>

              <h2 className="text-xl font-bold">{item.title}</h2>

              <p className="mt-3 text-gray-200">
                <span className="border-l-4 border-[#2bb673] pl-2">
                  {item.text}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Terms;
