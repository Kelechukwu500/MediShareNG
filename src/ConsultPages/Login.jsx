import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut, // 🔥 ADDED: Imported signOut to safely terminate unverified sessions
} from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  MailCheck,
  LogIn,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* =========================
     HANDLE INPUT CHANGE
  ========================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     HANDLE LOGIN
  ========================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      /* =========================
         FIREBASE AUTH LOGIN
      ========================== */
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const user = userCred.user;

      console.log("AUTH UID:", user.uid);

      /* =========================
         EMAIL VERIFICATION CHECK (FIXED)
      ========================== */
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");

        // 🔥 FIXED: Forcefully sign out from Firebase Auth to terminate the active session token
        await signOut(auth);

        // Clear localStorage cache to prevent old local dashboard data bleed
        localStorage.clear();

        setLoading(false);
        return;
      }

      /* =========================
         GET USER PROFILE
      ========================== */
      const userRef = doc(db, "users", user.uid);

      const snap = await getDoc(userRef);

      console.log("FIRESTORE PROFILE EXISTS:", snap.exists());

      if (!snap.exists()) {
        alert(
          `User profile not found.\n\nCreate this document in Firestore:\nusers/${user.uid}`,
        );

        // Force logout if Auth exists but Firestore record is completely missing
        await signOut(auth);
        localStorage.clear();

        setLoading(false);
        return;
      }

      const userData = snap.data();

      console.log("USER ROLE:", userData.role);

      /* =========================
         OPTIONAL VERIFIED FLAG
      ========================== */
      await updateDoc(userRef, {
        verified: true,
      });

      /* =========================
         SAVE USER SESSION
      ========================== */
      localStorage.setItem("userId", user.uid);

      localStorage.setItem("userRole", userData.role);

      /* =========================
         ROLE-BASED REDIRECT
      ========================== */
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (userData.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found.");
          break;

        case "auth/wrong-password":
          alert("Incorrect password.");
          break;

        case "auth/invalid-email":
          alert("Invalid email.");
          break;

        case "auth/invalid-credential":
          alert("Invalid login credentials.");
          break;

        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ecfdf5] via-white to-[#d1fae5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white">
        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#065f46] via-[#047857] to-[#2bb673] p-14 text-white flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full">
              <ShieldCheck size={18} />

              <span className="text-sm font-semibold uppercase">
                Secure Login
              </span>
            </div>

            <h1 className="mt-10 text-5xl font-black leading-tight">
              Welcome Back
              <span className="block text-[#d1fae5]">MediShareNG</span>
            </h1>

            <p className="mt-6 text-white/90">
              Login to access consultations, doctors, and video sessions.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <MailCheck size={22} />

                <span>Verified Email Login</span>
              </div>

              <div className="flex items-center gap-4">
                <LockKeyhole size={22} />

                <span>Secure Access</span>
              </div>

              <div className="flex items-center gap-4">
                <LogIn size={22} />

                <span>Continue Flow</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <h2 className="text-4xl font-black text-[#065f46]">Login</h2>

            <p className="mt-2 text-gray-600">Access your dashboard</p>

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-8 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-5 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-[#065f46] to-[#2bb673] text-white font-bold flex items-center justify-center gap-3"
            >
              {loading ? "Logging in..." : "Login"}

              {!loading && <ArrowRight size={20} />}
            </button>

            {/* SIGNUP */}
            <p className="mt-6 text-center text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#2bb673] font-bold cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
