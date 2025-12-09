import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Spinner from "./Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />; 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
}
