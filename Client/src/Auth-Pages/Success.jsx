// src/pages/Success.js
import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Check Your Email</h2>
        <p className="text-gray-300 mb-6">
          If an account with that email exists, a password reset link has been sent.
          Please check your inbox or spam folder.
        </p>

        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Open Gmail
        </a>

        <Link
          to="/login"
          className="block mt-4 text-blue-400 hover:underline text-sm"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
