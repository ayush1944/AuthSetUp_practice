import { Link } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import React from "react";

export default function Home() {
  
  const { user } = useAuth();

  return (
      <div className="absolute inset-0 flex items-center justify-center  bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Welcome to <span className="text-blue-600">My App</span>
        </h1>
        <p className="mt-4 text-gray-400  text-lg max-w-lg">
          {user
            ? `Welcome back, ${user.name || user.email}!`
            : "Sign up or log in to explore all features."}
        </p>

        {/* Actions */}
        {user ? (
          <Link
            to="/dashboard"
            className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="mt-6 flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition"
            >
              Register
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
