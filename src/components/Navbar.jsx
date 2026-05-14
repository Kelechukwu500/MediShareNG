import React, { useState } from "react";
import navlogo from "../assets/navlogo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* MAIN NAV */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center text-teal-600">
            <span className="sr-only">Home</span>
            <img src={navlogo} alt="Logo" className="h-15 w-15" />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm text-gray-600">
              <li>
                <Link className="hover:text-gray-900 transition" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="hover:text-gray-900 transition" to="/services">
                  Services
                </Link>
              </li>

              <li>
                <Link className="hover:text-gray-900 transition" to="/history">
                  History
                </Link>
              </li>

              <li>
                <Link className="hover:text-gray-900 transition" to="/contact">
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  className="hover:text-gray-900 transition"
                  to="/admin-dashboard"
                >
                  Admin Dashboard
                </Link>
              </li>

              {/* 🔍 SEARCH ICON */}
              <li>
                <Link
                  to="/search"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>



          {/* Buttons + Mobile Icon */}
          <div className="flex items-center gap-3">
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login"
                className="rounded-md bg-green-700 px-4 py-2 text-sm text-white hover:bg-teal-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-md bg-gray-100 px-4 py-2 text-sm text-teal-600 hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden rounded-md bg-gray-100 p-2 text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3 text-gray-600 text-sm mt-3">
              <Link to="/">Home</Link>
              <Link to="/services">Services</Link>
              <Link to="/history">History</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
              

              <div className="flex gap-3 mt-3">
                <Link
                  to="#"
                  className="bg-teal-600 text-white px-3 py-2 rounded-md"
                >
                  Login
                </Link>

                <Link
                  to="#"
                  className="bg-gray-100 px-3 py-2 rounded-md"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
