// src/hooks/useDoctors.ts
import { useState, useEffect, ChangeEvent } from "react";
import {
  fetchAllDoctors,
  deleteDoctor,
  DoctorFromApi,
} from "../services/doctorService"; 

export interface DoctorListItem {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [fullDoctors, setFullDoctors] = useState<DoctorFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);

  const token = localStorage.getItem("authToken") || "";

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataFromApi: DoctorFromApi[] = await fetchAllDoctors();
        setFullDoctors(dataFromApi);

        const mapped: DoctorListItem[] = dataFromApi.map((d) => ({
          id: Number(d.id),
          name: d.fullName,
          email: d.email,
          isVerified: d.active,
        }));
        setDoctors(mapped);
      } catch (err) {
        console.error("Error loading doctors:", err);
        setError("Could not load doctors. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [reloadFlag, token]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    for (let id of Array.from(selectedIds)) {
      try {
        await deleteDoctor(id.toString(), token);
      } catch (e) {
        console.error("Error deleting doctor:", e);
      }
    }
    setSelectedIds(new Set());
    setReloadFlag((f) => !f);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCount = filtered.length;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const reload = () => setReloadFlag((f) => !f);

  return {
    fullDoctors,
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
