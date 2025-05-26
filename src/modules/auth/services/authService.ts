// src/services/authService.ts
import apiClient from "../../../common/services/apiCliend";
import { API_AUTH_URL } from "../lib/config";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  type: "Bearer" | string;
  id: string;
  fullName: string;
  email: string;
  role: string;
  specialty?: string;
}

/**
 * Llama a POST https://.../auth/login
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  // Construimos la ruta completa usando API_AUTH_URL
  const url = `${API_AUTH_URL}/login`;
  const response = await apiClient.post<LoginResponse>(url, {
    username,
    password,
  });
  return response.data;
}

// Por ahora no implementamos el registro, pero lo dejamos aquí como referencia
export async function requestPasswordReset(
  email: string
): Promise<{ message: string }> {
  // Si quisieras simular retraso:
  // return new Promise(resolve =>
  //   setTimeout(() => resolve({ message: "Correo de recuperación enviado." }), 1000)
  // );

  // Por ahora devolvemos un objeto con mensaje fijo:
  return Promise.resolve({ message: "Si el correo existe, recibirás instrucciones." });
}
