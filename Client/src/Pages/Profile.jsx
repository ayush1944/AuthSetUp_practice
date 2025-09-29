import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import React from "react";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/update-user", form, { withCredentials: true });
      setUser(res.data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/change-password", passwordForm);
      toast.success("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Please login to view profile.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        {/* View Mode */}
        {!isEditing ? (
          <div>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Name:</strong> {user.name || "Not set"}</p>
            <p className="mb-2"><strong>Age:</strong> {user.age || "Not set"}</p>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm">Email (read-only)</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-2 rounded bg-gray-200 mb-4"
            />

            <label className="block mb-2 text-sm">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block mb-2 text-sm">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Change Password Mode */}
        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Change Password</h3>

            <label className="block mb-2 text-sm">Old Password</label>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block mb-2 text-sm">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
