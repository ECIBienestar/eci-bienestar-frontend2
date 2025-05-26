// src/hooks/useEditDoctorModal.ts
import { useState } from "react";
import {
  updateDoctor,
  DoctorFromApi,
  UpdateDoctorPayload,
} from "../../services/doctorService";

export function useEditDoctorModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario
  const [doctorId, setDoctorId] = useState<string>("");
  const [doctorIdType, setDoctorIdType] = useState<string>("");
  const [doctorFullName, setDoctorFullName] = useState<string>("");
  const [doctorPhone, setDoctorPhone] = useState<string>("");
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [doctorPassword, setDoctorPassword] = useState<string>("");
  const [doctorRole, setDoctorRole] = useState<"MEDICAL_SECRETARY" | "MEDICAL_STAFF">(
    "MEDICAL_SECRETARY"
  );
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  const openModal = (doctor: DoctorFromApi) => {
    setFormError(null);
    setDoctorId(doctor.id);
    setDoctorIdType(doctor.idType);
    setDoctorFullName(doctor.fullName);
    setDoctorPhone(doctor.phone);
    setDoctorEmail(doctor.email);
    setDoctorRole(doctor.role);
    setDoctorPassword("");
    setDoctorSpecialty(doctor.specialty || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!doctorId || !doctorFullName.trim() || !doctorEmail.trim()) {
      setFormError("Por favor llena los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: UpdateDoctorPayload = {
        id: doctorId,
        idType: doctorIdType,
        fullName: doctorFullName.trim(),
        phone: doctorPhone.trim(),
        email: doctorEmail.trim(),
        role: doctorRole,
        password: doctorPassword,
        specialty: doctorSpecialty.trim() || undefined,
      };
      await updateDoctor(doctorId, payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error updating doctor:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError(
          "No se pudo actualizar el doctor. Verifica la información o permisos."
        );
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
