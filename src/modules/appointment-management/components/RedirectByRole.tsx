import { useEffect, useState } from "react";
import { useAuth } from "@common/context";
import { useNavigate } from "react-router-dom";
import { Role } from "@common/types";
import MainView from "@modules/appointment-management/pages/MainView";
import { ShowLoading } from "@modules/appointment-management/components/common";

function RedirectByRole() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (
      user?.role !== Role.ADMINISTRATOR &&
      user?.role !== Role.MEDICAL_STAFF &&
      user?.role !== Role.MEDICAL_SECRETARY
    ) {
      navigate("/modules/health/request-shifts", { replace: true });
      return;
    }

    setChecked(true);
  }, [user, navigate]);

  if (!checked) {
    return <ShowLoading />;
  }

  return <MainView />;
}

export default RedirectByRole;
