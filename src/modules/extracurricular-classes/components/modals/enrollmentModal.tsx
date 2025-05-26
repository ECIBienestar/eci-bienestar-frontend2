import React, { useState } from "react";
import Modal from "../common/modal";
import { Class } from "../../services/classesService";
import { useEnrollUser } from "../../hooks/useEnrollment";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class | null;
  userId: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  classData,
  userId,
}) => {
  const [confirmEnroll, setConfirmEnroll] = useState(false);
  const { mutate, isLoading } = useEnrollUser();

  if (!classData) return null;

  const handleEnroll = async () => {
    try {
      await mutate(userId, classData.id);
      setConfirmEnroll(true);
    } catch (error) {
      console.error("Error al inscribirse:", error);
    }
  };

  const handleClose = () => {
    setConfirmEnroll(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmEnroll ? "¡Inscripción Exitosa!" : `Inscripción a Clase`}
    >
      {confirmEnroll ? (
        <div className="text-center">
          <div className="mb-4 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="mb-4">
            Te has inscrito correctamente a la clase de{" "}
            <strong>{classData.name}</strong>.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-800 hover:bg-purple-900 text-white py-2 px-4 rounded-md"
          >
            Aceptar
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{classData.name}</h2>
            <p className="mb-1">
              <strong>Instructor:</strong>{" "}
              {classData.instructorId || "Por asignar"}
            </p>
            <p className="mb-1">
              <strong>Ubicación:</strong> Coliseo
            </p>
            <p className="mb-1">
              <strong>Categoría:</strong> Desarrollo Humano
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Al inscribirte en esta clase, te comprometes a asistir regularmente.
            Las faltas de asistencia injustificadas pueden resultar en
            penalizaciones.
          </p>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleEnroll}
              className="bg-[#362550] hover:bg-[#362550]-900 text-white py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Confirmar Inscripción"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EnrollmentModal;
