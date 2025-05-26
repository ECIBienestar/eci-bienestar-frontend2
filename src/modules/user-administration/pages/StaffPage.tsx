// src/pages/StaffPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useStaff } from "../hooks/useStaff";
import { useAddStaffModal } from "../hooks/modals/useAddStaffModal";
import { useEditStaffModal } from "../hooks/modals/useEditStaffModal";

import TeacherTable from "../components/TeacherTable"; // Reutiliza la tabla genérica
import SearchBar from "../components/SearchBar";
import AddStaffModal from "../components/modals/AddStaffModal";
import EditStaffModal from "../components/modals/EditStaffModal";

const StaffPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    fullStaff,
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
  } = useStaff();

  const addModal = useAddStaffModal(() => reload());
  const editModal = useEditStaffModal(() => reload());

  const handleEdit = (id: number) => {
    const staffMember = fullStaff.find((s) => Number(s.id) === id);
    if (staffMember) {
      editModal.openModal(staffMember);
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
          Personal Administrativo
        </h2>
      </div>

      {/* Info Box */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 text-blue-900">
        <p>
          Usa el buscador para filtrar por nombre o correo electrónico. Haz clic en{" "}
          cualquier fila para seleccionar miembros del staff. Usa los botones para
          añadir, editar o eliminar.
        </p>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <p className="text-center text-gray-700 py-4">Cargando staff...</p>
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

      {/* StaffTable (reutiliza TeacherTable) */}
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

      {/* AddStaffModal */}
      <AddStaffModal
        show={addModal.showModal}
        onClose={addModal.closeModal}
        onSubmit={addModal.handleSubmit}
        isSubmitting={addModal.isSubmitting}
        formError={addModal.formError}

        // Campos del formulario para crear staff
        staffId={addModal.staffId}
        staffIdType={addModal.staffIdType}
        staffFullName={addModal.staffFullName}
        staffPhone={addModal.staffPhone}
        staffEmail={addModal.staffEmail}
        staffPassword={addModal.staffPassword}
        staffRole={addModal.staffRole}
        staffSpecialty={addModal.staffSpecialty}

        setStaffId={addModal.setStaffId}
        setStaffIdType={addModal.setStaffIdType}
        setStaffFullName={addModal.setStaffFullName}
        setStaffPhone={addModal.setStaffPhone}
        setStaffEmail={addModal.setStaffEmail}
        setStaffPassword={addModal.setStaffPassword}
        setStaffRole={addModal.setStaffRole}
        setStaffSpecialty={addModal.setStaffSpecialty}
      />

      {/* EditStaffModal */}
      <EditStaffModal
        show={editModal.showModal}
        onClose={editModal.closeModal}
        onSubmit={editModal.handleSubmit}
        isSubmitting={editModal.isSubmitting}
        formError={editModal.formError}

        staffId={editModal.staffId}
        staffIdType={editModal.staffIdType}
        staffFullName={editModal.staffFullName}
        staffPhone={editModal.staffPhone}
        staffEmail={editModal.staffEmail}
        staffPassword={editModal.staffPassword}
        staffRole={editModal.staffRole}
        staffSpecialty={editModal.staffSpecialty}

        setStaffId={editModal.setStaffId}
        setStaffIdType={editModal.setStaffIdType}
        setStaffFullName={editModal.setStaffFullName}
        setStaffPhone={editModal.setStaffPhone}
        setStaffEmail={editModal.setStaffEmail}
        setStaffPassword={editModal.setStaffPassword}
        setStaffRole={editModal.setStaffRole}
        setStaffSpecialty={editModal.setStaffSpecialty}
      />
    </div>
  );
};

export default StaffPage;
