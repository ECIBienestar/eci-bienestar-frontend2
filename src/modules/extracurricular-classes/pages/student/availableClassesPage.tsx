import { useState, useMemo, FC } from "react";
import ModuleTabs from "../../components/common/moduleTabs";
import BackButton from "../../components/common/backButton";
import { useAllClasses } from "../../hooks/useClasses";
import ClassSearchBar from "../../components/common/classSearchBar";
import AvailableClassesList from "../../components/student/availableClassesList";

interface AvailableClassesPageProps {
  userId: string;
}

const AvailableClassesPage: FC<AvailableClassesPageProps> = ({ userId }) => {
  const userRole = "student";
  const { classes, loading, error } = useAllClasses();
  const [searchTerm, setSearchTerm] = useState("");

  const studentTabs = [
    {
      label: "Mis clases inscritas",
      path: "/modules/extracurricular/estudiante/clases-inscritas",
      roles: ["student"],
    },
    {
      label: "Clases disponibles",
      path: "/modules/extracurricular/estudiante/clases-disponibles",
      roles: ["student"],
    },
    {
      label: "Historial de asistencia",
      path: "/modules/extracurricular/historial-asistencia",
      roles: ["student"],
    },
  ];

  // Clases por tipo
  const groupedClasses = useMemo(() => {
    const safeClasses = Array.isArray(classes) ? classes : [];

    const filtered = searchTerm
      ? safeClasses.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : safeClasses;

    const valid = filtered.filter((c) => c.type !== null);

    return valid.reduce((acc, curr) => {
      if (!acc[curr.type!]) {
        acc[curr.type!] = [];
      }
      acc[curr.type!].push(curr);
      return acc;
    }, {} as Record<string, typeof classes>);
  }, [classes, searchTerm]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Clases Disponibles
          </h1>
        </div>
        <ModuleTabs tabs={studentTabs} userRole={userRole} />
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Clases Disponibles
          </h1>
        </div>
        <ModuleTabs tabs={studentTabs} userRole={userRole} />
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {" "}
            No se pudieron cargar las clases disponibles.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Encabezado */}
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <BackButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Clases Disponibles</h1>
      </div>

      {/* Tabs principales */}
      <ModuleTabs tabs={studentTabs} userRole={userRole} />

      {/* Contenido de la página */}
      <div className="bg-white rounded-b-lg rounded-tr-lg shadow p-6 border-t-0 border-2 border-gray-200">
        <div className="mt-6">
          <ClassSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {Object.keys(groupedClasses).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron clases disponibles.
              </p>
            </div>
          ) : (
            Object.entries(groupedClasses).map(([type, typeClasses]) => (
              <AvailableClassesList
                key={type}
                categoryTitle={type}
                classes={typeClasses}
                userId={userId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableClassesPage;
