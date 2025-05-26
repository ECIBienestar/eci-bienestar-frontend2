import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpecialityEnum } from "@modules/appointment-management/types/enums";
import {
  callNextTurn,
  callTurn,
  createTurn,
  getCurrentTurn,
  getCurrentTurnBySpeciality,
  getTurns,
  getTurnsBySpeciality,
  skipTurn,
  toggleTurns,
  toggleTurnsBySpeciality,
  turnsDisabledBySpeciality,
  turnsEnabled,
} from "@modules/appointment-management/services";

export const useTurns = () => {
  return useQuery({
    queryKey: ["all-turns"],
    queryFn: () => getTurns(),
  });
};

export const useCreateTurn = () => {
  return useMutation({
    mutationFn: createTurn,
  });
};

export const useTurnsBySpeciality = (speciality: SpecialityEnum) => {
  return useQuery({
    queryKey: ["turns-by-speciality", speciality],
    queryFn: () => getTurnsBySpeciality(speciality),
    enabled: !!speciality,
  });
};

export const useCurrentTurn = () => {
  return useQuery({
    queryKey: ["current-turn"],
    queryFn: () => getCurrentTurn(),
  });
};

export const useCurrentTurnBySpeciality = (speciality: SpecialityEnum) => {
  return useQuery({
    queryKey: ["current-turn-by-speciality", speciality],
    queryFn: () => getCurrentTurnBySpeciality(speciality),
    enabled: !!speciality,
  });
};

export const useCallNextTurn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: callNextTurn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["current-turn-by-speciality", variables.speciality],
      });
      queryClient.invalidateQueries({
        queryKey: ["turns-by-speciality", variables.speciality],
      });
    },
    onError: (error) => {
      console.error("Error al llamar al siguiente turno:", error);
    },
  });
};

export const useCallTurn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: callTurn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["current-turn-by-speciality", variables.speciality],
      });
      queryClient.invalidateQueries({
        queryKey: ["turns-by-speciality", variables.speciality],
      });
    },
    onError: (error) => {
      console.error("Error al llamar al siguiente turno:", error);
    },
  });
};

export const useSkipTurn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: skipTurn,
    onSuccess: (_data, speciality) => {
      queryClient.invalidateQueries({
        queryKey: ["current-turn-by-speciality", speciality],
      });
    },
    onError: (error) => {
      console.error("Error al finalizar el turno:", error);
    },
  });
};

export const useTurnsEnabled = () => {
  return useQuery({
    queryKey: ["turns-enabled"],
    queryFn: () => turnsEnabled(),
  });
};

export const useTurnsDisabledBySpeciality = () => {
  return useQuery({
    queryKey: ["turns-disabled-by-speciality"],
    queryFn: () => turnsDisabledBySpeciality(),
  });
};

export const useToggleTurns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "enable" | "disable") => toggleTurns(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turns-enabled"] });
    },
    onError: (error) => {
      console.error("Error al cambiar disponibilidad global de turnos:", error);
    },
  });
};

export const useToggleTurnsBySpeciality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      action,
      speciality,
    }: {
      action: "enable" | "disable";
      speciality: SpecialityEnum;
    }) => toggleTurnsBySpeciality(action, speciality),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["turns-disabled-by-speciality"],
      });
    },
    onError: (error) => {
      console.error(
        "Error al cambiar disponibilidad de turnos por especialidad:",
        error
      );
    },
  });
};
