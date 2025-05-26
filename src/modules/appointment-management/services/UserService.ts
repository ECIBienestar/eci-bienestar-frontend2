import apiClient from "@/common/services/apiClient";
import { UserExternalResponse } from "@modules/appointment-management/types/dto";

export const checkUserExists = async (
  id: string
): Promise<UserExternalResponse | null> => {
  try {
    const response = await apiClient.get<UserExternalResponse>(
      `users-controll/users/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error al verificar el usuario:", error);
    throw error;
  }
};
