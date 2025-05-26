// src/pages/DoctorsPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useDoctors } from "../hooks/useDoctors";
import { useAddDoctorModal } from "../hooks/modals/useAddDoctorModal";
import { useEditDoctorModal } from "../hooks/modals/useEditDoctorModal";

import TeacherTable from "../components/TeacherTable"; 
import SearchBar from "../components/SearchBar";
import AddDoctorModal from "../components/modals/AddDoctorModal";
import EditDoctorModal from "../components/modals/EditDoctorModal";

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    fullDoctors,
    isLoading,
    error,
    query,
    handleSearchChange,
    currentPage,
    totalPages,
    displayed,
    handlePrev,
    handleNext,
    filteredCount,
    selectedIds,
    toggleSelect,
    deleteSelected,
    reload,
  } = useDoctors();

  const addModal = useAddDoctorModal(() => reload());
  const editModal = useEditDoctorModal(() => reload());

  const handleEdit = (id: number) => {
    const doctor = fullDoctors.find((d) => Number(d.id) === id);
    if (doctor) {
      editModal.openModal(doctor);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:text-gray-900 p-2"
          title="Go Back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h2 className="ml-4 text-4xl font-semibold text-[#b30000]">
          Doctores
        </h2>
      </div>

      {/* Info Box */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 text-blue-900">
        <p>
          Usa el buscador para filtrar por nombre o correo electrónico. Haz clic en
          cualquier fila para seleccionar doctores. Usa los botones para añadir,
          editar o eliminar rápidamente.
        </p>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <p className="text-center text-gray-700 py-4">Cargando doctores...</p>
      )}
      {error && <p className="text-center text-red-600 py-4">{error}</p>}

      {/* SearchBar */}
      <SearchBar
        query={query}
        onChange={handleSearchChange}
        onAddClick={addModal.openModal}
        onDeleteClick={deleteSelected}
        disableDelete={!selectedIds.size}
      />

      {/* Tabla (reutiliza DoctorListItem en lugar de TeacherListItem) */}
      <TeacherTable
        displayed={displayed}
        filteredCount={filteredCount}
        isLoading={isLoading}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onEdit={handleEdit}
      />

      {/* AddDoctorModal (reutiliza AddTeacherModal, solo difieren labels internos) */}
      <AddDoctorModal
        show={addModal.showModal}
        onClose={addModal.closeModal}
        onSubmit={addModal.handleSubmit}
        isSubmitting={addModal.isSubmitting}
        formError={addModal.formError}

        // CORRECTO: “doctorId” en lugar de “teacherId”
        doctorId={addModal.doctorId}
        doctorIdType={addModal.doctorIdType}
        doctorFullName={addModal.doctorFullName}
        doctorPhone={addModal.doctorPhone}
        doctorEmail={addModal.doctorEmail}
        doctorPassword={addModal.doctorPassword}
        doctorRole={addModal.doctorRole}
        doctorSpecialty={addModal.doctorSpecialty}

        setDoctorId={addModal.setDoctorId}
        setDoctorIdType={addModal.setDoctorIdType}
        setDoctorFullName={addModal.setDoctorFullName}
        setDoctorPhone={addModal.setDoctorPhone}
        setDoctorEmail={addModal.setDoctorEmail}
        setDoctorPassword={addModal.setDoctorPassword}
        setDoctorRole={addModal.setDoctorRole}
        setDoctorSpecialty={addModal.setDoctorSpecialty}
      />

      <EditDoctorModal
        show={editModal.showModal}
        onClose={editModal.closeModal}
        onSubmit={editModal.handleSubmit}
        isSubmitting={editModal.isSubmitting}
        formError={editModal.formError}

        // CORRECTO: “doctorId” en lugar de “teacherId”
        doctorId={editModal.doctorId}
        doctorIdType={editModal.doctorIdType}
        doctorFullName={editModal.doctorFullName}
        doctorPhone={editModal.doctorPhone}
        doctorEmail={editModal.doctorEmail}
        doctorPassword={editModal.doctorPassword}
        doctorRole={editModal.doctorRole}
        doctorSpecialty={editModal.doctorSpecialty}

        setDoctorId={editModal.setDoctorId}
        setDoctorIdType={editModal.setDoctorIdType}
        setDoctorFullName={editModal.setDoctorFullName}
        setDoctorPhone={editModal.setDoctorPhone}
        setDoctorEmail={editModal.setDoctorEmail}
        setDoctorPassword={editModal.setDoctorPassword}
        setDoctorRole={editModal.setDoctorRole}
        setDoctorSpecialty={editModal.setDoctorSpecialty}
      />
    </div>
  );
};

export default DoctorsPage;
