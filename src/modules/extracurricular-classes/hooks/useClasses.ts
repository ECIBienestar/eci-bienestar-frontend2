import { useState, useEffect } from 'react';
import {
  Class,
  getAllClasses,
  getClassById,
  getClassesByType,
  createClass,
  updateClass,
  deleteClass,
} from '../services/classesService';

// Hook para obtener todas las clases
export const useAllClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getAllClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las clases');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, refresh: fetchClasses };
};

// Hook para obtener una clase por ID
export const useClassById = (classId: string) => {
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = async (id: string) => {
    try {
      setLoading(true);
      const data = await getClassById(id);
      setClassData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la clase');
      setClassData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClass(classId);
    } else {
      setClassData(null);
      setLoading(false);
    }
  }, [classId]);

  return { classData, loading, error, refresh: fetchClass };
};

// Hook para obtener clases por tipo
export const useClassesByType = (classType: string) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassesByType = async (type: string) => {
    try {
      setLoading(true);
      const data = await getClassesByType(type);
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clases por tipo');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classType) {
      fetchClassesByType(classType);
    } else {
      setClasses([]);
      setLoading(false);
    }
  }, [classType]);

  return { classes, loading, error, refresh: fetchClassesByType };
};

// Hook para crear una nueva clase
export const useCreateClass = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createNewClass = async (classData: Omit<Class, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const created = await createClass(classData as Class);
      setSuccess(true);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la clase');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNewClass, loading, error, success, reset: () => {
    setError(null);
    setSuccess(false);
  } };
};

// Hook para actualizar una clase
export const useUpdateClass = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateExistingClass = async (classData: Class) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const updated = await updateClass(classData);
      setSuccess(true);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la clase');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateExistingClass, loading, error, success, reset: () => {
    setError(null);
    setSuccess(false);
  } };
};

// Hook para eliminar una clase
export const useDeleteClass = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteExistingClass = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await deleteClass(id);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la clase');
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteExistingClass, loading, error, success, reset: () => {
    setError(null);
    setSuccess(false);
  } };
};