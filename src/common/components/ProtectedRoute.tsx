import { useAuth } from "../context";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
