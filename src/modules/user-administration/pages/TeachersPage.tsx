// src/pages/TeachersPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useTeachers } from "../hooks/useTeachers";
import { useAddTeacherModal } from "../hooks/modals/useAddTeacherModal";
import { useEditTeacherModal } from "../hooks/modals/useEditTeacherModal";

import TeacherTable from "../components/TeacherTable";
import SearchBar from "../components/SearchBar";
import AddTeacherModal from "../components/modals/AddTeacherModal";
import EditTeacherModal from "../components/modals/EditTeacherModal";

const TeachersPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    fullTeachers,
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
  } = useTeachers();

  const addModal = useAddTeacherModal(() => reload());
  const editModal = useEditTeacherModal(() => reload());

  const handleEdit = (id: number) => {
    const teacher = fullTeachers.find((t) => Number(t.id) === id);
    if (teacher) {
      editModal.openModal(teacher);
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
          Profesores
        </h2>
      </div>

      {/* Info Box */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 text-blue-900">
        <p>
          Usa el buscador para filtrar por nombre o correo electrónico. Haz clic en
          cualquier fila para seleccionar profesores. Usa los botones para añadir,
          editar o eliminar rápidamente.
        </p>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <p className="text-center text-gray-700 py-4">Cargando profesores...</p>
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

      {/* TeacherTable */}
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

      {/* AddTeacherModal */}
      <AddTeacherModal
        show={addModal.showModal}
        onClose={addModal.closeModal}
        onSubmit={addModal.handleSubmit}
        isSubmitting={addModal.isSubmitting}
        formError={addModal.formError}

        // Campos del formulario
        teacherId={addModal.teacherId}
        teacherIdType={addModal.teacherIdType}
        teacherFullName={addModal.teacherFullName}
        teacherPhone={addModal.teacherPhone}
        teacherEmail={addModal.teacherEmail}
        teacherPassword={addModal.teacherPassword}

        setTeacherId={addModal.setTeacherId}
        setTeacherIdType={addModal.setTeacherIdType}
        setTeacherFullName={addModal.setTeacherFullName}
        setTeacherPhone={addModal.setTeacherPhone}
        setTeacherEmail={addModal.setTeacherEmail}
        setTeacherPassword={addModal.setTeacherPassword}
      />

      {/* EditTeacherModal */}
      <EditTeacherModal
        show={editModal.showModal}
        onClose={editModal.closeModal}
        onSubmit={editModal.handleSubmit}
        isSubmitting={editModal.isSubmitting}
        formError={editModal.formError}

        teacherId={editModal.teacherId}
        teacherIdType={editModal.teacherIdType}
        teacherFullName={editModal.teacherFullName}
        teacherPhone={editModal.teacherPhone}
        teacherEmail={editModal.teacherEmail}
        teacherPassword={editModal.teacherPassword}

        setTeacherId={editModal.setTeacherId}
        setTeacherIdType={editModal.setTeacherIdType}
        setTeacherFullName={editModal.setTeacherFullName}
        setTeacherPhone={editModal.setTeacherPhone}
        setTeacherEmail={editModal.setTeacherEmail}
        setTeacherPassword={editModal.setTeacherPassword}
      />
    </div>
  );
};

export default TeachersPage;


