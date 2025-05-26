import {
  useCallNextTurn,
  useCurrentTurnBySpeciality,
} from "@/modules/appointment-management/hooks/useTurns";
import {
  CallTurnRequest,
  TurnResponse,
} from "@/modules/appointment-management/types/dto";
import { SpecialityEnum } from "@/modules/appointment-management/types/enums";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  NoShift,
  ShiftInfo,
} from "@modules/appointment-management/components/doctor/CurrentAttention";
import {
  ShowLoading,
  ShowErrorMessage,
} from "@/modules/appointment-management/components/common";

type Props = {
  readonly className?: string;
  readonly speciality: SpecialityEnum;
  readonly level: number;
  readonly setLevel: (value: number) => void;
};

function CurrentAttention({ className, speciality, level, setLevel }: Props) {
  const { data, isLoading, error } = useCurrentTurnBySpeciality(speciality);
  const { mutate: callNextTurn } = useCallNextTurn();

  const turn: TurnResponse | undefined = data?.data;
  const handleCallNext = (callTurnRequest: CallTurnRequest) => {
    callNextTurn(callTurnRequest);
  };

  return (
    <Card className={className}>
      <CardHeader
        className="px-4 flex-col items-start text-white rounded-t-xl z-0"
        style={{
          background: "linear-gradient(to right, #00BCFF, #0078B4)",
        }}
      >
        <h4 className="font-bold text-large">Atención actual</h4>
      </CardHeader>
      <CardBody className="py-10">
        {isLoading && <ShowLoading label="Obteniendo turnos..." size="lg" />}

        {!isLoading && error && (
          <ShowErrorMessage
            message={`Ocurrió un error al cargar los turnos: ${error.message}`}
          />
        )}

        {!isLoading && !error && turn == null && (
          <div className="flex flex-col items-center justify-center h-full">
            <NoShift speciality={speciality} onCallTurn={handleCallNext} />
          </div>
        )}

        {!isLoading && !error && turn != null && (
          <div className="flex flex-col items-center justify-center h-full">
            <ShiftInfo
              turn={turn}
              speciality={speciality}
              level={level}
              setLevel={setLevel}
              onCallTurn={handleCallNext}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default CurrentAttention;
