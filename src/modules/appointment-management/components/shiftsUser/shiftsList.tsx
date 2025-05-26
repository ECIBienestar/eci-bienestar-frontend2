import { Card, CardHeader, CardBody, ScrollShadow } from "@heroui/react";
import { useTurns } from "@modules/appointment-management/hooks";
import { TurnResponse } from "@modules/appointment-management/types/dto";
import {
  ShiftItem,
  ShowLoading,
  ShowErrorMessage,
} from "@modules/appointment-management/components/common";
import NoShifts from "./NoShifts";

type ShiftsListProps = {
  className?: string;
};

const ShiftsList = ({ className }: ShiftsListProps) => {
  const { data, isLoading, error } = useTurns();

  const turns: TurnResponse[] | undefined = data?.data;
  const showTurns = !isLoading && !error;

  return (
    <Card className={className}>
      <CardHeader
        className="px-4 flex-col items-start text-white rounded-t-xl z-0"
        style={{
          background: "linear-gradient(to right, #00BCFF, #0078B4)",
        }}
      >
        <h4 className="font-bold text-large">Próximos</h4>
      </CardHeader>
      <CardBody>
        {isLoading && <ShowLoading label="Obteniendo turnos..." size="lg" />}

        {!isLoading && error && (
          <ShowErrorMessage
            message={`Ocurrió un error al cargar los turnos: ${error.message}`}
          />
        )}

        {showTurns && turns && turns.length === 0 && <NoShifts />}

        {showTurns && turns && turns.length !== 0 && (
          <ScrollShadow hideScrollBar>
            <div className="flex flex-col gap-3">
              {turns.map((turn) => (
                <ShiftItem key={turn.id} turn={turn} showSpeciality />
              ))}
            </div>
          </ScrollShadow>
        )}
      </CardBody>
    </Card>
  );
};

export default ShiftsList;
