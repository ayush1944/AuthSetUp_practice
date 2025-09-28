import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Auth-Pages/Register";
import Login from "./Auth-Pages/Login";
import ForgotPassword from "./Auth-Pages/Forget-password";
import ResetPassword from "./Auth-Pages/ResetPassword";
import Footer from "./Components/Footer";
import VerifyOTP from "./Auth-Pages/Verify-OTP";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Success from "./Auth-Pages/Success";
import PublicRoute from "./Components/PublicRoute";

function App() {
  // const location = useLocation();

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center relative px-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}

export default App;
