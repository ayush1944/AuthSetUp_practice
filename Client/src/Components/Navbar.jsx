import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import React from "react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="text-white bg-gray-900 p-4 flex justify-between items-center shadow-lg rounded-t-lg">
        {/* Left side: App name */}
        <Link to="/" className="text-2xl font-bold">
          MyApp
        </Link>

        {/* Right side: Nav actions */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="hover:text-green-400 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="hover:text-yellow-400 font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Divider line */}
      <span className="bg-slate-500 h-[1px] w-full block"></span>
    </>
  );
}
