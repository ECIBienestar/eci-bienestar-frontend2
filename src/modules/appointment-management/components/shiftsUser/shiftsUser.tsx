import InstitutionalInfo from "./institutionalInfo";
import ShiftActual from "./shiftActual";
import ShiftsList from "./shiftsList";
import { TurnResponse } from "../../types/dto";
import { useCurrentTurn } from "../../hooks";
import {
  ShiftItem,
  ShowLoading,
  ShowErrorMessage,
} from "@modules/appointment-management/components/common";
import NoShifts from "./NoShifts";

const ShiftsUser = () => {
  const { data, isLoading, error } = useCurrentTurn();

  const turn: TurnResponse | undefined = data?.data;
  const showTurn = !isLoading && !error;

  return (
    <div className="px-6 py-4">
      <div className="w-full flex flex-row gap-4 max-lg:flex-col max-lg:h-auto">
        <ShiftsList className="w-2/5 max-h-[850px] max-xl:w-1/2 max-lg:w-full max-lg:max-h-[737px]" />
        <div className="w-3/5 flex flex-col gap-4 h-full  max-xl:w-1/2 max-lg:w-full">
          <ShiftActual className="min-h-[190px]">
            {isLoading && (
              <ShowLoading label="Obteniendo turnos..." size="lg" />
            )}

            {!isLoading && error && (
              <ShowErrorMessage
                message={`Ocurrió un error al cargar los turnos: ${error.message}`}
              />
            )}

            {showTurn && !turn && <NoShifts />}

            {showTurn && turn && (
              <div className="w-full flex m-auto">
                <ShiftItem className="w-full" turn={turn} showSpeciality />
              </div>
            )}
          </ShiftActual>
          <InstitutionalInfo />
        </div>
      </div>
    </div>
  );
};

export default ShiftsUser;
