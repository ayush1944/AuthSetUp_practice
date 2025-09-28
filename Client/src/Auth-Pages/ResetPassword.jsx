import axios from "..//api/axios.js";
import React, { useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  if (!token || !email) return <Navigate to="/forgot-password" replace />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    await axios.post("/reset-password", form);
    setLoading(false);
    console.log("Resetting password:", form.password);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              value={form.password}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-gray-400 hover:text-white"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={form.confirmPassword}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 text-gray-400 hover:text-white"
            >
              {showConfirm ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
