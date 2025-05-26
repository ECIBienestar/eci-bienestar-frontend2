import { FC, useState } from "react";
import ModuleTabs from "../../components/common/moduleTabs";
import BackButton from "../../components/common/backButton";
import EnrolledClassesList from "../../components/student/enrolledClassesList";
import CalendarView from "../../components/common/calendarView";

const EnrolledClassesPage: FC = () => {
  // Hardcodeamos el ID del estudiante como ejemplo
  const studentId = "123";
  const userRole = "student";

  // Estado para el tipo de vista (movido desde EnrolledClassesList)
  const [viewType, setViewType] = useState<"list" | "calendar">("list");

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
        <h1 className="text-2xl font-bold text-gray-800">Clases Inscritas</h1>
      </div>

      {/* Tabs principales */}
      <ModuleTabs tabs={studentTabs} userRole={userRole} />

      {/* Contenedor principal con selector de vista */}
      <div className="bg-white rounded-b-lg rounded-tr-lg shadow p-6 border-t-0 border-2 border-gray-200">
        {/* Selector de vista */}
        <div className="flex mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-l-lg ${
              viewType === "list"
                ? "bg-[#362550] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setViewType("list")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Vista de lista
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-r-lg ${
              viewType === "calendar"
                ? "bg-[#362550] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setViewType("calendar")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Vista de calendario
          </button>
        </div>

        {/* Renderizado condicional basado en viewType */}
        {viewType === "list" ? (
          <EnrolledClassesList userId={studentId} />
        ) : (
          <CalendarView />
        )}
      </div>
    </div>
  );
};

export default EnrolledClassesPage;
