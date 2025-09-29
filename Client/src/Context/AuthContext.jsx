import axios from "../api/axios.js";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import React from "react";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);


  const login = async (email, password) => {
    const res = await axios.post("/login", { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post("/logout");
    toast.success("Logged out successfully!", { duration: 4000 });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
