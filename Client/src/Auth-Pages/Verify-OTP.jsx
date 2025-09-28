import axios from "../api/axios.js";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [form, setForm] = useState({ email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const storedEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post("/verify-otp", {
      email: form.email || storedEmail,
      otp: form.otp,
    });
    navigate("/dashboard");
    setLoading(false);
  };

  const handleResendOTP = async () => {
    try {
      await axios.post("/resend-otp", { email: storedEmail || form.email });
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };


if (!localStorage.getItem("pendingEmail")) {
  return <Navigate to="/register" replace />;
}

  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <p className="text-gray-400 text-sm text-center mb-4">
          Please enter the OTP sent to your email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={storedEmail || form.email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none opacity-70 cursor-not-allowed text-center"
          />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
            value={form.otp}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none tracking-widest text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition 
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Loading..." : "Verify"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Didn’t receive OTP?{" "}
          <button onClick={handleResendOTP} className="text-blue-400 hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
