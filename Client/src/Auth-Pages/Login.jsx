import axios from "../api/axios.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(form.email === "" || form.password === "") {
      setLoading(false);
      return;
    }
    if(form.password.length < 6) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('/login', form);
      navigate("/");
      console.log("Login successful", response.data);
    } catch (error) {
      console.error("Login failed", error);
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
              {showPassword ? "👁️" : "🙈"}
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
