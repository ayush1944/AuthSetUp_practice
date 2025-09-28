import axios from "../api/axios.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post("/forgot-password", { email });
    setLoading(false);
    Navigate('/success')
    console.log("Forgot password requested for:", email);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition ${loading ? "cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
