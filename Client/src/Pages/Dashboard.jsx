// import axios from "../api/axios.js";
import { useAuth } from "../Context/useAuth";
import React from "react";
// import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  // const [loading, setLoading] = useState(false);

  // const handleLogout = async () => {
  //   setLoading(true);
  //   await axios.post("/logout")
  //   toast.success("Logged out successfully!", { duration: 4000 });
  //   setTimeout(() => {
  //     window.location.replace("/");
  //   }, 2000);
  //   setLoading(false);
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("email");
  //   localStorage.removeItem("pendingEmail");
  // }

  return (
    <div className="absolute inset-0 flex flex-col   bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header
      <header className="text-white bg-gray-900 p-4 flex justify-between items-center shadow-lg rounded-t-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          { loading ? "Logging out..." : "Logout" }
        </button>
      </header>
        <span className="bg-slate-500 h-[1px] w-full"></span> */}

      {/* Main Content */}
      <main className="flex-grow flex flex-col text-white items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">
          Hello, {user?.name || user?.email} 👋
        </h2>
        <p className="mt-2 text-gray-300">
          Welcome to your personal dashboard. Here you’ll manage your account and settings.
        </p>
      </main>
    </div>
  );
}
