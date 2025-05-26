import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import image from "@/assets/images/extracurricular-classes.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, 
  faList, 
  faHistory, 
  faUserCheck, 
  faChartBar, 
  faCog, 
  faBell 
} from "@fortawesome/free-solid-svg-icons";

interface DashboardExtraClassesProps {
  userRole: 'student' | 'teacher' | 'wellnessStaff' | 'admin';
}

const DashboardExtraClasses: React.FC<DashboardExtraClassesProps> = ({ userRole }) => {
  const navigate = useNavigate();

  // Configuración específica por rol
  const roleConfig = {
    student: {
      welcomeMessage: "Bienvenido al sistema de Clases Extracurriculares",
      subtitle: "Gestiona tus clases y asistencia",
      items: [
        {
          id: "enrolled-classes",
          title: "Mis Clases",
          description: "Ver las clases en las que estás inscrito",
          icon: faCalendarCheck,
          linkTo: "/modules/extracurricular/clases-inscritas"
        },
        {
          id: "available-classes",
          title: "Clases Disponibles",
          description: "Explorar e inscribirse en nuevas clases",
          icon: faList,
          linkTo: "/modules/extracurricular/clases-disponibles"
        },
        {
          id: "attendance-history",
          title: "Historial de Asistencia",
          description: "Revisar tu historial de asistencia",
          icon: faHistory,
          linkTo: "/modules/extracurricular/historial-asistencia"
        }
      ]
    },
    teacher: {
      welcomeMessage: "Panel de Profesor - Clases Extracurriculares",
      subtitle: "Administra tus clases y estudiantes",
      items: [
        {
          id: "scheduled-classes",
          title: "Clases Programadas",
          description: "Ver y gestionar tus clases programadas",
          icon: faCalendarCheck,
          linkTo: "/modules/extracurricular/clases-programadas"
        },
        {
          id: "attendance-register",
          title: "Registro de Asistencia",
          description: "Tomar asistencia de tus estudiantes",
          icon: faUserCheck,
          linkTo: "/modules/extracurricular/registro-de-asistencia"
        }
      ]
    },
    wellnessStaff: {
      welcomeMessage: "Panel de Bienestar Estudiantil",
      subtitle: "Supervisa y gestiona las clases extracurriculares",
      items: [
        {
          id: "statistics",
          title: "Estadísticas",
          description: "Ver reportes y estadísticas del programa",
          icon: faChartBar,
          linkTo: "/modules/extracurricular/estadisticas"
        },
        {
          id: "class-management",
          title: "Gestión de Clases",
          description: "Administrar clases y profesores",
          icon: faCog,
          linkTo: "/modules/extracurricular/gestion-de-clases"
        }
      ]
    },
    admin: {
      welcomeMessage: "Panel de Administrador",
      subtitle: "Control total del sistema de clases extracurriculares",
      items: [
        {
          id: "statistics",
          title: "Estadísticas",
          description: "Ver reportes y estadísticas completas",
          icon: faChartBar,
          linkTo: "/modules/extracurricular/estadisticas"
        },
        {
          id: "class-management",
          title: "Gestión de Clases",
          description: "Administrar todas las clases del sistema",
          icon: faCog,
          linkTo: "/modules/extracurricular/gestion-de-clases"
        },
        {
          id: "notification-management",
          title: "Gestión de Notificaciones",
          description: "Administrar notificaciones del sistema",
          icon: faBell,
          linkTo: "/modules/extracurricular/gestion-de-notificaciones"
        }
      ]
    }
  };

  const currentConfig = roleConfig[userRole];

  const handleCardClick = (linkTo: string) => {
    navigate(linkTo);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Banner principal */}
      <div className="h-80 mb-8 rounded-xl overflow-hidden">
        <Card
          isFooterBlurred
          className="w-full h-full"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start"></CardHeader>
          <Image
            removeWrapper
            alt="Clases extracurriculares background"
            className="z-0 w-full h-full object-cover"
            src={image}
          />
          <CardFooter className="absolute bg-black/50 bottom-0 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <div className="flex flex-col">
                <p className="text-white text-3xl font-bold max-md:text-2xl mb-2">
                  {currentConfig.welcomeMessage}
                </p>
                <p className="text-white/80 text-lg max-md:text-base">
                  {currentConfig.subtitle}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Sección de acciones */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          ¿Qué deseas hacer?
        </h2>
        
        {/* Contenedor de cards modificado */}
        <div className="flex justify-center w-full">
          <div className={`grid grid-cols-1 ${currentConfig.items.length >= 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} ${currentConfig.items.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-' + currentConfig.items.length} gap-6 w-full max-w-5xl`}>
            {currentConfig.items.map((item) => (
              <Card
                key={item.id}
                className="h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group min-w-[280px]"
                isPressable
                onPress={() => handleCardClick(item.linkTo)}
              >
                <CardBody className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-[#F3E8FF] rounded-full p-4 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      size="2x" 
                      style={{ color: "#362550" }} 
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardExtraClasses;