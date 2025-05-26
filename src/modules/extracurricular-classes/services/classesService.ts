import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

interface Resource {
  nombre: string;
  cantidad: number;
}

export interface Class {
  id: string;
  name: string;
  type: string | null;
  repetition: string | null;
  resources: Resource[] | null;
  instructorId: string | null;
  startTime: string;
  maxStudents: number;
  endTime: string;
  endTimeRepetition: string | null;
  sessions?: Array<{  // Añade esta propiedad
    day: string;
    startTime: string;
    endTime: string;
  }>;
}

const CLASSES_URL = `${API_BASE_URL}/classes`;

// Obtener todas las clases
export const getAllClasses = async (): Promise<Class[]> => {
  const response = await axios.get(CLASSES_URL);
  return response.data;
};

// Obtener clase por ID
// services/classesService.ts
export const getClassById = async (classId: string): Promise<Class> => {
  try {
    const response = await axios.get(`${CLASSES_URL}/class`, {
      params: { 
        classId: classId  
      }
    });
    
    if (!response.data) {
      throw new Error('No se recibieron datos de la clase');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching class:', error);
    throw error;
  }
};

// Obtener clases por tipo
export const getClassesByType = async (classType: string): Promise<Class[]> => {
  const response = await axios.get(`${CLASSES_URL}/type`, {
    params: { classType }
  });
  return response.data;
};

// Crear una nueva clase
export const createClass = async (classData: Class): Promise<Class> => {
  const response = await axios.post(CLASSES_URL, classData);
  return response.data;
};

// Actualizar una clase existente
export const updateClass = async (classData: Class): Promise<Class> => {
  const response = await axios.put(`${CLASSES_URL}/update`, classData, {
    params: { id: classData.id }
  });
  return response.data;
};

// Eliminar una clase
export const deleteClass = async (id: string): Promise<void> => {
  await axios.delete(`${CLASSES_URL}/delete`, {
    params: { id }
  });
};