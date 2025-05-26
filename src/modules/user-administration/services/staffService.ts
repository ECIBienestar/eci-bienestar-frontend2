import apiClient from "../../../common/services/apiCliend";
import { API_USER_URL } from "../lib/config";

/**
 * Modela la respuesta de GET /api/users/by-role/{role} para staff
 */
export interface StaffFromApi {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role:
    | "GENERAL_SERVICES_STAFF"
    | "PREFECT"
    | "TRAINER"
    | "WELLNESS_STAFF"
    | "MONITOR";
  active: boolean;
  specialty?: string;
}

/**
 * Payload para crear staff (POST /api/staff)
 */
export interface StaffPayload {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role:
    | "GENERAL_SERVICES_STAFF"
    | "PREFECT"
    | "TRAINER"
    | "WELLNESS_STAFF"
    | "MONITOR";
  password: string;
  specialty?: string;
}

/**
 * Payload para actualizar staff (PUT /api/users/{id})
 */
export type UpdateStaffPayload = {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role:
    | "GENERAL_SERVICES_STAFF"
    | "PREFECT"
    | "TRAINER"
    | "WELLNESS_STAFF"
    | "MONITOR";
  password: string;
  specialty?: string;
};

/** Funciones para cada rol */
export async function fetchGeneralServicesStaff(): Promise<StaffFromApi[]> {
  const resp = await apiClient.get<StaffFromApi[]>(
    `${API_USER_URL}/users/by-role/GENERAL_SERVICES_STAFF`
  );
  return resp.data;
}

export async function fetchPrefects(): Promise<StaffFromApi[]> {
  const resp = await apiClient.get<StaffFromApi[]>(
    `${API_USER_URL}/users/by-role/PREFECT`
  );
  return resp.data;
}

export async function fetchTrainers(): Promise<StaffFromApi[]> {
  const resp = await apiClient.get<StaffFromApi[]>(
    `${API_USER_URL}/users/by-role/TRAINER`
  );
  return resp.data;
}

export async function fetchWellnessStaff(): Promise<StaffFromApi[]> {
  const resp = await apiClient.get<StaffFromApi[]>(
    `${API_USER_URL}/users/by-role/WELLNESS_STAFF`
  );
  return resp.data;
}

export async function fetchMonitors(): Promise<StaffFromApi[]> {
  const resp = await apiClient.get<StaffFromApi[]>(
    `${API_USER_URL}/users/by-role/MONITOR`
  );
  return resp.data;
}

/**
 * Combina todos los roles de staff
 */
export async function fetchAllStaff(): Promise<StaffFromApi[]> {
  const [
    general,
    prefects,
    trainers,
    wellness,
    monitors,
  ] = await Promise.all([
    fetchGeneralServicesStaff(),
    fetchPrefects(),
    fetchTrainers(),
    fetchWellnessStaff(),
    fetchMonitors(),
  ]);
  return [...general, ...prefects, ...trainers, ...wellness, ...monitors];
}

/**
 * Crea un nuevo miembro de staff (cualquiera de los roles)
 * POST /api/staff
 */
export async function createStaff(
  payload: StaffPayload,
  token: string
): Promise<StaffFromApi> {
  const resp = await apiClient.post<StaffFromApi>(
    `${API_USER_URL}/staff`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * Actualiza un miembro de staff
 * PUT /api/users/{id}
 */
export async function updateStaff(
  staffId: string,
  payload: UpdateStaffPayload,
  token: string
): Promise<StaffFromApi> {
  const resp = await apiClient.put<StaffFromApi>(
    `${API_USER_URL}/users/${staffId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * Elimina un miembro de staff por ID
 * DELETE /api/users/{id}
 */
export async function deleteStaff(
  staffId: string,
  token: string
): Promise<void> {
  await apiClient.delete(`${API_USER_URL}/users/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}