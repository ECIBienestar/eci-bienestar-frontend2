import {
  CallTurnRequest,
  TurnResponse,
} from "@modules/appointment-management/types/dto";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { SpecialityLabels } from "@modules/appointment-management/constants";
import styles from "@modules/appointment-management/styles/InfoItem.module.css";

type Props = {
  readonly className?: string;
  readonly turn: TurnResponse;
  readonly showCallButton?: boolean;
  readonly onCallTurn?: (callTurnRequest: CallTurnRequest) => void;
  readonly levelAttention?: number;
  readonly showSpeciality?: boolean;
  readonly color?: string;
};

function ShiftItem({
  className = "",
  turn,
  showCallButton = false,
  onCallTurn,
  levelAttention = 0,
  showSpeciality = false,
  color,
}: Props) {
  const handleCall = () => {
    if (onCallTurn) {
      onCallTurn({
        turnId: turn.id,
        speciality: turn.speciality,
        levelAttention,
      });
    }
  };

  return (
    <Card className={`shadow-none border border-gray-200 ${className}`}>
      <CardBody>
        <div className="flex flex-row items-center justify-between px-2">
          <div>
            <p
              className={`text-xl font-bold ${
                color ? `text-${color}` : styles[turn.speciality]
              }`}
            >
              {turn.code}
            </p>
            <p>{turn.user.name}</p>
            {turn.priority && (
              <Chip color="warning" variant="flat" size="sm" className="mt-3">
                Atención prioritaria
              </Chip>
            )}
          </div>

          {showCallButton && (
            <Button
              variant="light"
              className="text-health-primary"
              onPress={handleCall}
            >
              Llamar
            </Button>
          )}

          {showSpeciality && !showCallButton && (
            <p className="text-gray-400">{SpecialityLabels[turn.speciality]}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default ShiftItem;
