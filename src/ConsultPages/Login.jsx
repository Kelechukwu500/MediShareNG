import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = userCred.user;

      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        await signOut(auth);
        localStorage.clear();
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert(`User profile not found in database.`);
        await signOut(auth);
        localStorage.clear();
        setLoading(false);
        return;
      }

      const userData = snap.data();
      await updateDoc(userRef, { verified: true });

      // 1. Force state synchronization before running client navigation changes
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userRole", userData.role);

      /* ========================================================
         ROLE-BASED REDIRECT WITH STATE-WRITING PROTECTION ASYNC
      ======================================================== */
      setTimeout(() => {
        if (userData.role === "admin" || userData.role === "admin-doctor") {
          navigate("/admin-dashboard", { replace: true });
        } else if (userData.role === "doctor") {
          navigate("/doctor-dashboard", { replace: true });
        } else if (userData.role === "patient") {
          navigate("/patient-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 100); // 100ms macro-task delay ensures localStorage is accessible inside ProtectedRoute
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          alert("Invalid login credentials.");
          break;
        default:
          alert(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ecfdf5] via-white to-[#d1fae5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white">
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#065f46] via-[#047857] to-[#2bb673] p-14 text-white flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold uppercase">
                Secure Access Portal
              </span>
            </div>
            <h1 className="mt-10 text-5xl font-black leading-tight">
              Welcome Back{" "}
              <span className="block text-[#d1fae5]">MediShareNG</span>
            </h1>
            <p className="mt-6 text-white/90">
              Login to access medical dashboards and real-time consulting
              streams.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <h2 className="text-4xl font-black text-[#065f46]">Sign In</h2>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="mt-8 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-5 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-[#065f46] to-[#2bb673] text-white font-bold flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Login"}{" "}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
