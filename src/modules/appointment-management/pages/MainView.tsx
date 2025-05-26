import { Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";
import image from "@/assets/images/appointment-management.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminItems, doctorItems } from "@modules/appointment-management/data";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/context";
import { Role } from "@/common/types";
import { ModuleItemType } from "@modules/appointment-management/types";

function MainView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  let items: ModuleItemType[] = [];

  switch (user?.role) {
    case Role.ADMINISTRATOR:
      items = adminItems;
      break;
    case Role.MEDICAL_SECRETARY:
      items = adminItems;
      break;
    case Role.MEDICAL_STAFF:
      items = doctorItems;
      break;
    default:
      items = [];
      break;
  }

  return (
    <div className="p-10">
      <div className="h-[40vh] mb-10">
        <Card
          isFooterBlurred
          className="w-full h-full col-span-12 sm:col-span-7"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start"></CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src={image}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <div className="flex flex-col">
                <p className="text-white text-2xl max-md:text-xl">
                  Bienvenido al servicio de gestión de Turnos
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center mb-10">
          ¿Qué deseas hacer?
        </h2>
        <div className="flex w-full justify-center gap-5 flex-wrap">
          {items.map((item) => (
            <Card
              key={item.id}
              className="h-full w-72 transition-all hover:-translate-y-1"
            >
              <CardBody
                className="flex flex-col items-center justify-center p-6 text-center"
                onClick={() => navigate(item.linkTo)}
              >
                <div className="bg-health-primary/10 text-health-primary rounded-full p-3 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainView;
