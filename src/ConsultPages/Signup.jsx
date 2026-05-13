import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { auth, db } from "../firebase";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      /* SEND EMAIL VERIFICATION */
      await sendEmailVerification(userCred.user);

      /* SAVE USER TO FIRESTORE */
      await setDoc(doc(db, "users", userCred.user.uid), {
        fullName: form.fullName || "",
        email: form.email,
        role: "user",
        createdAt: serverTimestamp(),
        status: "Active",
      });

      alert("Verification email sent!");

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-gray-200">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-4"
      >
        {/* HEADING */}
        <h2 className="text-2xl font-bold text-center text-[#065f46]">
          Join MediShareNG
        </h2>

        {/* FULL NAME */}
        <input
          name="fullName"
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* BUTTON */}
        <button className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition-all">
          Create Account
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
