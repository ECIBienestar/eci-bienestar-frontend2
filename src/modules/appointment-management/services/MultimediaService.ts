import { CreateMultimediaRequest } from "@/modules/appointment-management/types/dto/request/CreateMultimediaRequest";
import { MultimediaResponse } from "@/modules/appointment-management/types/dto/response/MultimediaResponse";
import { ApiResponse, TurnResponse } from "../types/dto";
import healthApiClient from "./healthApiClient";

export const uploadMultimedia = async (
  data: CreateMultimediaRequest
): Promise<ApiResponse<void>> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", data.file);
    formData.append("duration", data.duration.toString());
    formData.append("type", data.type);

    const response = await healthApiClient.post("/multimedia", formData);
    return response.data;
  } catch (error) {
    console.error("Error subiendo multimedia:", error);
    throw error;
  }
};

export const getMultimediaById = async (
  id: number
): Promise<ApiResponse<TurnResponse>> => {
  try {
    const response = await healthApiClient.get<ApiResponse<TurnResponse>>(
      `/multimedia/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo multimedia por ID:", error);
    throw error;
  }
};

export const getAllMultimedia = async (): Promise<
  ApiResponse<MultimediaResponse[]>
> => {
  try {
    const response = await healthApiClient.get<
      ApiResponse<MultimediaResponse[]>
    >("/multimedia");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo multimedia:", error);
    throw error;
  }
};

export const deleteMultimedia = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await healthApiClient.delete<ApiResponse<void>>(
      `/multimedia/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error eliminando multimedia:", error);
    throw error;
  }
};
