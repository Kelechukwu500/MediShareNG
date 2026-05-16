import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { auth, db } from "../firebase";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { ShieldCheck, MailCheck, UserPlus, ArrowRight } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      return alert("Please fill all fields.");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      // CREATE USER
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      // SEND VERIFICATION EMAIL
      await sendEmailVerification(userCred.user, {
        url: `${window.location.origin}/login`,
      });

      // SAVE USER TO FIRESTORE
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        fullName: form.fullName,
        email: form.email,
        role: "patient",
        verified: false,
        createdAt: serverTimestamp(),
        status: "Active",
      });

      alert(
        "Account created successfully. Please verify your email before login.",
      );

      // REDIRECT TO LOGIN
      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email already exists.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak.");
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
          {/* BLUR EFFECTS */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-md">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Secure Healthcare Access
              </span>
            </div>

            <h1 className="mt-10 text-5xl font-black leading-tight">
              Join
              <span className="block text-[#d1fae5]">MediShareNG</span>
            </h1>

            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              Create your healthcare account, verify your email securely,
              connect with doctors, and begin online consultations from
              anywhere.
            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <MailCheck size={22} />
                <span>Email Verification Security</span>
              </div>

              <div className="flex items-center gap-4">
                <UserPlus size={22} />
                <span>Book Consultations Easily</span>
              </div>

              <div className="flex items-center gap-4">
                <ShieldCheck size={22} />
                <span>Protected Patient Records</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-white/80">
            Trusted digital healthcare platform for modern medical consultation.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <form onSubmit={handleSignup} className="w-full max-w-md">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-black text-[#065f46]">
                Create Account
              </h2>

              <p className="mt-3 text-gray-600 leading-relaxed">
                Start your healthcare consultation journey with MediShareNG.
              </p>
            </div>

            {/* FULL NAME */}
            <div className="mt-10">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="mt-2 w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#2bb673]"
              />
            </div>

            {/* EMAIL */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="mt-2 w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#2bb673]"
              />
            </div>

            {/* PASSWORD */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="mt-2 w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#2bb673]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-[#065f46] to-[#2bb673] text-white font-bold text-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight size={20} />}
            </button>

            {/* LOGIN */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#2bb673] font-bold cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>

            {/* EMAIL VERIFICATION NOTICE */}
            <div className="mt-8 bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <MailCheck size={22} className="text-[#065f46] mt-1" />

                <div>
                  <h3 className="font-bold text-[#065f46]">
                    Email Verification Required
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    After signup, a verification link will be sent to your
                    email. You must verify your account before logging in and
                    starting consultation sessions.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
