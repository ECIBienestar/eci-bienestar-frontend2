// src/services/studentService.ts
import apiClient from "../../../common/services/apiCliend";
import { API_USER_URL } from "../lib/config";

export interface EmergencyContactPayload {
  fullName: string;
  phone: string;
  idType: string;
  idNumber: string;
  relationship: string;
}

export interface StudentPayload {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  password: string;
  studentCode: string;
  program: string;
  semester: number;
  birthDate: string;
  address: string;
  emergencyContactId: number;
}

export interface StudentFromApi {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  active: boolean;
  studentCode: string;
  program: string;
  semester: number;
  birthDate: string;
  address: string;
  emergencyContact: {
    id: number;
    fullName: string;
    phone: string;
    idType: string;
    idNumber: string;
    relationship: string;
  };
}

/**
 * Obtiene la lista completa de estudiantes desde GET /users-controll/students
 */
export async function fetchAllStudents(): Promise<StudentFromApi[]> {
  const resp = await apiClient.get<StudentFromApi[]>(`${API_USER_URL}/students`);
  return resp.data;
}

/**
 * Crea un contacto de emergencia: POST /users-controll/emergency-contacts
 */
export async function createEmergencyContact(
  payload: EmergencyContactPayload,
): Promise<{ id: number }> {
  const resp = await apiClient.post<{ id: number }>(
    `${API_USER_URL}/emergency-contacts`,
    payload
  );
  return resp.data;
}

/**
 * Crea un nuevo estudiante: POST /users-controll/students
 */
export async function createStudent(
  payload: StudentPayload,
): Promise<StudentFromApi> {
  const resp = await apiClient.post<StudentFromApi>(
    `${API_USER_URL}/students`,
    payload
  );
  return resp.data;
}

/**
 * Elimina un estudiante por ID
 * DELETE /users-controll/students/{id}
 */
export async function deleteStudent(
  studentId: string,
  token: string
): Promise<void> {
  await apiClient.delete(`${API_USER_URL}/students/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Actualiza los datos de un estudiante existente
 * PUT /students/{id}
 */
export async function updateStudent(
  studentId: string,
  payload: StudentPayload,
  token: string
): Promise<StudentFromApi> {
  const resp = await apiClient.put<StudentFromApi>(
    `${API_USER_URL}/students/${studentId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}
