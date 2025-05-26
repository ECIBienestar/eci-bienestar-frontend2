import { useEffect } from "react";
import { useAuth } from "@common/context";
import { useNavigate } from "react-router-dom";
import { Role } from "@common/types";

function RedirectByRole() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    if (
      user.role === Role.MEDICAL_STAFF ||
      user.role === Role.MEDICAL_SECRETARY
    ) {
      navigate("/modules/health", { replace: true });
      return;
    }

    navigate("/home", { replace: true });
  }, [user, navigate]);

  return null;
}

export default RedirectByRole;
