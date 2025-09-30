import React from "react";
import { useAuth } from "../Context/useAuth";
// import axios from "../api/axios.js";
// import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Main Content */}
      <main className="flex flex-grow flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">
          Hello, {user?.name || user?.email} 👋
        </h2>
        <p className="mb-8 max-w-xl text-gray-300">
          Welcome to your personal dashboard. Here you can manage your account, update
          settings, and explore new features.
        </p>

        {/* Example Stats */}
        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-800 p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Account Status</h3>
            <p className="mt-2 text-gray-400">
              {user?.emailVerified ? "✅ Verified" : "❌ Not Verified"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-800 p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Provider</h3>
            <p className="mt-2 text-gray-400">
              {user?.provider || "credentials"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-800 p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Joined</h3>
            <p className="mt-2 text-gray-400">
              {new Date(user?.createdAt).toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
