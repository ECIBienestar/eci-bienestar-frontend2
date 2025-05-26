import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import {
  faUserGraduate,
  faChalkboardTeacher,
  faUsersCog,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

import bannerImage from "../assets/images/panoramica.jpg";
import studentIcon from "../assets/images/students.png";
import teacherIcon from "../assets/images/teachers.jpg";
import staffIcon from "../assets/images/staff.png";
import doctorIcon from "../assets/images/doctors.jpeg";

interface ModuleItem {
  id: string;
  iconSrc: string;
  title: string;
  description: string;
  linkTo: string;
  fontAwesomeIcon: any;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const items: ModuleItem[] = [
    {
      id: "students",
      iconSrc: studentIcon,
      title: "Estudiantes",
      description: "Gestiona a los estudiantes",
      linkTo: "/modules/users/students",
      fontAwesomeIcon: faUserGraduate,
    },
    {
      id: "teachers",
      iconSrc: teacherIcon,
      title: "Profesores",
      description: "Gestiona a los profesores",
      linkTo: "/modules/users/teachers",
      fontAwesomeIcon: faChalkboardTeacher,
    },
    {
      id: "staff",
      iconSrc: staffIcon,
      title: "Personal",
      description: "Gestiona al personal administrativo",
      linkTo: "/modules/users/staff",
      fontAwesomeIcon: faUsersCog,
    },
    {
      id: "doctors",
      iconSrc: doctorIcon,
      title: "Doctores",
      description: "Gestiona al personal médico",
      linkTo: "/modules/users/doctors",
      fontAwesomeIcon: faStethoscope,
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Banner superior */}
      <div className="h-[40vh] w-full">
        <Card isFooterBlurred className="relative h-full">
          <Image
            removeWrapper
            alt="Banner Usuarios"
            className="z-0 w-full h-full object-cover"
            src={bannerImage}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 w-full border-t-1 border-default-600 py-4 md:py-6">
            <div className="px-6 md:px-10">
              <h1 className="text-white text-2xl md:text-4xl font-bold">
                Bienvenido al servicio de gestión de usuarios
              </h1>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Título y descripción */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#b30000] mb-2">
          ¡Explora las opciones de usuario!
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed text-justify">
          En esta sección podrás gestionar todos los usuarios de la institución. 
          Consulta listados completos, crea perfiles con datos personales, asigna roles y permisos, 
          edita información y elimina cuentas no requeridas. Administra eficientemente estudiantes, 
          profesores, personal administrativo y médico para optimizar la gestión de la aplicación.
        </p>
      </div>

      {/* Grid de tarjetas */}
      <div className="flex w-full justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {items.map((item) => (
            <Card
              key={item.id}
              className="h-full transition-transform hover:scale-105 hover:shadow-lg"
            >
              <CardBody
                className="flex flex-col items-center p-6 cursor-pointer"
                onClick={() => navigate(item.linkTo)}
              >
                {/* Contenedor circular para la imagen */}
                <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border-4 border-[#b30000] bg-white shadow-md">
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  {item.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
