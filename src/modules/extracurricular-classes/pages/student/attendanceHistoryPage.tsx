import { FC } from "react";
import ModuleTabs from "../../components/common/moduleTabs";
import BackButton from "../../components/common/backButton";

const AttendanceHistoryPage: FC = () => {
  const userRole = "student";

  const studentTabs = [
    {
      label: "Mis clases inscritas",
      path: "/modules/extracurricular/estudiante/clases-inscritas",
      roles: ["student"],
    },
    {
      label: "Clases disponibles",
      path: "/modules/extracurricular/estudiante/clases-disponibles",
      roles: ["student"],
    },
    {
      label: "Historial de asistencia",
      path: "/modules/extracurricular/historial-asistencia",
      roles: ["student"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Encabezado */}
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Historial de Asistencia{" "}
        </h1>
      </div>

      {/* Tabs principales */}
      <ModuleTabs tabs={studentTabs} userRole={userRole} />
      {/* Contenido de la página */}
      <div className="bg-white rounded-b-lg rounded-tr-lg shadow p-6 border-t-0 border-2 border-gray-200">
        <h2 className="text-xl font-bold mb-4">Contenido...</h2>
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
