import { FC } from "react";
import ModuleTabs from "../../components/common/moduleTabs";
import BackButton from "../../components/common/backButton";

const StatisticsPage: FC = () => {
  const userRole = "admin";

  const allTabs = [
    {
      label: "Estadísticas",
      path: "/modules/extracurricular/estadisticas",
      roles: ["wellnessStaff", "admin"],
    },
    {
      label: "Gestión de clases",
      path: "/modules/extracurricular/gestion-de-clases",
      roles: ["wellnessStaff", "admin"],
    },
    {
      label: "Gestión de notificaciones",
      path: "/modules/extracurricular/gestion-de-notificaciones",
      roles: ["admin"],
    },
  ];

  const tabs = allTabs.filter((tab) => tab.roles.includes(userRole));

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
      </div>

      <div className="mb-[-1px]">
        <ModuleTabs tabs={tabs} userRole={userRole} />
      </div>

      <div className="bg-white rounded-b-lg rounded-tr-lg shadow p-6 border-t-0 border-2 border-gray-200">
        <h2 className="text-xl font-bold mb-4">Contenido de Estadísticas</h2>
      </div>
    </div>
  );
};

export default StatisticsPage;
