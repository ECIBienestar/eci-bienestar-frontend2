import healthApiClient from "./healthApiClient";
import {
  ApiResponse,
  TurnResponse,
  CallTurnRequest,
  CreateTurnRequest,
} from "@modules/appointment-management/types/dto";
import { SpecialityEnum } from "@modules/appointment-management/types/enums";

export const createTurn = async (
  data: CreateTurnRequest
): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<TurnResponse>>(
      "/turns",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creando el turno:", error);
    throw error;
  }
};

export const getTurns = async (): Promise<ApiResponse<TurnResponse[]>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<TurnResponse[]>>(
      "/turns"
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    throw error;
  }
};

export const getTurnsBySpeciality = async (
  speciality: SpecialityEnum
): Promise<ApiResponse<TurnResponse[]>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<TurnResponse[]>>(
      `/turns/${speciality}`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    throw error;
  }
};

export const getCurrentTurn = async (): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<TurnResponse>>(
      `/turns/current-turn`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el turno que esta siendo atendido:", error);
    throw error;
  }
};

export const getCurrentTurnBySpeciality = async (
  speciality: SpecialityEnum
): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<TurnResponse>>(
      `/turns/current-turn/${speciality}`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el turno que esta siendo atendido:", error);
    throw error;
  }
};

export const callNextTurn = async (
  data: CallTurnRequest
): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<TurnResponse>>(
      "/turns/call-next",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error llamando al siguiente turno:", error);
    throw error;
  }
};

export const callTurn = async (
  data: CallTurnRequest
): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<TurnResponse>>(
      "/turns/call",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error llamando al siguiente turno:", error);
    throw error;
  }
};

export const skipTurn = async (
  speciality: SpecialityEnum
): Promise<ApiResponse<void>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<void>>(
      `/turns/skip?speciality=${speciality}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al finalizar el turno:", error);
    throw error;
  }
};

export const turnsEnabled = async (): Promise<ApiResponse<boolean>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<boolean>>(
      "/turns/are-enabled"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado de los turnos:", error);
    throw error;
  }
};

export const turnsDisabledBySpeciality = async (): Promise<
  ApiResponse<SpecialityEnum[]>
> => {
  try {
    const response = await healthApiClient.get<ApiResponse<SpecialityEnum[]>>(
      "/turns/specialties-disabled"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado de los turnos:", error);
    throw error;
  }
};

export const toggleTurns = async (
  action: "enable" | "disable"
): Promise<ApiResponse<void>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<void>>(
      `/turns/${action}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al ${action === "enable" ? "habilitar" : "deshabilitar"} turnos:`,
      error
    );
    throw error;
  }
};

export const toggleTurnsBySpeciality = async (
  action: "enable" | "disable",
  speciality: SpecialityEnum
): Promise<ApiResponse<void>> => {
  try {
    const response = await healthApiClient.post<ApiResponse<void>>(
      `/turns/${action}/${speciality}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al ${action === "enable" ? "habilitar" : "deshabilitar"} turnos:`,
      error
    );
    throw error;
  }
};
