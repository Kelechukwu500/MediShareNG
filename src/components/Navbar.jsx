import React, { useState } from "react";
import medilogo3 from "../assets/medilogo3.jpg";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* MAIN NAV */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center text-teal-600">
            <span className="sr-only">Home</span>
            <img src={medilogo3} alt="Logo" className="h-28 w-25" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm text-gray-600">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/history">History</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/admin-dashboard">Admin Dashboard</Link>
              </li>
              <li>
                <Link to="/ai-symptoms-checker">AI Checker</Link>
              </li>
            </ul>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* USER INFO + AUTH BUTTONS */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>

                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
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
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden rounded-md bg-gray-100 p-2 text-gray-600"
            >
              ☰
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
              <Link to="/ai-symptoms-checker">AI Checker</Link>

              <hr className="my-2" />

              {user ? (
                <>
                  <span className="text-sm text-gray-500">
                    Logged in as: {user.email}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 mt-3">
                  <Link
                    to="/login"
                    className="bg-green-700 text-white px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-gray-100 px-3 py-2 rounded-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
