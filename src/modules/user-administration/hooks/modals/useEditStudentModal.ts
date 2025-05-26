// src/hooks/useEditStudentModal.ts
import { useState, useEffect } from "react";
import { updateStudent, StudentFromApi, StudentPayload } from "../../services/studentService";

export function useEditStudentModal(onSuccess: () => void) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos del formulario (se inicializan vacíos, pero se precargarán al abrir el modal)
  const [stuId, setStuId] = useState<string>("");
  const [stuIdType, setStuIdType] = useState<string>("");
  const [stuFullName, setStuFullName] = useState<string>("");
  const [stuPhone, setStuPhone] = useState<string>("");
  const [stuEmail, setStuEmail] = useState<string>("");
  const [stuRole, setStuRole] = useState<string>("ADMINISTRATOR");
  const [stuPassword, setStuPassword] = useState<string>("");
  const [stuCode, setStuCode] = useState<string>("");
  const [stuProgram, setStuProgram] = useState<string>("");
  const [stuSemester, setStuSemester] = useState<number>(1);
  const [stuBirthDate, setStuBirthDate] = useState<string>("");
  const [stuAddress, setStuAddress] = useState<string>("");

  const token = localStorage.getItem("authToken") || "";

  // Al abrir el modal se reciben y precargan los datos del estudiante
  const openModal = (student: StudentFromApi) => {
    setFormError(null);
    setStuId(student.id);
    setStuIdType(student.idType);
    setStuFullName(student.fullName);
    setStuPhone(student.phone);
    setStuEmail(student.email);
    // Suponiendo que para edición no se modifique la contraseña vía este modal;
    // de lo contrario, incluirla en el formulario si es el caso.
    setStuPassword(""); 
    setStuCode(student.studentCode);
    setStuProgram(student.program);
    setStuSemester(student.semester);
    setStuBirthDate(student.birthDate);
    setStuAddress(student.address);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Validaciones básicas: se pueden agregar más validaciones según necesidad
    if (!stuId || !stuFullName || !stuEmail) {
      setFormError("Por favor llena todos los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const stuPayload: StudentPayload = {
        id: stuId,
        idType: stuIdType,
        fullName: stuFullName.trim(),
        phone: stuPhone.trim(),
        email: stuEmail.trim(),
        role: stuRole,
        password: stuPassword, // Considera si la contraseña debe actualizarse o no
        studentCode: stuCode.trim(),
        program: stuProgram,
        semester: stuSemester,
        birthDate: stuBirthDate,
        address: stuAddress.trim(),
        emergencyContactId: 0, // Si no vas a editar el contacto de emergencia aquí, este valor podría mantenerse igual o eliminarse según la lógica de actualización.
      };
      await updateStudent(stuId, stuPayload, token);
      onSuccess();
      closeModal();
    } catch (err: any) {
      console.error("Error updating student:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("No se pudo actualizar el estudiante. Verifica la información o los permisos.");
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
