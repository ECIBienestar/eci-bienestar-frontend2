// src/hooks/useAddStaffModal.ts
import { useState } from "react";
import { createStaff, StaffPayload } from "../../services/staffService";

export function useAddStaffModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario para “Add Staff”
  const [staffId, setStaffId] = useState<string>("");
  const [staffIdType, setStaffIdType] = useState<string>("ANI");
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

  const openModal = () => {
    setFormError(null);
    setStaffId("");
    setStaffIdType("ANI");
    setStaffFullName("");
    setStaffPhone("");
    setStaffEmail("");
    setStaffPassword("");
    setStaffRole("GENERAL_SERVICES_STAFF");
    setStaffSpecialty("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (
      !staffId.trim() ||
      !staffFullName.trim() ||
      !staffEmail.trim() ||
      !staffPassword
    ) {
      setFormError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    if (!token) {
      setFormError("No token found. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: StaffPayload = {
        id: staffId.trim(),
        idType: staffIdType,
        fullName: staffFullName.trim(),
        phone: staffPhone.trim(),
        email: staffEmail.trim(),
        role: staffRole,
        password: staffPassword,
        specialty: staffSpecialty.trim() || undefined,
      };
      await createStaff(payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error creating staff:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Could not create staff. Check data or permissions.");
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
