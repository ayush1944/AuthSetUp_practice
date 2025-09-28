import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
