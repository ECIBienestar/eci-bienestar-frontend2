import { Card, CardBody, CardHeader, Tabs, Tab, Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import AddMediaForm from "./addMediaForm";
import MediaList from "./mediaList";

const GestionMultimediaPanel = () => {
  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold max-sm:text-2xl">
          Panel de administración
        </h1>
        <p className="text-xs font-normal text-zinc-500">
          Gestione el contenido multimedia
        </p>
      </CardHeader>

      <Tabs aria-label="Options" fullWidth>
        <Tab key="addMedia" title="Agregar">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <AddMediaForm />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="deleteMedia" title="Eliminar">
          <Card>
            <CardBody>
              <MediaList />
              <Button
                className="w-full my-2 bg-health-primary text-white"
                type="button"
              >
                <FontAwesomeIcon icon={faFloppyDisk} /> Guardar cambios
              </Button>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default GestionMultimediaPanel;
