import InfoItem from "../ShiftInfo/InfoItem";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CallTurnRequest } from "@/modules/appointment-management/types/dto";
import { SpecialityEnum } from "@/modules/appointment-management/types/enums";

type Props = {
  readonly speciality: SpecialityEnum;
  readonly onCallTurn: (callTurnRequest: CallTurnRequest) => void;
};

function NoShift({ speciality, onCallTurn }: Props) {
  const handleCallTurn = () => {
    onCallTurn({
      speciality,
      levelAttention: 0,
    });
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <FontAwesomeIcon icon={["fas", "user-check"]} size="3x" />
      <InfoItem
        title="No hay pacientes en atencion"
        value="Llama al siguiente turno para empezar"
      />
      <Button className="bg-health-primary text-white" onPress={handleCallTurn}>
        Llamar turno
      </Button>
    </div>
  );
}

export default NoShift;
