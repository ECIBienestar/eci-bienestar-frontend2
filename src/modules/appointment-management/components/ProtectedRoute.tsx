import { useAuth } from "@/common/context";
import { Role } from "@/common/types";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  readonly children: ReactElement;
  readonly allowedRoles: Role[];
};

function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/modules/health" replace />;
  }

  return children;
}

export default ProtectedRoute;
