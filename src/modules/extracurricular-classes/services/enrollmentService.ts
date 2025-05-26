import { API_BASE_URL } from '../lib/config';

const INSCRIPTIONS_URL = `${API_BASE_URL}/inscriptions`;

// Inscribir a un usuario en una clase
export const enrollUser = async (userId: string, classId: string) => {
  const url = new URL(`${INSCRIPTIONS_URL}/inscribe`);
  url.searchParams.append('userId', userId);
  url.searchParams.append('classId', classId);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  return response.json();
};

//Obtener mis inscripciones 
export const getMyInscriptions = async (userId: string) => {
  const url = new URL(`${INSCRIPTIONS_URL}/my-inscriptions`);
  url.searchParams.append('userId', userId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 204) {
      return []; // No hay inscripciones pendientes
    }
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json();
};


// Obtener todas las inscripciones (general)
export const getInscriptions = async () => {
  const response = await fetch(INSCRIPTIONS_URL);
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  return response.json();
};

// Eliminar una inscripción
export const deleteInscription = async (userId: string, classId: string) => {
  const url = new URL(`${INSCRIPTIONS_URL}/delete`);
  url.searchParams.append('userId', userId);
  url.searchParams.append('classId', classId);
  
  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  return response.json();
};