import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  Card as HeroCard,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { InfoItem } from "@/modules/appointment-management/components/confirmation";
import styles from "./Card.module.css";
import { TurnResponse } from "@/modules/appointment-management/types/dto";
import { SpecialityLabels } from "@/modules/appointment-management/constants";

type Props = {
  turnResponse: TurnResponse;
  setTurnResponse: (turnResponse: TurnResponse | null) => void;
  onSubmitAction: (bool: boolean) => void;
};

const Card = ({ turnResponse, setTurnResponse, onSubmitAction }: Props) => {
  return (
    <HeroCard className="max-w-[600px] m-auto">
      <CardHeader
        className={`z-0 ${
          styles[`bg-gradient-health-${turnResponse.speciality}`]
        } p-8 flex flex-col gap-5`}
      >
        <FontAwesomeIcon
          icon={["far", "circle-check"]}
          className="text-white"
          size="4x"
        />
        <h1 className="text-2xl text-white font-bold">¡Turno confirmado!</h1>
        <p className="text-4xl text-white font-bold p-6 bg-white/20 rounded-full">
          {turnResponse.code}
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex items-center mt-5 mx-5 max-[540px]:mx-2">
          <div className={styles.circle}></div>
          <div className="flex-grow border-t-2 border-dashed border-gray-100"></div>
          <div className={styles.circle}></div>
        </div>
        <div className="flex flex-col gap-8 m-8 max-[540px]:mx-5">
          <InfoItem
            title="Paciente"
            info={turnResponse.user.name}
            icon={["far", "user"]}
            color={turnResponse.speciality}
          />
          <InfoItem
            title="Especialidad"
            info={SpecialityLabels[turnResponse.speciality]}
            icon={["fas", "stethoscope"]}
            color={turnResponse.speciality}
          />
          <InfoItem
            title="Atención prioritaria"
            info={turnResponse.priority ? "Si" : "No"}
            icon={["far", "calendar"]}
            color={turnResponse.speciality}
          />
          <Alert
            color="primary"
            title="Por favor, esté atento a la pantalla de llamado de turnos"
          ></Alert>
          <Button
            color="default"
            variant="bordered"
            startContent={<FontAwesomeIcon icon={["fas", "arrow-left"]} />}
            onPress={() => {
              setTurnResponse(null);
              onSubmitAction(false);
            }}
          >
            Volver a registro
          </Button>
        </div>
      </CardBody>
    </HeroCard>
  );
};

export default Card;
