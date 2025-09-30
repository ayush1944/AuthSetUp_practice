import axios from "../api/axios.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (form.email === "" || form.password === "") {
      toast.error("Email and Password are required.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/login", form);
      toast.success("Login successful!", { duration: 4000 });
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
    } catch (error) {
      console.log("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Login failed: ${error.response.data.message}`, {
          duration: 4000,
        });
      } else {
        toast.error("Login failed. Please try again.", { duration: 4000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          {/* Password with Eye Button */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${
              loading ? "cursor-not-allowed" : ""
            } font-semibold py-3 rounded-lg transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`}
            className="flex items-center justify-center gap-3 w-full max-w-sm h-12 rounded-md bg-[#4285F4] hover:bg-[#357ae8] transition-colors duration-200 text-white font-medium shadow-md"
          >
            {/* Google "G" */}
            <span className="bg-white p-1 rounded-sm">
              <FcGoogle className="text-2xl" />
            </span>

            {/* Button text */}
            <span className="text-base">
              Continue with <strong>Google</strong>
            </span>
          </a>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-blue-400 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
