import healthApiClient from "./healthApiClient";
import {
  ApiResponse,
  CountByRole,
  CountBySpeciality,
} from "@modules/appointment-management/types/dto";

export const getTurnCountByRole = async (
  start: string,
  end: string,
  role?: string,
  status?: string
): Promise<ApiResponse<CountByRole[]>> => {
  try {
    const params: any = { start, end };
    if (role) params.role = role;
    if (status) params.status = status;

    const response = await healthApiClient.get<ApiResponse<CountByRole[]>>(
      "/reports/count-role",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo cantidad de turnos por rol:", error);
    throw error;
  }
};

export const getTurnCountBySpeciality = async (
  start: string,
  end: string,
  speciality?: string,
  status?: string
): Promise<ApiResponse<CountBySpeciality[]>> => {
  try {
    const params: any = { start, end };
    if (speciality) params.speciality = speciality;
    if (status) params.status = status;

    const response = await healthApiClient.get<
      ApiResponse<CountBySpeciality[]>
    >("/reports/count-speciality", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error obteniendo cantidad de turnos por especialidad:",
      error
    );
    throw error;
  }
};
