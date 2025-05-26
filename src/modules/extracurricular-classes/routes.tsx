import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// Dashboard
import DashboardExtraClasses from "./pages/common/dashboardExtraClasses";
// Páginas de estudiante
import EnrolledClassesPage from "./pages/student/enrolledClassesPage";
import AvailableClassesPage from "./pages/student/availableClassesPage";
import AttendanceHistoryPage from "./pages/student/attendanceHistoryPage";
// Páginas de docente
import ScheduledClassesPage from "./pages/teacher/scheduledClassesPage";
import AttendanceRegisterPage from "./pages/teacher/attendanceRegisterPage";
// Páginas personal de bienestar y admin
import StatisticsPage from "./pages/common/statisticsPage";
import ClassManagementPage from "./pages/common/classManagementPage";
import NotificationManagementPage from "./pages/admin/notificationManagementPage";
import { useAuth } from "@/common/context";

interface AppRoutesProps {
  userRole: "student" | "teacher" | "wellnessStaff" | "admin";
}

const ExtracurricularClassesRoutes: React.FC<AppRoutesProps> = ({
  userRole,
}) => {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Ruta principal - Dashboard específico por rol */}
      <Route index element={<DashboardExtraClasses userRole={userRole} />} />

      {/* Rutas de estudiante */}
      {userRole === "student" && (
        <>
          <Route
            path="estudiante"
            element={<Navigate to="/modules/extracurricular" replace />}
          />
          <Route
            path="estudiante/clases-inscritas"
            element={<EnrolledClassesPage />}
          />
          <Route
            path="estudiante/clases-disponibles"
            element={<AvailableClassesPage userId={user!.id} />}
          />
          <Route
            path="estudiante/historial-asistencia"
            element={<AttendanceHistoryPage />}
          />

          <Route path="clases-inscritas" element={<EnrolledClassesPage />} />
          <Route
            path="clases-disponibles"
            element={<AvailableClassesPage userId={user!.id} />}
          />
          <Route
            path="historial-asistencia"
            element={<AttendanceHistoryPage />}
          />
        </>
      )}

      {/* Rutas de profesor */}
      {userRole === "teacher" && (
        <>
          <Route
            path="profesor"
            element={<Navigate to="/modules/extracurricular" replace />}
          />
          <Route
            path="profesor/clases-programadas"
            element={<ScheduledClassesPage />}
          />
          <Route
            path="profesor/registro-de-asistencia"
            element={<AttendanceRegisterPage />}
          />

          <Route path="clases-programadas" element={<ScheduledClassesPage />} />
          <Route
            path="registro-de-asistencia"
            element={<AttendanceRegisterPage />}
          />
        </>
      )}

      {/* Rutas compartidas para wellnessStaff y admin */}
      {(userRole === "wellnessStaff" || userRole === "admin") && (
        <>
          {/* Redirige bienestar al dashboard principal */}
          <Route
            path="bienestar"
            element={<Navigate to="/modules/extracurricular" replace />}
          />

          {/* Rutas comunes */}
          <Route path="bienestar/estadisticas" element={<StatisticsPage />} />
          <Route
            path="bienestar/gestion-de-clases"
            element={<ClassManagementPage />}
          />

          {/* Rutas directas sin prefijo */}
          <Route path="estadisticas" element={<StatisticsPage />} />
          <Route path="gestion-de-clases" element={<ClassManagementPage />} />

          {/* Solo admin tiene acceso a notificaciones */}
          {userRole === "admin" && (
            <>
              <Route
                path="bienestar/gestion-de-notificaciones"
                element={<NotificationManagementPage />}
              />
              <Route
                path="gestion-de-notificaciones"
                element={<NotificationManagementPage />}
              />
            </>
          )}
        </>
      )}

      {/* Ruta de fallback - regresa al dashboard */}
      <Route
        path="*"
        element={<Navigate to="/modules/extracurricular" replace />}
      />
    </Routes>
  );
};

export default ExtracurricularClassesRoutes;
