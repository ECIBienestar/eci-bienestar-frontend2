import React from 'react';

interface EnrollmentButtonProps {
  onEnroll: () => void;
  disabled?: boolean;
}

const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ onEnroll, disabled = false }) => {
  return (
    <button
      onClick={onEnroll}
      disabled={disabled}
      className={`
        py-1 px-4 rounded-md text-white transition duration-150
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-purple-800 hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
        }
      `}
    >
      Inscribirse
    </button>
  );
};

export default EnrollmentButton;