import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Dashboard from "./common/dashboard";
import Layout from "./common/layout/layout";
import ForgotPassword from "./modules/auth/components/ForgotPassword";

// Recreational rooms
import RoomActions from "./modules/recreational-rooms/components/RoomActions";
import RoomsPage from "@modules/recreational-rooms/components/rooms/components/RoomsPage";
import ReservationsPage from "./modules/recreational-rooms/components/ReservationsPage";
import ItemsPage from "./modules/recreational-rooms/components/ItemsPage";

// Health & others
import { HealthRoutes } from "@modules/appointment-management/routes";
import { useAuth } from "./common/context";
import { Role } from "./common/types";
import { ProtectedRoute, Root } from "@common/components";
import ExtracurricularClassesRoutes from "./modules/extracurricular-classes/routes";

const MODULE_MAPPING = {
  health: "turnos",
  recreation: "salas",
  extracurricular: "clases",
  sports: "prestamos",
  gym: "seguimiento",
  users: "usuarios",
  statistics: "estadisticas",
};

// Module Colors
const moduleColors = {
  health: "#0078B4", // Turnos de Salud
  recreation: "#0E7029", // Salas Recreativas
  extracurricular: "#362550", // Clases Extra
  sports: "#5B1F00", // Préstamos Deportivos
  gym: "#000000", // Gimnasio/Seguimiento
  users: "#990000", // Gestión Usuarios
  statistics: "#990000", // Estadísticas
  default: "#990000", // Color por defecto para dashboard
};

// Componentes de módulos
const ModuleTemplate: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">
        Contenido del módulo {title} - En desarrollo
      </p>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();
  const handleNotificationsClick = () => {
    console.log("Mostrando notificaciones...");
    // Aquí iría la lógica para mostrar notificaciones
  };

  return (
    <Routes>
      {/* Ruta inicial - login */}
      <Route path="/" element={<Root />} />

      {/* Restaurar contrasena*/}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        {/* Ruta principal - Dashboard */}
        <Route
          path="/home"
          element={
            <Layout
              moduleColor={moduleColors.default}
              showSidebar={true}
              onNotificationsClick={handleNotificationsClick}
            >
              <Dashboard />
            </Layout>
          }
        />

        {/* Módulo de Salud/Turnos */}
        <Route
          path="/modules/health/*"
          element={
            <Layout
              moduleColor={moduleColors.health}
              activeModule={MODULE_MAPPING.health}
              onNotificationsClick={handleNotificationsClick}
              showSidebar={user?.role === Role.ADMINISTRATOR}
            >
              <HealthRoutes />
            </Layout>
          }
        />
        {/* Módulo de Recreación/Salas */}
        <Route
          path="/modules/recreation/*"
          element={
            <Layout
              moduleColor={moduleColors.recreation}
              activeModule={MODULE_MAPPING.recreation}
              onNotificationsClick={handleNotificationsClick}
            >
              <div className="">
                <div className="">
                  <div className="bg-white rounded-lg shadow p-6 h-full">
                    <Outlet />
                  </div>
                </div>
              </div>
            </Layout>
          }
        >
          {/* Ruta principal del módulo */}
          <Route index element={<RoomActions />} />

          {/* Subrutas */}
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="items" element={<ItemsPage />} />
        </Route>

        {/* Módulo de Clases Extracurriculares */}
        <Route
          path="/modules/extracurricular/*"
          element={
            <Layout
              moduleColor={moduleColors.extracurricular}
              activeModule={MODULE_MAPPING.extracurricular}
              onNotificationsClick={handleNotificationsClick}
            >
              <ExtracurricularClassesRoutes userRole="student" />
            </Layout>
          }
        />

        {/* Módulo de Préstamos Deportivos */}
        <Route
          path="/modules/sports/*"
          element={
            <Layout
              moduleColor={moduleColors.sports}
              activeModule={MODULE_MAPPING.sports}
              onNotificationsClick={handleNotificationsClick}
            >
              <ModuleTemplate title="Préstamos Deportivos" />
            </Layout>
          }
        />

        {/* Módulo de Gimnasio/Seguimiento */}
        <Route
          path="/modules/gym/*"
          element={
            <Layout
              moduleColor={moduleColors.gym}
              activeModule={MODULE_MAPPING.gym}
              onNotificationsClick={handleNotificationsClick}
            >
              <ModuleTemplate title="Gestión del Gimnasio" />
            </Layout>
          }
        />

        {/* Módulo de Estadísticas */}
        <Route
          path="/modules/statistics/*"
          element={
            <Layout
              moduleColor={moduleColors.statistics}
              activeModule={MODULE_MAPPING.statistics}
              onNotificationsClick={handleNotificationsClick}
            >
              <ModuleTemplate
                title="Estadísticas y Reportes"
                // color={moduleColors.statistics}
              />
            </Layout>
          }
        />

        {/* Módulo de Usuarios */}
        <Route
          path="/modules/users/*"
          element={
            <Layout
              moduleColor={moduleColors.users}
              activeModule={MODULE_MAPPING.users}
              onNotificationsClick={handleNotificationsClick}
            >
              <ModuleTemplate
                title="Gestión de Usuarios"
                // color={moduleColors.users}
              />
            </Layout>
          }
        />
      </Route>

      {/* Ruta de fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
