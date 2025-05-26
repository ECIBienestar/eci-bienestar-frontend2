import { Routes, Route } from "react-router-dom";
import GymRedirect from "@/modules/gym-management/components/GymRedirect";

// Index
import StudentIndexPage from "@/modules/gym-management/pages/StudentIndexPage";
import TrainerIndexPage from "@/modules/gym-management/pages/TrainerIndexPage";

// Student pages
import StudentMainPage from "@/modules/gym-management/pages/student/StudentMainPage";
import ReservationsPage from "@/modules/gym-management/pages/student/ReservationsPage";
import BookingPage from "@/modules/gym-management/pages/student/BookingPage";
import RoutinesPage from "@/modules/gym-management/pages/student/RoutinesPage";
import RegisterProgressPage from "@/modules/gym-management/pages/student/RegisterProgressPage";
import EvolutionPage from "@/modules/gym-management/pages/student/EvolutionPage";
import RegisterMeasurements from "@/modules/gym-management/pages/student/RegisterMeasurements";
import BodyMeasurements from "@/modules/gym-management/pages/student/BodyMeasurements";
import MyStudentsProgress from "@/modules/gym-management/pages/trainer/MyStudentsProgress";

// Trainer pages
import TrainerMainPage from "@/modules/gym-management/pages/trainer/TrainerMainPage";
import TrainerRoutinesPage from "@/modules/gym-management/pages/trainer/TrainerRoutinesPage";
import ExercisesPage from "@/modules/gym-management/pages/trainer/ExercisesPage";
import SessionsPage from "@/modules/gym-management/pages/trainer/SessionsPage";
import TrainerGenerateReportPage from "@/modules/gym-management/pages/trainer/TrainerGenerateReportPage";
import ProgressPage from "@/modules/gym-management/pages/trainer/ProgressPage";

// Admin pages
import AdministratorIndexPage from "../pages/AdministratorIndexPage";
import AdministratorProgressPage from "@/modules/gym-management/pages/admin/AdministratorProgressPage";
import AdministratorAttendancePage from "@/modules/gym-management/pages/admin/AdministratorAttendancePage";

// NotFound page
import NotFoundPage from "@/modules/gym-management/pages/NotFoundPage";
import GymNavBar from "../components/GymNavBar";
import GymNavBarAdmin from "../components/GymNavAdmin";

const studentTabs = [
  { label: "Inicio", path: "home" },
  { label: "Mis reservas", path: "reservations" },
  { label: "Reservar", path: "booking" },
  { label: "Rutinas", path: "routines" },
  { label: "Registro progreso", path: "progress" },
  { label: "Evolución", path: "evolution" }
];

const trainerTabs = [
  { label: "Inicio", path: "home" },
  { label: "Rutinas", path: "routines" },
  { label: "Ejercicios", path: "exercises" },
  { label: "Sesiones", path: "sessions" },
  { label: "Reporte", path: "reports" },
  { label: "Progresos", path: "progress" }
];

const adminTabs = [
  { label: "Progresos usuarios", path: "progress" },
  { label: "Asistencia", path: "attendance" },
]; 

const GymRoutes = () => {
  return (
    <Routes>
      {/* Redirección basada en rol */}
      <Route index element={<GymRedirect />} />

      {/* Rutas protegidas para estudiantes */}
      <Route
        path="student"
        element={<GymNavBar tabs={studentTabs} ariaLabel="Navegación del estudiante" />}
      >
        <Route path="home" element={<StudentMainPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="routines" element={<RoutinesPage />} />
        <Route path="progress" element={<RegisterProgressPage />} />
        <Route path="evolution" element={<EvolutionPage />} />
      </Route>

      {/* Rutas protegidas para entrenadores */}
      <Route
        path="trainer"
        element={<GymNavBar tabs={trainerTabs} ariaLabel="Navegación del entrenador" />}
      >
        <Route path="home" element={<TrainerMainPage />} />
        <Route path="routines" element={<TrainerRoutinesPage />} />
        <Route path="exercises" element={<ExercisesPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="reports" element={<TrainerGenerateReportPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="my-students-progress" element={<MyStudentsProgress />} />
      </Route>

      {/* Rutas protegidas para administradores */}
      <Route
        path="admin"
        element={<GymNavBarAdmin tabs={adminTabs} ariaLabel="Navegación del administrador" />}
      >
        <Route path="progress" element={<AdministratorProgressPage />} />
        <Route path="attendance" element={<AdministratorAttendancePage />} />
      </Route>

      {/* Rutas que no requieren la barra de navegación */}
      <Route path="trainer/index" element={<TrainerIndexPage />} />
      <Route path="student/index" element={<StudentIndexPage />} />
      <Route path="student/first-register" element={<RegisterMeasurements />} />
      <Route path="student/body-measurements" element={<BodyMeasurements />} />
      <Route path="admin/index" element={<AdministratorIndexPage />} />

      {/* Ruta para no encontrados */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default GymRoutes;