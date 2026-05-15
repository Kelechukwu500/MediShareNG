import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* IMAGES */
import blog1 from "../assets/blog1.jpg";
import blog2 from "../assets/blog2.jpg";
import blog3 from "../assets/blog3.jpg";
import blog4 from "../assets/blog4.jpg";
import blog5 from "../assets/blog5.jpg";
import blog6 from "../assets/blog6.jpg";

const Blog = () => {
  const blogs = [
    {
      title: "Technology",
      image: blog1,
      badge: "Trending",
      text: "Technology is transforming healthcare through AI diagnostics, telemedicine, and digital health systems that improve speed, accuracy, and accessibility for patients across all regions.",
      route: "/blog/technology",
    },
    {
      title: "Wellness",
      image: blog2,
      badge: "Lifestyle",
      text: "Wellness focuses on maintaining a balanced life through mental health care, physical fitness, stress management, and preventive healthcare practices that improve overall quality of life.",
      route: "/blog/wellness",
    },
    {
      title: "Nutrition",
      image: blog3,
      badge: "Healthy Living",
      text: "Good nutrition plays a vital role in preventing diseases and strengthening the body. A balanced diet supports immunity, energy levels, and long-term health stability.",
      route: "/blog/nutrition",
    },
    {
      title: "Healthcare",
      image: blog4,
      badge: "Essential",
      text: "Modern healthcare systems are evolving to provide faster, more efficient, and patient-centered care through digital platforms, improved facilities, and better service delivery.",
      route: "/blog/healthcare",
    },
    {
      title: "Surgery",
      image: blog5,
      badge: "Medical",
      text: "Surgical advancements have improved precision and safety, allowing doctors to perform complex procedures with minimal risk and faster recovery times for patients.",
      route: "/blog/surgery",
    },
    {
      title: "Gadgets",
      image: blog6,
      badge: "Innovation",
      text: "Medical gadgets such as smart monitors, wearable trackers, and diagnostic tools are reshaping how patients monitor health and how doctors deliver care remotely.",
      route: "/blog/gadgets",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#f8fffc] via-white to-[#eefaf4] py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#065f46] leading-tight">
            MediShareNG Blog
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed px-2">
            Insights on healthcare, technology, wellness, and innovation shaping
            the future of modern medical services.
          </p>
        </motion.div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#e8f3ee] flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative w-full h-52 sm:h-56 md:h-60 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

                {/* BADGE */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#065f46] text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
                >
                  {blog.badge}
                </motion.div>
              </div>

              {/* CONTENT */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#065f46] mb-3">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed flex-1">
                  {blog.text}
                </p>

                {/* WORKING BUTTON */}
                <Link to={blog.route} className="mt-6">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#065f46] hover:bg-[#044c39] active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-xl">
                    Read More
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
