import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUsers,
  faGraduationCap,
  faBasketball,
  faDumbbell,
  faChartBar,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  moduleColor?: string;
  activeModule?: string;
  modules?: SidebarModule[];
}

export interface SidebarModule {
  id: string;
  name: string;
  icon: any;
  path: string;
}

const defaultModules: SidebarModule[] = [
  {
    id: "turnos",
    name: "Turnos Bienestar",
    icon: faCalendarDays,
    path: "/modules/health",
  },
  {
    id: "salas",
    name: "Salas Recreación",
    icon: faUsers,
    path: "/modules/recreation",
  },
  {
    id: "clases",
    name: "Clases Extra",
    icon: faGraduationCap,
    path: "/modules/extracurricular",
  },
  {
    id: "prestamos",
    name: "Préstamos Deportivos",
    icon: faBasketball,
    path: "/modules/sports",
  },
  {
    id: "seguimiento",
    name: "Seguimiento Físico",
    icon: faDumbbell,
    path: "/modules/gym",
  },
  {
    id: "usuarios",
    name: "Gestión Usuarios",
    icon: faUsers,
    path: "/modules/users",
  },
  {
    id: "estadisticas",
    name: "Estadísticas",
    icon: faChartBar,
    path: "/modules/statistics",
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  moduleColor = "#990000",
  activeModule,
  modules = defaultModules,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const location = useLocation();

  const toggleMobileExpand = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  const getActiveModuleFromPath = () => {
    if (activeModule) return activeModule;

    const currentPath = location.pathname;
    const matchingModule = modules.find((module) =>
      currentPath.startsWith(module.path)
    );

    return matchingModule?.id || "";
  };

  const currentActiveModule = getActiveModuleFromPath();

  const mobileClasses = isMobileExpanded
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  return (
    <>
      {/* Botón de menú de hamburguesa */}
      <button
        onClick={toggleMobileExpand}
        className="fixed z-50 top-4 left -4 p-1  rounded-md 
          bg-transparent text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={isMobileExpanded ? faXmark : faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-2 top-20 h-[calc(100vh-5rem)] 
            w-20 bg-red-800 rounded-2xl flex flex-col items-center 
            py-2 shadow-lg transition-transform duration-300 
            ease-in-out z-30 
          ${mobileClasses} ${isOpen ? "" : "md:-translate-x-full"}`}
        style={{ backgroundColor: moduleColor }}
      >
        {modules.map((module, index) => (
          <Link to={module.path} key={index}>
            <div
              className={`flex flex-col items-center justify-center
                w-full py-1.5 my-0.5 rounded-xl cursor-pointer 
                ${
                  currentActiveModule === module.id
                    ? "bg-white/20 text-white"
                    : "hover:bg-white/20 text-gray-200"
                }`}
              onClick={() => {
                if (isMobileExpanded) {
                  toggleMobileExpand();
                }
              }}
            >
              <FontAwesomeIcon icon={module.icon} className="text-xl" />
              <span className="text-[10px] mt-1 text-center">
                {module.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Superposición*/}
      {isMobileExpanded && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={toggleMobileExpand}
        />
      )}
    </>
  );
};

export default Sidebar;
