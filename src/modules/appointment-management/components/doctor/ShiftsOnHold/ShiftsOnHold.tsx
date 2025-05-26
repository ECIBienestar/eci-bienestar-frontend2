import {
  useCallTurn,
  useTurnsBySpeciality,
} from "@/modules/appointment-management/hooks/useTurns";
import {
  CallTurnRequest,
  TurnResponse,
} from "@/modules/appointment-management/types/dto";
import { SpecialityEnum } from "@/modules/appointment-management/types/enums";
import { Card, CardBody, CardHeader, ScrollShadow } from "@heroui/react";
import {
  ShiftItem,
  ShowLoading,
  ShowErrorMessage,
} from "@modules/appointment-management/components/common";

type Props = {
  readonly className?: string;
  readonly speciality: SpecialityEnum;
  readonly level: number;
  readonly setLevel: (value: number) => void;
};

function ShiftsOnHold({ className, speciality, level, setLevel }: Props) {
  const { data, isLoading, error } = useTurnsBySpeciality(speciality);
  const { mutate: callTurn } = useCallTurn();

  const turns: TurnResponse[] = data?.data ?? [];
  const handleCallTurn = (callTurnRequest: CallTurnRequest) => {
    callTurn(callTurnRequest);
    setLevel(0);
  };

  return (
    <Card className={className}>
      <CardHeader
        className="px-4 flex-col items-start text-white rounded-t-xl z-0"
        style={{
          background: "linear-gradient(to right, #00BCFF, #0078B4)",
        }}
      >
        <h4 className="font-bold text-large">Turnos en espera</h4>
      </CardHeader>
      <CardBody className="py-7 px-5">
        {isLoading && <ShowLoading label="Obteniendo turnos..." size="lg" />}

        {!isLoading && error && (
          <ShowErrorMessage
            message={`Ocurrió un error al cargar los turnos: ${error.message}`}
          />
        )}

        {!isLoading && !error && turns.length === 0 && (
          <p className="text-gray-500">No hay pacientes en espera</p>
        )}

        {!isLoading && !error && turns.length > 0 && (
          <>
            <p className="text-gray-600 mb-4">
              {turns.length} pacientes en espera
            </p>
            <ScrollShadow hideScrollBar>
              <div className="flex flex-col gap-3">
                {turns.map((turn) => (
                  <ShiftItem
                    key={turn.id}
                    turn={turn}
                    levelAttention={level}
                    onCallTurn={handleCallTurn}
                    showCallButton
                    color="health-primary"
                  />
                ))}
              </div>
            </ScrollShadow>
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default ShiftsOnHold;
