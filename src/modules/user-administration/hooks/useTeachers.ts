// src/hooks/useTeachers.ts
import { useState, useEffect, ChangeEvent } from "react";
import {
  fetchAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  TeacherFromApi,
  TeacherPayload,
  UpdateTeacherPayload,
} from "../services/teacherService";

export interface TeacherListItem {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [fullTeachers, setFullTeachers] = useState<TeacherFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);

  const token = localStorage.getItem("authToken") || "";

  // 1. Cargar lista de profesores al montar o cuando cambie reloadFlag
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataFromApi: TeacherFromApi[] = await fetchAllTeachers();
        setFullTeachers(dataFromApi);

        const mapped: TeacherListItem[] = dataFromApi.map((t) => ({
          id: Number(t.id),
          name: t.fullName,
          email: t.email,
          isVerified: t.active,
        }));
        setTeachers(mapped);
      } catch (err) {
        console.error("Error loading teachers:", err);
        setError("Could not load teachers. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [reloadFlag, token]);

  // 2. Selección individual/múltiple
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  // 3. Eliminar los seleccionados (DELETE en bucle)
  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    for (let id of Array.from(selectedIds)) {
      try {
        await deleteTeacher(id.toString(), token);
      } catch (e) {
        console.error("Error deleting teacher:", e);
      }
    }
    setSelectedIds(new Set());
    setReloadFlag((f) => !f);
  };

  // 4. Filtrado/ búsqueda
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCount = filtered.length;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // 5. Función para recargar
  const reload = () => setReloadFlag((f) => !f);

  return {
    fullTeachers,
    isLoading,
    error,
    query,
    handleSearchChange,
    currentPage,
    totalPages,
    displayed,
    handlePrev,
    handleNext,
    filteredCount,
    selectedIds,
    toggleSelect,
    deleteSelected,
    reload,
  };
}

