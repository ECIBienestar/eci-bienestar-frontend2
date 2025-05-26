import { useState } from 'react';

export const UseModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (data?: any) => {
    setIsOpen(true);
    if (data) setModalData(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};

export default UseModal;