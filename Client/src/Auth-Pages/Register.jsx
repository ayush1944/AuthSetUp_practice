import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  localStorage.setItem("email", form.email);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (form.age <= 0) {
      toast.error("Please enter a valid age!");
      return;
    }
    if (form.email === "") {
      toast.error("Please enter a valid email!");
      return;
    }
    if (form.name === "") {
      toast.error("Please enter your name!");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password should be at least 6 characters long!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/register", {
        name: form.name,
        age: form.age,
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      toast.success("Registration successful! Please verify your email.");
      navigate("/verify-otp");
      
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Registration failed: ${error.response.data.message}`);
      }
    }
  };



  return (
    <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white  focus:outline-none"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 text-gray-400 hover:text-white"
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

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
            {loading ? "Loading..." : "Register"}
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

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
