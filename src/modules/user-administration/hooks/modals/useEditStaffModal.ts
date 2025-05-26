// src/hooks/useEditStaffModal.ts
import { useState } from "react";
import {
  updateStaff,
  StaffFromApi,
  UpdateStaffPayload,
} from "../../services/staffService";

export function useEditStaffModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario
  const [staffId, setStaffId] = useState<string>("");
  const [staffIdType, setStaffIdType] = useState<string>("");
  const [staffFullName, setStaffFullName] = useState<string>("");
  const [staffPhone, setStaffPhone] = useState<string>("");
  const [staffEmail, setStaffEmail] = useState<string>("");
  const [staffPassword, setStaffPassword] = useState<string>("");
  const [staffRole, setStaffRole] = useState<
    | "GENERAL_SERVICES_STAFF"
    | "PREFECT"
    | "TRAINER"
    | "WELLNESS_STAFF"
    | "MONITOR"
  >("GENERAL_SERVICES_STAFF");
  const [staffSpecialty, setStaffSpecialty] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  const openModal = (staffMember: StaffFromApi) => {
    setFormError(null);
    setStaffId(staffMember.id);
    setStaffIdType(staffMember.idType);
    setStaffFullName(staffMember.fullName);
    setStaffPhone(staffMember.phone);
    setStaffEmail(staffMember.email);
    setStaffRole(staffMember.role);
    setStaffPassword("");
    setStaffSpecialty(staffMember.specialty || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!staffId || !staffFullName.trim() || !staffEmail.trim()) {
      setFormError("Por favor llena los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: UpdateStaffPayload = {
        id: staffId,
        idType: staffIdType,
        fullName: staffFullName.trim(),
        phone: staffPhone.trim(),
        email: staffEmail.trim(),
        role: staffRole,
        password: staffPassword,
        specialty: staffSpecialty.trim() || undefined,
      };
      await updateStaff(staffId, payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error updating staff:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("No se pudo actualizar el personal. Verifica la información o permisos.");
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

    staffId,
    staffIdType,
    staffFullName,
    staffPhone,
    staffEmail,
    staffPassword,
    staffRole,
    staffSpecialty,

    setStaffId,
    setStaffIdType,
    setStaffFullName,
    setStaffPhone,
    setStaffEmail,
    setStaffPassword,
    setStaffRole,
    setStaffSpecialty,

    handleSubmit,
  };
}
