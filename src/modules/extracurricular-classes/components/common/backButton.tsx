import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton: FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/estudiante/dashboard')} // condicional de rol dashboard
      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#362550] hover:bg-indigo-700 transition-colors"
      title="Volver al inicio"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-white w-5 h-5" />
    </button>
  );
};

export default BackButton;
