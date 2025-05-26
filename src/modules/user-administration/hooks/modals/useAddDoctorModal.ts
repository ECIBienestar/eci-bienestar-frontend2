// src/hooks/useAddDoctorModal.ts
import { useState } from "react";
import { createDoctor, DoctorPayload } from "../../services/doctorService";

export function useAddDoctorModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario para “Add Doctor”
  const [doctorId, setDoctorId] = useState<string>("");
  const [doctorIdType, setDoctorIdType] = useState<string>("ANI");
  const [doctorFullName, setDoctorFullName] = useState<string>("");
  const [doctorPhone, setDoctorPhone] = useState<string>("");
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [doctorPassword, setDoctorPassword] = useState<string>("");
  const [doctorRole, setDoctorRole] = useState<"MEDICAL_SECRETARY" | "MEDICAL_STAFF">(
    "MEDICAL_SECRETARY"
  );
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  const openModal = () => {
    setFormError(null);
    setDoctorId("");
    setDoctorIdType("ANI");
    setDoctorFullName("");
    setDoctorPhone("");
    setDoctorEmail("");
    setDoctorPassword("");
    setDoctorRole("MEDICAL_SECRETARY");
    setDoctorSpecialty("");
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
      !doctorId.trim() ||
      !doctorFullName.trim() ||
      !doctorEmail.trim() ||
      !doctorPassword
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
      const payload: DoctorPayload = {
        id: doctorId.trim(),
        idType: doctorIdType,
        fullName: doctorFullName.trim(),
        phone: doctorPhone.trim(),
        email: doctorEmail.trim(),
        role: doctorRole,
        password: doctorPassword,
        specialty: doctorSpecialty.trim() || undefined,
      };
      await createDoctor(payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error creating doctor:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Could not create doctor. Check data or permissions.");
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

    doctorId,
    doctorIdType,
    doctorFullName,
    doctorPhone,
    doctorEmail,
    doctorPassword,
    doctorRole,
    doctorSpecialty,

    setDoctorId,
    setDoctorIdType,
    setDoctorFullName,
    setDoctorPhone,
    setDoctorEmail,
    setDoctorPassword,
    setDoctorRole,
    setDoctorSpecialty,

    handleSubmit,
  };
}
