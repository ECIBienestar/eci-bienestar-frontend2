import { useState, useEffect, ChangeEvent } from "react";
import {
  fetchAllStaff,
  deleteStaff,
  StaffFromApi,
} from "../services/staffService";

export interface StaffListItem {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

export function useStaff() {
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [fullStaff, setFullStaff] = useState<StaffFromApi[]>([]);
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
        const dataFromApi: StaffFromApi[] = await fetchAllStaff();
        setFullStaff(dataFromApi);

        const mapped: StaffListItem[] = dataFromApi.map((s) => ({
          id: Number(s.id),
          name: s.fullName,
          email: s.email,
          isVerified: s.active,
        }));
        setStaff(mapped);
      } catch (err) {
        console.error("Error loading staff:", err);
        setError("Could not load staff. Try again later.");
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
        await deleteStaff(id.toString(), token);
      } catch (e) {
        console.error("Error deleting staff:", e);
      }
    }
    setSelectedIds(new Set());
    setReloadFlag((f) => !f);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCount = filtered.length;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const reload = () => setReloadFlag((f) => !f);

  return {
    fullStaff,
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