import { Alert, Button } from "@heroui/react";

type Props = {
  isEnabled: boolean;
  onToggle: () => void;
};

const ShiftsStatus = ({ isEnabled, onToggle }: Props) => {
  return (
    <>
      <Alert
        color={isEnabled ? "success" : "danger"}
        className="w-full my-2"
        title={isEnabled ? "Turnos habilitados" : "Turnos deshabilitados"}
        description={
          isEnabled
            ? "Todos los turnos están habilitados. Puede gestionar la disponibilidad de cada especialidad."
            : "Todos los turnos están deshabilitados. No se puede gestionar la disponibilidad de cada especialidad."
        }
      />
      <Button
        className="w-full my-2 text-white"
        color={isEnabled ? "success" : "danger"}
        onPress={onToggle}
      >
        {isEnabled ? "Deshabilitar turnos" : "Habilitar turnos"}
      </Button>
    </>
  );
};

export default ShiftsStatus;
