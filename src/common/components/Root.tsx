import { useAuth } from "../context";
import Login from "@/modules/auth/components/LoginForm";
import { RedirectByRole } from "@common/components";

function Root() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <RedirectByRole />;
}

export default Root;
