// src/hooks/useAddTeacherModal.ts
import { useState } from "react";
import { createTeacher, TeacherPayload } from "../../services/teacherService";

export function useAddTeacherModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario para “Add Teacher”
  const [teacherId, setTeacherId] = useState<string>("");
  const [teacherIdType, setTeacherIdType] = useState<string>("ANI");
  const [teacherFullName, setTeacherFullName] = useState<string>("");
  const [teacherPhone, setTeacherPhone] = useState<string>("");
  const [teacherEmail, setTeacherEmail] = useState<string>("");
  const [teacherPassword, setTeacherPassword] = useState<string>("");
  const [teacherSpecialty, setTeacherSpecialty] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  const openModal = () => {
    setFormError(null);
    setTeacherId("");
    setTeacherIdType("ANI");
    setTeacherFullName("");
    setTeacherPhone("");
    setTeacherEmail("");
    setTeacherPassword("");
    setTeacherSpecialty("");
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
    if (!teacherId.trim() || !teacherFullName.trim() || !teacherEmail.trim() || !teacherPassword) {
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
      const payload: TeacherPayload = {
        id: teacherId.trim(),
        idType: teacherIdType,
        fullName: teacherFullName.trim(),
        phone: teacherPhone.trim(),
        email: teacherEmail.trim(),
        role: "TEACHER",
        password: teacherPassword,
        specialty: teacherSpecialty.trim() || undefined,
      };
      await createTeacher(payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error creating teacher:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Could not create teacher. Check data or permissions.");
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

    teacherId,
    teacherIdType,
    teacherFullName,
    teacherPhone,
    teacherEmail,
    teacherPassword,
    teacherSpecialty,

    setTeacherId,
    setTeacherIdType,
    setTeacherFullName,
    setTeacherPhone,
    setTeacherEmail,
    setTeacherPassword,
    setTeacherSpecialty,

    handleSubmit,
  };
}
