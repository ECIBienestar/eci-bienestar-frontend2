import { Button, Chip, Slider } from "@heroui/react";
import InfoItem from "./InfoItem";
import {
  CallTurnRequest,
  TurnResponse,
} from "@/modules/appointment-management/types/dto";
import { useSkipTurn } from "@/modules/appointment-management/hooks/useTurns";
import { RoleLabels } from "@/modules/appointment-management/constants";
import { SpecialityEnum } from "@/modules/appointment-management/types/enums";

const marks = Array.from({ length: 6 }, (_, i) => ({
  value: i,
  label: i.toString(),
}));

type Props = {
  readonly turn: TurnResponse;
  readonly speciality: SpecialityEnum;
  readonly level: number;
  readonly setLevel: (value: number) => void;
  readonly onCallTurn: (callTurnRequest: CallTurnRequest) => void;
};

function ShiftInfo({ turn, speciality, level, setLevel, onCallTurn }: Props) {
  const { mutate: skipTurn } = useSkipTurn();

  const handleSkipTurn = () => {
    skipTurn(speciality);
    setLevel(0);
  };

  const handleCallTurn = () => {
    console.log(speciality);
    onCallTurn({
      speciality,
      levelAttention: level,
    });
    setLevel(0);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-8">
        <h2 className="text-4xl font-bold text-health-primary">{turn.code}</h2>
        {turn.priority && (
          <Chip color="warning" variant="flat" size="sm">
            Atención prioritaria
          </Chip>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <InfoItem title="Nombre del paciente" value={turn.user.name} />
        <InfoItem title="Documento de identidad" value={turn.user.id} />
        <InfoItem title="Rol" value={RoleLabels[turn.user.role]} />
      </div>
      <div className="flex gap-4 my-16">
        <Button color="danger" onPress={handleSkipTurn}>
          Finalizar turno
        </Button>
        <Button
          className="bg-health-primary text-white"
          onPress={handleCallTurn}
        >
          Llamar siguiente
        </Button>
      </div>
      <div className="flex flex-col items-center w-10/12">
        <Slider
          color="warning"
          size="sm"
          value={level}
          onChange={(val) => setLevel(val as number)}
          label="Calidad de la atencion"
          marks={marks}
          maxValue={5}
          minValue={0}
          showTooltip={true}
          step={1}
        />
      </div>
    </>
  );
}

export default ShiftInfo;
