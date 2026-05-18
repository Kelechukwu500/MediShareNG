import React, { useState } from "react";
import medilogo3 from "../assets/medilogo3.jpg";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // DYNAMIC ROLE-BASED DASHBOARD LINK GENERATOR
  const cachedRole = localStorage.getItem("userRole");

  const getDashboardPath = () => {
    if (cachedRole === "admin-doctor" || cachedRole === "admin") {
      return "/admin-dashboard";
    }
    if (cachedRole === "doctor") {
      return "/doctor-dashboard";
    }
    return "/patient-dashboard";
  };

  const getDashboardLabel = () => {
    if (cachedRole === "admin-doctor") return "Admin-Doctor Hub";
    if (cachedRole === "admin") return "Admin Dashboard";
    if (cachedRole === "doctor") return "Doctor Dashboard";
    return "Patient Dashboard";
  };

  // IRONCLAD TIMEOUT-CLEARING LOGOUT TASK
  const handleLogout = async () => {
    setOpen(false); // Close mobile menus instantly

    try {
      localStorage.clear();
      sessionStorage.clear();

      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);

      console.log("🔒 Session destroyed safely.");
      navigate("/login", { replace: true });
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Logout sequence encountered a fatal interruption:",
        error.message,
      );
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
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
            <ul className="flex items-center gap-5 text-sm text-gray-600">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>

              {/* 🔓 UNLOCKED HEALTH SERVICE PIPELINES */}
              <li className="font-medium text-emerald-600 hover:text-emerald-700">
                <Link to="/e-laboratory">E-Laboratory</Link>
              </li>
              <li className="font-medium text-emerald-600 hover:text-emerald-700">
                <Link to="/e-pharmacy">E-Pharmacy</Link>
              </li>

              <li>
                <Link to="/history">History</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>

              {/* FIXED DYNAMIC DASHBOARD LINKS */}
              {user && (
                <li>
                  <Link
                    to={getDashboardPath()}
                    className="text-emerald-700 font-bold"
                  >
                    {getDashboardLabel()}
                  </Link>
                </li>
              )}

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
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/services" onClick={() => setOpen(false)}>
                Services
              </Link>

              {/* 🔓 UNLOCKED HEALTH SERVICE PIPELINES - MOBILE */}
              <Link
                to="/e-laboratory"
                onClick={() => setOpen(false)}
                className="text-emerald-600 font-medium"
              >
                E-Laboratory
              </Link>
              <Link
                to="/e-pharmacy"
                onClick={() => setOpen(false)}
                className="text-emerald-600 font-medium"
              >
                E-Pharmacy
              </Link>

              <Link to="/history" onClick={() => setOpen(false)}>
                History
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>

              {/* FIXED MOBILE DYNAMIC LINK */}
              {user && (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setOpen(false)}
                  className="text-emerald-700 font-bold"
                >
                  {getDashboardLabel()}
                </Link>
              )}

              <Link to="/ai-symptoms-checker" onClick={() => setOpen(false)}>
                AI Checker
              </Link>

              <hr className="my-2" />

              {user ? (
                <>
                  <span className="text-sm text-gray-500">
                    Logged in as: {user.email}
                  </span>

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded-md mt-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 mt-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="bg-green-700 text-white px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
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
