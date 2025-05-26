import { FC, useState } from "react";
import ModuleTabs from "../../components/common/moduleTabs";
import BackButton from "../../components/common/backButton";
import AddClassModal from "../../components/modals/addClassModal";
import EditClassModal from "../../components/modals/editClassModal";
import ClassManagementList from "../../components/common/classManagementList";
import { useAllClasses, useDeleteClass } from "../../hooks/useClasses";
import { Class } from "../../services/classesService";

const ClassManagementPage: FC = () => {
  const userRole = "admin";
  const { classes, loading, error, refresh } = useAllClasses();
  const { deleteExistingClass, loading: deleteLoading } = useDeleteClass();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

  const allTabs = [
    {
      label: "Estadísticas",
      path: "/modules/extracurricular/estadisticas",
      roles: ["wellnessStaff", "admin"],
    },
    {
      label: "Gestión de clases",
      path: "/modules/extracurricular/gestion-de-clases",
      roles: ["wellnessStaff", "admin"],
    },
    {
      label: "Gestión de notificaciones",
      path: "/modules/extracurricular/gestion-de-notificaciones",
      roles: ["admin"],
    },
  ];

  const tabs = allTabs.filter((tab) => tab.roles.includes(userRole));

  const handleOpenEditModal = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      const success = await deleteExistingClass(id);
      if (success) {
        refresh();
      }
    }
  };

  // Pagination - Usando 6 clases por página
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(classes.length / classesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatTime = (time: string) => {
    if (!time) return "";

    try {
      const [hours, minutes] = time.split(":");
      const h = parseInt(hours);
      const m = minutes;
      const period = h >= 12 ? "pm" : "am";
      const hour = h % 12 || 12;

      return `${hour}:${m} ${period}`;
    } catch (error) {
      return time;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Encabezado */}
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de clases</h1>
      </div>

      {/* Tabs principales */}
      <div className="mb-[-1px]">
        <ModuleTabs tabs={tabs} userRole={userRole} />
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-b-lg rounded-tr-lg shadow p-6 border-t-0 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Clases Extracurriculares</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#362550] text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Agregar Clase
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Cargando clases...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <ClassManagementList
            classes={classes}
            currentClasses={currentClasses}
            currentPage={currentPage}
            totalPages={totalPages}
            deleteLoading={deleteLoading}
            formatTime={formatTime}
            handleOpenEditModal={handleOpenEditModal}
            handleDelete={handleDelete}
            paginate={paginate}
          />
        )}
      </div>

      {/* Modales */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refresh();
          setIsAddModalOpen(false);
        }}
      />

      <EditClassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClass(null);
        }}
        onSuccess={() => {
          refresh();
          setIsEditModalOpen(false);
        }}
        classData={selectedClass}
      />
    </div>
  );
};

export default ClassManagementPage;
