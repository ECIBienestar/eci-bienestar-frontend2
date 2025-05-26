import { useEffect, useState } from "react";
import { SpecialityEnum } from "../types/enums";
import {
  useToggleTurns,
  useToggleTurnsBySpeciality,
  useTurnsDisabledBySpeciality,
  useTurnsEnabled,
} from "./useTurns";

const useGestionShiftPanel = () => {
  const { data: areTurnsEnabled, isLoading: isLoadingGlobal } =
    useTurnsEnabled();

  const { data: disabledSpecialities, isLoading: isLoadingSpecialities } =
    useTurnsDisabledBySpeciality();

  const { mutate: toggleGlobalTurns } = useToggleTurns();
  const { mutate: toggleSpecialityTurns } = useToggleTurnsBySpeciality();

  const [availability, setAvailability] = useState<
    Record<SpecialityEnum, boolean>
  >(
    Object.fromEntries(
      Object.values(SpecialityEnum).map((speciality) => [speciality, true])
    ) as Record<SpecialityEnum, boolean>
  );

  const [availabilityShifts, setAvailabilityShifts] = useState<boolean>(true);

  useEffect(() => {
    if (areTurnsEnabled?.data !== undefined) {
      setAvailabilityShifts(areTurnsEnabled.data);
    }
  }, [areTurnsEnabled]);

  useEffect(() => {
    if (disabledSpecialities?.data !== undefined) {
      const updateAvailability = Object.values(SpecialityEnum).reduce(
        (acc, speciality) => {
          acc[speciality] = !disabledSpecialities.data.includes(speciality);
          return acc;
        },
        {} as Record<SpecialityEnum, boolean>
      );

      setAvailability(updateAvailability);
    }
  }, [disabledSpecialities]);

  const toggleShiftAvailability = () => {
    const action = availabilityShifts ? "disable" : "enable";
    toggleGlobalTurns(action);
  };

  const toggleSpeciality = (speciality: SpecialityEnum) => {
    const action = availability[speciality] ? "disable" : "enable";
    toggleSpecialityTurns({ action, speciality });
  };

  return {
    availability,
    availabilityShifts,
    isLoading: isLoadingGlobal || isLoadingSpecialities,
    toggleShiftAvailability,
    toggleSpeciality,
  };
};

export default useGestionShiftPanel;
