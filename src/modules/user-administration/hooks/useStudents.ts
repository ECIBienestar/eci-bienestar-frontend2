// src/hooks/useStudents.ts
import { useState, useEffect, ChangeEvent } from "react";
import {
  fetchAllStudents,
  createEmergencyContact,
  createStudent,
  deleteStudent,
  StudentFromApi,
  EmergencyContactPayload,
  StudentPayload,
} from "../services/studentService";

export interface ListItemData {
  id: number;
  name: string;
  email: string;
  semester: string;
  isVerified: boolean;
}

export function useStudents() {
  const [students, setStudents] = useState<ListItemData[]>([]);
  const [fullStudents, setFullStudents] = useState<StudentFromApi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [reloadFlag, setReloadFlag] = useState<boolean>(false);

  const token = localStorage.getItem("authToken") || "";

  // Cargar estudiantes al montar o cuando cambie reloadFlag
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataFromApi: StudentFromApi[] = await fetchAllStudents();
        setFullStudents(dataFromApi);
        const mapped: ListItemData[] = dataFromApi.map((stu) => ({
          id: Number(stu.id),
          name: stu.fullName,
          email: stu.email,
          semester: `${stu.semester}° Semestre`,
          isVerified: stu.active,
        }));
        setStudents(mapped);
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Could not load students. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [reloadFlag, token]);

  // Toggle de selección
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  // Eliminar seleccionados (llama al backend y recarga)
  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    for (let id of Array.from(selectedIds)) {
      try {
        await deleteStudent(id.toString(), token);
      } catch (e) {
        console.error("Error deleting student:", e);
      }
    }
    setSelectedIds(new Set());
    setReloadFlag((f) => !f);
  };

  // Filtrado y paginación
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCount = filtered.length; // <-- Agregado

  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return {
    students,
    fullStudents,
    isLoading,
    error,
    query,
    handleSearchChange,
    currentPage,
    totalPages,
    displayed,
    handlePrev,
    handleNext,
    filteredCount,      // <-- Devolvemos filteredCount
    selectedIds,
    toggleSelect,
    deleteSelected,
    reload: () => setReloadFlag((f) => !f),
  };
}

/**
 * Hook para manejar el estado del modal de “Add Student”
 */
export function useAddStudentModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario
  const [ecFullName, setEcFullName] = useState<string>("");
  const [ecPhone, setEcPhone] = useState<string>("");
  const [ecIdType, setEcIdType] = useState<string>("ANI");
  const [ecIdNumber, setEcIdNumber] = useState<string>("");
  const [ecRelationship, setEcRelationship] = useState<string>("AUNT");

  const [stuId, setStuId] = useState<string>("");
  const [stuIdType, setStuIdType] = useState<string>("ANI");
  const [stuFullName, setStuFullName] = useState<string>("");
  const [stuPhone, setStuPhone] = useState<string>("");
  const [stuEmail, setStuEmail] = useState<string>("");
  const [stuRole, setStuRole] = useState<string>("ADMINISTRATOR");
  const [stuPassword, setStuPassword] = useState<string>("");
  const [stuCode, setStuCode] = useState<string>("");
  const [stuProgram, setStuProgram] = useState<string>("SOFTWARE_ENGINEERING");
  const [stuSemester, setStuSemester] = useState<number>(1);
  const [stuBirthDate, setStuBirthDate] = useState<string>("");
  const [stuAddress, setStuAddress] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  const openModal = () => {
    setFormError(null);
    setEcFullName("");
    setEcPhone("");
    setEcIdType("ANI");
    setEcIdNumber("");
    setEcRelationship("AUNT");
    setStuId("");
    setStuIdType("ANI");
    setStuFullName("");
    setStuPhone("");
    setStuEmail("");
    setStuRole("ADMINISTRATOR");
    setStuPassword("");
    setStuCode("");
    setStuProgram("SOFTWARE_ENGINEERING");
    setStuSemester(1);
    setStuBirthDate("");
    setStuAddress("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Validaciones básicas
    if (!ecFullName || !ecPhone || !ecIdNumber) {
      setFormError("Please fill in all emergency-contact fields.");
      setIsSubmitting(false);
      return;
    }
    if (!stuId || !stuFullName || !stuEmail || !stuPassword) {
      setFormError("Please fill in all required student fields.");
      setIsSubmitting(false);
      return;
    }
    if (!token) {
      setFormError("No se encontró token. Vuelve a iniciar sesión.");
      setIsSubmitting(false);
      return;
    }

    // Crear contacto de emergencia
    let createdECid: number;
    try {
      const ecPayload: EmergencyContactPayload = {
        fullName: ecFullName.trim(),
        phone: ecPhone.trim(),
        idType: ecIdType,
        idNumber: ecIdNumber.trim(),
        relationship: ecRelationship,
      };
      const ecResp = await createEmergencyContact(ecPayload);
      createdECid = ecResp.id;
    } catch (err) {
      console.error("Error creating emergency contact:", err);
      setFormError("Could not create emergency contact. Try again.");
      setIsSubmitting(false);
      return;
    }

    // Crear estudiante
    try {
      const stuPayload: StudentPayload = {
        id: stuId.trim(),
        idType: stuIdType,
        fullName: stuFullName.trim(),
        phone: stuPhone.trim(),
        email: stuEmail.trim(),
        role: stuRole,
        password: stuPassword,
        studentCode: stuCode.trim(),
        program: stuProgram,
        semester: stuSemester,
        birthDate: stuBirthDate,
        address: stuAddress.trim(),
        emergencyContactId: createdECid,
      };
      await createStudent(stuPayload,);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error creating student:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Could not create student. Check data or permissions.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showModal,
    openModal,
    closeModal,
    isSubmitting,
    formError,

    ecFullName,
    ecPhone,
    ecIdType,
    ecIdNumber,
    ecRelationship,

    stuId,
    stuIdType,
    stuFullName,
    stuPhone,
    stuEmail,
    stuRole,
    stuPassword,
    stuCode,
    stuProgram,
    stuSemester,
    stuBirthDate,
    stuAddress,

    setEcFullName,
    setEcPhone,
    setEcIdType,
    setEcIdNumber,
    setEcRelationship,

    setStuId,
    setStuIdType,
    setStuFullName,
    setStuPhone,
    setStuEmail,
    setStuRole,
    setStuPassword,
    setStuCode,
    setStuProgram,
    setStuSemester,
    setStuBirthDate,
    setStuAddress,

    handleSubmit,
  };
}

