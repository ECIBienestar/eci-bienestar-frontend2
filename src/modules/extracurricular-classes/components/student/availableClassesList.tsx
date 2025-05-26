import React, { useState } from 'react';
import { Class } from '../../services/classesService';
import ClassCard from './classCard';
import EnrollmentModal from '../modals/enrollmentModal';
import UseModal from '../../hooks/useModal';

interface AvailableClassesListProps {
  classes: Class[];
  categoryTitle: string;
  userId: string;
}

const AvailableClassesList: React.FC<AvailableClassesListProps> = ({ 
  classes, 
  categoryTitle,
  userId 
}) => {
  const [expanded, setExpanded] = useState(true);
  const { isOpen, modalData, openModal, closeModal } = UseModal();

  const handleEnroll = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      openModal(selectedClass);
    }
  };

  return (
    <div className="mb-6">
      <div 
        className="bg-[#362550] text-white p-4 rounded-t-[30px] flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-bold">{categoryTitle}</h2>
        <button className="focus:outline-none">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="bg-gray-50 p-4 rounded-b-[30px] grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#362550]">
          {classes.map((classItem) => (
            <ClassCard 
              key={classItem.id} 
              classData={classItem} 
              onEnroll={handleEnroll} 
            />
          ))}
        </div>
      )}

      <EnrollmentModal 
        isOpen={isOpen}
        onClose={closeModal}
        classData={modalData}
        userId={userId}
      />
    </div>
  );
};

export default AvailableClassesList;