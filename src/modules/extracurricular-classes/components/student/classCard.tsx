import React from 'react';
import { Class } from '../../services/classesService';

interface ClassCardProps {
  classData: Class;
  onEnroll: (classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onEnroll }) => {
  // Format the schedule from sessions if available
  const formattedSchedule = classData.sessions
    ? classData.sessions.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')
    : `${classData.startTime} - ${classData.endTime}`; // Fallback to direct times if no sessions

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{classData.name}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <p><span className="font-medium">Instructor:</span> {classData.instructorId}</p>
          <p><span className="font-medium">Horario:</span> {formattedSchedule}</p>
          <p><span className="font-medium">Ubicación:</span> Coliseo</p>
          <p><span className="font-medium">Capacidad:</span> {classData.maxStudents} estudiantes</p>
        </div>
        <button
          onClick={() => onEnroll(classData.id)}
          className="mt-2 bg-[#362550] hover:bg-purple-900 text-white py-1 px-4 rounded-md"
        >
          Inscribirse
        </button>
      </div>
    </div>
  );
};

export default ClassCard;