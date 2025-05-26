// src/modules/extracurricular-classes/components/student/CancelEnrollmentButton.tsx
import React, { useState } from 'react';

interface CancelEnrollmentButtonProps {
  classId: string;
  onCancel: (classId: string) => Promise<boolean>;
}

const CancelEnrollmentButton: React.FC<CancelEnrollmentButtonProps> = ({ classId, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu inscripción a esta clase?')) {
      setIsLoading(true);
      try {
        await onCancel(classId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="text-[#362550] hover:text-red-600 p-2 rounded-md transition-colors"
      title="Cancelar inscripción"
    >

      {isLoading ? (
        <span className="inline-block animate-spin">⌛</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      )}
    </button>
  );
};

export default CancelEnrollmentButton;