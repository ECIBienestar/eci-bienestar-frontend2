import { Route, Routes } from "react-router-dom";
import { DoctorView } from "@modules/appointment-management/pages";
import ShiftsPrincipal from "../features/ShiftsPrincipal/ShiftsPrincipal";
import FormShift from "../features/formshift/formshift";
import GestionShifts from "../features/gestionShifts/gestionShifts";
import Stadistics from "../features/Stadistics/Stadistics";
import {
  ProtectedRoute,
  RedirectByRole,
} from "@modules/appointment-management/components";
import { Role } from "@/common/types";

function HealthRoutes() {
  return (
    <Routes>
      <Route index element={<RedirectByRole />} />
      <Route path="/request-shifts" element={<FormShift />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute
            allowedRoles={[Role.ADMINISTRATOR, Role.MEDICAL_SECRETARY]}
          >
            <ShiftsPrincipal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-shifts"
        element={
          <ProtectedRoute
            allowedRoles={[Role.ADMINISTRATOR, Role.MEDICAL_SECRETARY]}
          >
            <GestionShifts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/statistics"
        element={
          <ProtectedRoute
            allowedRoles={[
              Role.MEDICAL_SECRETARY,
              Role.MEDICAL_STAFF,
              Role.ADMINISTRATOR,
            ]}
          >
            <Stadistics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/call-turns"
        element={
          <ProtectedRoute allowedRoles={[Role.MEDICAL_STAFF]}>
            <DoctorView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default HealthRoutes;
