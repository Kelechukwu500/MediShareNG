import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../firebase";

import { doc, getDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({});

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      /* CHECK EMAIL VERIFICATION */
      if (!userCred.user.emailVerified) {
        alert("Please verify your email first");
        return;
      }

      /* GET USER ROLE */
      const userRef = doc(db, "users", userCred.user.uid);

      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const userData = snap.data();

        /* ADMIN */
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "doctor") {

        /* DOCTOR */
          navigate("/doctor-dashboard");
        } else {

        /* NORMAL USERS */
          navigate("/doctors-page");
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#065f46]">Login</h2>

        {/* EMAIL */}
        <input
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        <button className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition-all">
          Login
        </button>

        {/* OPTIONAL NAV LINK */}
        <p className="text-center text-sm text-gray-600 mt-3">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
