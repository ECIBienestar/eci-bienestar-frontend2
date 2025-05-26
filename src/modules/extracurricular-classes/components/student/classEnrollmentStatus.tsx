// src/modules/extracurricular-classes/components/student/ClassEnrollmentStatus.tsx
import React from 'react';

interface ClassEnrollmentStatusProps {
  isConfirmed: boolean;
}

const ClassEnrollmentStatus: React.FC<ClassEnrollmentStatusProps> = ({ isConfirmed }) => {
  return (
    <div className="flex items-center">
      <div 
        className={`w-4 h-4 rounded-full mr-2 ${isConfirmed ? 'bg-green-500' : 'bg-yellow-500'}`}
      ></div>
      <span>{isConfirmed ? 'Asistencia confirmada' : 'Por confirmar'}</span>
    </div>
  );
};

export default ClassEnrollmentStatus;