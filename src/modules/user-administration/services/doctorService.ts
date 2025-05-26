// src/services/doctorService.ts
import apiClient from "../../../common/services/apiCliend";
import { API_USER_URL } from "../lib/config";

/**
 * Interfaz que modela la respuesta de GET /api/users/by-role/{role}
 */
export interface DoctorFromApi {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: "MEDICAL_SECRETARY" | "MEDICAL_STAFF";
  active: boolean;
  specialty?: string;
}

/**
 * Payload para crear un doctor (POST /api/staff).
 * El campo `role` debe ser "MEDICAL_SECRETARY" o "MEDICAL_STAFF".
 */
export interface DoctorPayload {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: "MEDICAL_SECRETARY" | "MEDICAL_STAFF";
  password: string;
  specialty?: string;
}

/**
 * Payload para actualizar un doctor (PUT /api/users/{id}).
 * En el backend espera los mismos campos, incluyendo role y password.
 */
export type UpdateDoctorPayload = {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: "MEDICAL_SECRETARY" | "MEDICAL_STAFF";
  password: string;
  specialty?: string;
};

/**
 * 1) Recupera todos los usuarios con role = MEDICAL_SECRETARY
 * GET {API_USER_URL}/users/by-role/MEDICAL_SECRETARY
 */
export async function fetchAllSecretaries(): Promise<DoctorFromApi[]> {
  const resp = await apiClient.get<DoctorFromApi[]>(
    `${API_USER_URL}/users/by-role/MEDICAL_SECRETARY`
  );
  return resp.data;
}

/**
 * 2) Recupera todos los usuarios con role = MEDICAL_STAFF
 * GET {API_USER_URL}/users/by-role/MEDICAL_STAFF
 */
export async function fetchAllStaff(): Promise<DoctorFromApi[]> {
  const resp = await apiClient.get<DoctorFromApi[]>(
    `${API_USER_URL}/users/by-role/MEDICAL_STAFF`
  );
  return resp.data;
}

/**
 * 3) Recupera todos los “doctores” combinando ambos roles
 */
export async function fetchAllDoctors(): Promise<DoctorFromApi[]> {
  const [secretaries, staff] = await Promise.all([
    fetchAllSecretaries(),
    fetchAllStaff(),
  ]);
  return [...secretaries, ...staff];
}

/**
 * 4) Crea un nuevo doctor (secretary o staff)
 * POST {API_USER_URL}/staff
 */
export async function createDoctor(
  payload: DoctorPayload,
  token: string
): Promise<DoctorFromApi> {
  const resp = await apiClient.post<DoctorFromApi>(
    `${API_USER_URL}/staff`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * 5) Actualiza datos de un doctor existente
 * PUT {API_USER_URL}/users/{id}
 */
export async function updateDoctor(
  doctorId: string,
  payload: UpdateDoctorPayload,
  token: string
): Promise<DoctorFromApi> {
  const resp = await apiClient.put<DoctorFromApi>(
    `${API_USER_URL}/users/${doctorId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * 6) Elimina un doctor por su ID
 * DELETE {API_USER_URL}/users/{id}
 */
export async function deleteDoctor(
  doctorId: string,
  token: string
): Promise<void> {
  await apiClient.delete(`${API_USER_URL}/users/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
