import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // LOGIN USER
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const user = userCred.user;

      // FORCE REFRESH
      await user.reload();

      // EMAIL VERIFICATION CHECK
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        alert("Email not verified. A new verification email has been sent.");
        setLoading(false);
        return;
      }

      // GET USER DATA
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert("User data not found.");
        setLoading(false);
        return;
      }

      const userData = snap.data();

      // MARK VERIFIED (SAFE UPDATE)
      await updateDoc(userRef, {
        verified: true,
      });

      // STORE SESSION
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userName", userData.fullName || "");

      // ROLE ROUTING
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/doctors-page");
        }
      }, 200);
    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        alert("No user found.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid login credentials.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ecfdf5] via-white to-[#d1fae5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
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
              className="mt-8 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="mt-5 w-full h-14 px-4 rounded-2xl border outline-none focus:ring-2 focus:ring-[#2bb673]"
            />

            {/* BUTTON */}
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
