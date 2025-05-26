import React from "react";
import ServiceCard from "./serviceCard";

const services = [
  {
    id: "appointment-management",
    title: "Bienestar Universitario: Gestión de Turnos",
    imageUrl: new URL(
      "../assets/images/appointment-management.jpg",
      import.meta.url
    ).href,
    linkTo: "/modules/health",
    color: "#990000", // Rojo ECI
  },
  {
    id: "recreational-rooms",
    title: "Gestión de Salas y Préstamos Recreativos",
    imageUrl: new URL(
      "../assets/images/recreational-rooms.jpg",
      import.meta.url
    ).href,
    linkTo: "/modules/recreation",
    color: "#0066CC", // Azul
  },
  {
    id: "extracurricular-classes",
    title: "Asistencia a Clases Extracurriculares",
    imageUrl: new URL(
      "../assets/images/extracurricular-classes.jpg",
      import.meta.url
    ).href,
    linkTo: "/modules/extracurricular",
    color: "#009688", // Verde azulado
  },
  {
    id: "sports-equipment",
    title: "Préstamos Deportivos",
    imageUrl: new URL("../assets/images/sports-equipment.jpg", import.meta.url)
      .href,
    linkTo: "/modules/sports",
    color: "#FF5722", // Naranja
  },
  {
    id: "gym-management",
    title: "Seguimiento Físico y Reservas del Gimnasio",
    imageUrl: new URL("../assets/images/gym-management.jpg", import.meta.url)
      .href,
    linkTo: "/modules/gym",
    color: "#673AB7", // Morado
  },
  {
    id: "statistics-reporting",
    title: "Estadísticas y Reportes",
    imageUrl: new URL(
      "../assets/images/statistics-reporting.jpg",
      import.meta.url
    ).href,
    linkTo: "/modules/statistics",
    color: "#607D8B", // Gris azulado
  },
  {
    id: "user-administration",
    title: "Gestión de Usuarios",
    imageUrl: new URL(
      "../assets/images/user-administration.jpg",
      import.meta.url
    ).href,
    linkTo: "/modules/users",
    color: "#795548", // Marrón
  },
];

const Dashboard: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Grid de servicios responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            imageUrl={service.imageUrl}
            linkTo={service.linkTo}
          />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
