// src/pages/StudentsPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useStudents,
  useAddStudentModal,
} from "../hooks/useStudents";
import { useEditStudentModal } from "../hooks/modals/useEditStudentModal";
import EditStudentModal from "../components/modals/EditStudentModal";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import AddStudentModal from "../components/modals/AddStudentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();

  // Hook principal para lista de estudiantes
  const {
    fullStudents,
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
  } = useStudents();

  // Hook para el modal de "Add Student"
  const addModal = useAddStudentModal(() => {
    reload();
  });

  const editModal = useEditStudentModal(() => {
    reload();
  });

    const handleEdit = (id: number) => {
    const student = fullStudents.find((s) => Number(s.id) === id);
    if (student) {
      editModal.openModal(student);
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
          Estudiantes
        </h2>
      </div>

      {/* Infobox */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 text-blue-900">
        <p>
          Usa el buscador para filtrar por nombre o correo electrónico. Haz clic en
          cualquier fila para seleccionar estudiantes. Usa los botones para añadir,
          editar o eliminar rápidamente.
        </p>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <p className="text-center text-gray-700 py-4">Cargando estudiantes...</p>
      )}
      {error && <p className="text-center text-red-600 py-4">{error}</p>}

      {/* SearchBar (búsqueda, añadir y eliminar) */}
      <SearchBar
        query={query}
        onChange={handleSearchChange}
        onAddClick={addModal.openModal}
        onDeleteClick={deleteSelected}
        disableDelete={!selectedIds.size}
      />

      {/* StudentTable (tabla, paginación) */}
      <StudentTable
        displayed={displayed}
        filteredCount={filteredCount}
        isLoading={isLoading}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onEdit={(id: number) => handleEdit(id)}
      />

      {/* AddStudentModal (crea EC + Student) */}
      <AddStudentModal
        show={addModal.showModal}
        onClose={addModal.closeModal}
        onSubmit={addModal.handleSubmit}
        isSubmitting={addModal.isSubmitting}
        formError={addModal.formError}

        ecFullName={addModal.ecFullName}
        ecPhone={addModal.ecPhone}
        ecIdType={addModal.ecIdType}
        ecIdNumber={addModal.ecIdNumber}
        ecRelationship={addModal.ecRelationship}

        stuId={addModal.stuId}
        stuIdType={addModal.stuIdType}
        stuFullName={addModal.stuFullName}
        stuPhone={addModal.stuPhone}
        stuEmail={addModal.stuEmail}
        stuPassword={addModal.stuPassword}
        stuCode={addModal.stuCode}
        stuProgram={addModal.stuProgram}
        stuSemester={addModal.stuSemester}
        stuBirthDate={addModal.stuBirthDate}
        stuAddress={addModal.stuAddress}

        setEcFullName={addModal.setEcFullName}
        setEcPhone={addModal.setEcPhone}
        setEcIdType={addModal.setEcIdType}
        setEcIdNumber={addModal.setEcIdNumber}
        setEcRelationship={addModal.setEcRelationship}

        setStuId={addModal.setStuId}
        setStuIdType={addModal.setStuIdType}
        setStuFullName={addModal.setStuFullName}
        setStuPhone={addModal.setStuPhone}
        setStuEmail={addModal.setStuEmail}
        setStuPassword={addModal.setStuPassword}
        setStuCode={addModal.setStuCode}
        setStuProgram={addModal.setStuProgram}
        setStuSemester={addModal.setStuSemester}
        setStuBirthDate={addModal.setStuBirthDate}
        setStuAddress={addModal.setStuAddress}
      />

      {/* EditStudentModal (actualiza Student) */}
      <EditStudentModal
        show={editModal.showModal}
        onClose={editModal.closeModal}
        onSubmit={editModal.handleSubmit}
        isSubmitting={editModal.isSubmitting}
        formError={editModal.formError}
        stuId={editModal.stuId}
        stuIdType={editModal.stuIdType}
        stuFullName={editModal.stuFullName}
        stuPhone={editModal.stuPhone}
        stuEmail={editModal.stuEmail}
        stuPassword={editModal.stuPassword}
        stuCode={editModal.stuCode}
        stuProgram={editModal.stuProgram}
        stuSemester={editModal.stuSemester}
        stuBirthDate={editModal.stuBirthDate}
        stuAddress={editModal.stuAddress}
        setStuId={editModal.setStuId}
        setStuIdType={editModal.setStuIdType}
        setStuFullName={editModal.setStuFullName}
        setStuPhone={editModal.setStuPhone}
        setStuEmail={editModal.setStuEmail}
        setStuPassword={editModal.setStuPassword}
        setStuCode={editModal.setStuCode}
        setStuProgram={editModal.setStuProgram}
        setStuSemester={editModal.setStuSemester}
        setStuBirthDate={editModal.setStuBirthDate}
        setStuAddress={editModal.setStuAddress}
      />
    </div>
  );
};

export default StudentsPage;
