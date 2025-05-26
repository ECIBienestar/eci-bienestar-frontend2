// src/hooks/useEditTeacherModal.ts
import { useState } from "react";
import {
  updateTeacher,
  TeacherFromApi,
  UpdateTeacherPayload,
} from "../../services/teacherService";

export function useEditTeacherModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario
  const [teacherId, setTeacherId] = useState<string>("");
  const [teacherIdType, setTeacherIdType] = useState<string>("");
  const [teacherFullName, setTeacherFullName] = useState<string>("");
  const [teacherPhone, setTeacherPhone] = useState<string>("");
  const [teacherEmail, setTeacherEmail] = useState<string>("");
  const [teacherRole, setTeacherRole] = useState<"TEACHER">("TEACHER");
  const [teacherPassword, setTeacherPassword] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  // Al abrir el modal, precargamos datos del profesor
  const openModal = (teacher: TeacherFromApi) => {
    setFormError(null);
    setTeacherId(teacher.id);
    setTeacherIdType(teacher.idType);
    setTeacherFullName(teacher.fullName);
    setTeacherPhone(teacher.phone);
    setTeacherEmail(teacher.email);
    setTeacherRole("TEACHER");
    // Suponemos que no se muestra la contraseña actual; si se edita, la ingresa aquí
    setTeacherPassword("");
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
    if (!teacherId || !teacherFullName.trim() || !teacherEmail.trim()) {
      setFormError("Por favor llena los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: UpdateTeacherPayload = {
        id: teacherId,
        idType: teacherIdType,
        fullName: teacherFullName.trim(),
        phone: teacherPhone.trim(),
        email: teacherEmail.trim(),
        role: teacherRole,
        password: teacherPassword, // Si no se modifica, puede quedar vacío según backend
      };
      await updateTeacher(teacherId, payload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error updating teacher:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError(
          "No se pudo actualizar el profesor. Verifica la información o permisos."
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

    teacherId,
    teacherIdType,
    teacherFullName,
    teacherPhone,
    teacherEmail,
    teacherRole,
    teacherPassword,

    setTeacherId,
    setTeacherIdType,
    setTeacherFullName,
    setTeacherPhone,
    setTeacherEmail,
    setTeacherRole,
    setTeacherPassword,

    handleSubmit,
  };
}
