// src/services/teacherService.ts
import apiClient from "../../../common/services/apiCliend";
import { API_USER_URL } from "../lib/config";

/**
 * Interfaz que modela la respuesta de GET /api/users/by-role/TEACHER
 */
export interface TeacherFromApi {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;    // “TEACHER”
  active: boolean;
}

/**
 * Payload para crear un profesor (POST /api/staff).
 * Según tu documentación, este endpoint espera:
 * {
 *   id: "string",
 *   idType: "ANI",
 *   fullName: "string",
 *   phone: "string",
 *   email: "string",
 *   role: "ADMINISTRATOR" | "TEACHER" | …,
 *   password: "string",
 *   specialty?: "GENERAL_MEDICINE" | "DENTISTRY" | …
 * }
 *
 * Para un TEACHER, role siempre debe ser "TEACHER". 
 * Si tu backend no necesita “specialty” para un profesor, puedes omitirlo.
 */
export interface TeacherPayload {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: "TEACHER";
  password: string;
  // Si tu backend acepta un campo “specialty” aunque sea opcional, inclúyelo:
  specialty?: string;
}

/**
 * Payload para actualizar un profesor (PUT /api/users/{id}).
 * Este PUT acepta:
 * {
 *   id: "string",
 *   idType: "ANI",
 *   fullName: "string",
 *   phone: "string",
 *   email: "string",
 *   role: "ADMINISTRATOR" | "TEACHER" | …,
 *   password: "SecureP@ss123"
 * }
 *
 * Para actualizar a un TEACHER, mantén role = "TEACHER".
 * Si no quieres obligar a enviar la contraseña cada vez, hazlo Partial:
 */
export type UpdateTeacherPayload = {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: "TEACHER";
  password: string;
};

/**
 * 1) Recupera todos los profesores (role = TEACHER)
 * GET {API_USER_URL}/users/by-role/TEACHER
 */
export async function fetchAllTeachers(): Promise<TeacherFromApi[]> {
  const resp = await apiClient.get<TeacherFromApi[]>(
    `${API_USER_URL}/users/by-role/TEACHER`
  );
  return resp.data;
}

/**
 * 2) Crea un nuevo profesor
 * POST {API_USER_URL}/staff
 */
export async function createTeacher(
  payload: TeacherPayload,
  token: string
): Promise<TeacherFromApi> {
  const resp = await apiClient.post<TeacherFromApi>(
    `${API_USER_URL}/staff`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * 3) Actualiza datos de un profesor existente
 * PUT {API_USER_URL}/users/{id}
 */
export async function updateTeacher(
  teacherId: string,
  payload: UpdateTeacherPayload,
  token: string
): Promise<TeacherFromApi> {
  const resp = await apiClient.put<TeacherFromApi>(
    `${API_USER_URL}/users/${teacherId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

/**
 * 4) Elimina un profesor por su ID
 * DELETE {API_USER_URL}/users/{id}
 */
export async function deleteTeacher(
  teacherId: string,
  token: string
): Promise<void> {
  await apiClient.delete(`${API_USER_URL}/users/${teacherId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

