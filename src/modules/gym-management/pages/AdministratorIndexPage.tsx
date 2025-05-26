import { Card, CardBody, CardFooter, CardHeader, Image, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import image from "@/assets/images/gym-management.jpg";

const AdministratorIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      {/* Banner principal */}
      <div className="h-[40vh] mb-10">
        <Card isFooterBlurred className="w-full h-full col-span-12 sm:col-span-7">
          <CardHeader className="absolute z-10 top-1 flex-col items-start" />
          <Image
            removeWrapper
            alt="Imagen de gestión de gimnasio"
            className="z-0 w-full h-full object-cover"
            src={image}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <div className="flex flex-col">
                <p className="text-white text-2xl max-md:text-xl">
                  Bienvenido al servicio de seguimiento físico y gimnasio
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Sección de acciones */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center mb-10">
          ¿Qué deseas hacer?
        </h2>
        <div className="flex w-full justify-center gap-5 flex-wrap">

          {/* Ver sesiones de hoy */}
          <Card className="h-full w-72 transition-all hover:-translate-y-1">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-lg font-medium mb-4">Ver progresos de usuarios</p>
               <Button className="bg-red-700 text-white p-4 rounded-t-lg flex justify-between items-center" onPress={() => navigate("../admin/progress")}>
                Ir a progresos
              </Button>
            </CardBody>
          </Card>

          {/* Crear rutina */}
          <Card className="h-full w-72 transition-all hover:-translate-y-1">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-lg font-medium mb-4">Ver asistencias</p>
               <Button className="bg-red-700 text-white p-4 rounded-t-lg flex justify-between items-center" onPress={() => navigate("../admin/attendance")}>
                Ir a asistencias
              </Button>
            </CardBody>
          </Card>

          {/* Ver progreso físico */}
          <Card className="h-full w-72 transition-all hover:-translate-y-1">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-lg font-medium mb-4">Ver sesiones por entrenadores</p>
              <Button className="bg-red-700 text-white p-4 rounded-t-lg flex justify-between items-center" onPress={() => navigate("../admin/sessions")}>
                Ver sesiones
              </Button>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AdministratorIndexPage;