import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";

const mockStudents = [
  {
    id: "1",
    name: "Juan Pérez",
    progress: [
      { id: "p1", date: "2023-10-01" },
      { id: "p2", date: "2023-10-15" },
    ],
  },
  {
    id: "2",
    name: "María López",
    progress: [
      { id: "p3", date: "2023-09-20" },
      { id: "p4", date: "2023-10-05" },
    ],
  },
  {
    id: "3",
    name: "Carlos Gómez",
    progress: [
      { id: "p5", date: "2023-08-30" },
      { id: "p6", date: "2023-09-25" },
    ],
  },
];

const ProgressPage = () => {
  const navigate = useNavigate();

  const handleNavigateToEvolution = () => {
    navigate("/modules/gym-management/trainer/my-students-progress");
  };

  const handleNavigateToProfile = (studentId: string) => {
    console.log(`Navegar al perfil del usuario con ID: ${studentId}`);

  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Progreso de Estudiantes</h1>
      <div className="grid grid-cols-1 gap-4">
        {mockStudents.map((student) => (
          <div
            key={student.id}
            className="border p-4 rounded-md shadow-sm space-y-4"
          >
            <div className="flex items-center gap-4">
              <UserIcon
                className="w-12 h-12 text-gray-500 cursor-pointer"
                onClick={() => handleNavigateToProfile(student.id)}
              />
              <span className="font-semibold text-gray-800">{student.name}</span>
            </div>
            <div className="space-y-2">
              {student.progress.map((progress) => (
                <div
                  key={progress.id}
                  className="flex justify-between items-center border p-2 rounded-md"
                >
                  <span className="text-sm text-gray-600">
                    Progreso del {progress.date}
                  </span>
                  <button
                    onClick={handleNavigateToEvolution}
                    className="bg-[#990000] text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Ver Evolución
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;