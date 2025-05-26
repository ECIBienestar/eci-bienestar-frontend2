import { useEffect, useState } from "react";

const mockSessions = [
  { id: "101", label: "Sesión de Cardio" },
  { id: "102", label: "Sesión de Fuerza" },
  { id: "103", label: "Sesión de Yoga" },
];

export default function TrainerGenerateReportPage() {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [reportEntries, setReportEntries] = useState<
      { type: "user" | "session"; id: string; name: string }[]
  >([]);

  const [userQuery, setUserQuery] = useState("");
  const [sessionQuery, setSessionQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState(mockSessions);

  // Obtener usuarios reales
  useEffect(() => {
    fetch("https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/trainer/users/role/STUDENT")
        .then((res) => res.json())
        .then((data) => {
          setFilteredUsers(data);
        })
        .catch((err) => {
          console.error("Error al cargar usuarios:", err);
        });
  }, []);

  const handleAddEntry = () => {
    setReportEntries([
      ...reportEntries,
      { type: reportEntries.length === 0 ? "user" : "session", id: "", name: "" },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = [...reportEntries];
    updatedEntries.splice(index, 1);
    setReportEntries(updatedEntries);
  };

  const handleTypeChange = (index: number, newType: "user" | "session") => {
    const updatedEntries = [...reportEntries];
    updatedEntries[index] = { ...updatedEntries[index], type: newType, id: "", name: "" };
    setReportEntries(updatedEntries);
  };

  const handleSearch = (query: string, type: "user" | "session") => {
    if (type === "user") {
      setUserQuery(query);
      setFilteredUsers((prev) =>
          prev.filter((user) =>
              user.name.toLowerCase().includes(query.toLowerCase())
          )
      );
    } else {
      setSessionQuery(query);
      setFilteredSessions(
          mockSessions.filter((session) =>
              session.label.toLowerCase().includes(query.toLowerCase())
          )
      );
    }
  };

  const handleSelect = (item: any, index: number) => {
    const updatedEntries = [...reportEntries];
    const name = item.label || item.name;
    updatedEntries[index] = { ...updatedEntries[index], id: item.id, name };
    setReportEntries(updatedEntries);

    if (updatedEntries[index].type === "user") setUserQuery("");
    else setSessionQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const coachId = {
      id: "string",
      name: "Entrenador",
      email: "entrenador@demo.com",
      password: "123456",
      role: "ADMINISTRATOR",
      gender: "HOMBRE",
      registered: true,
      registrationDate: new Date().toISOString().split("T")[0],
    };

    const users = reportEntries
        .filter((e) => e.type === "user")
        .map((e) => {
          const fullUser = filteredUsers.find((u) => u.id === e.id);
          return fullUser || { ...coachId, id: e.id, name: e.name };
        });

    const sessions = reportEntries
        .filter((e) => e.type === "session")
        .map((e) => ({
          id: e.id,
          coachId,
          date: new Date().toISOString().split("T")[0],
          startTime: "14:30:00",
          endTime: "14:30:00",
          capacity: 10,
          currentReservations: 5,
          users,
          attendance: users.map(() => true),
        }));

    const reportData = {
      coachId,
      generatedAt: new Date().toISOString().split("T")[0],
      type: reportType,
      description,
      users,
      sessions,
    };

    try {
      const res = await fetch(
          "https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/trainer/reports",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          }
      );

      if (!res.ok) throw new Error("Error al generar el reporte");

      alert("Reporte generado exitosamente");
      setReportEntries([]);
      setDescription("");
      setReportType("");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al generar el reporte.");
    }
  };

  return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Generar Reporte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Reporte */}
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Tipo de Reporte
            </label>
            <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#990000] focus:border-[#990000]"
                required
            >
              <option value="" disabled>Selecciona un tipo de reporte</option>
              <option value="USO">Uso</option>
              <option value="ASSISTANCE">Asistencia</option>
              <option value="PHYSICAL_PROGRESS">Progreso físico</option>
              <option value="ACHIEVEMENT_OF_OBJECTIVES">Cumplimiento de objetivos</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#990000] focus:border-[#990000]"
                rows={4}
                required
                placeholder="Escribe una descripción para el reporte"
            />
          </div>

          {/* Entradas del reporte */}
          <div>
            <h3 className="text-lg font-semibold">Entradas del Reporte</h3>
            {reportEntries.map((entry, index) => (
                <div key={index} className="border p-4 rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      {entry.type === "user" ? "Usuario" : "Sesión"}
                    </label>
                    <select
                        value={entry.type}
                        onChange={(e) => handleTypeChange(index, e.target.value as "user" | "session")}
                        className="border p-1 rounded"
                    >
                      <option value="user">Usuario</option>
                      <option value="session">Sesión</option>
                    </select>
                  </div>
                  <input
                      type="text"
                      value={entry.type === "user" ? userQuery : sessionQuery}
                      onChange={(e) => handleSearch(e.target.value, entry.type)}
                      className="border p-2 w-full rounded"
                      placeholder={`Buscar ${entry.type === "user" ? "usuario" : "sesión"}`}
                  />
                  {(entry.type === "user" ? userQuery : sessionQuery) && (
                      <ul className="border rounded mt-2 bg-white max-h-40 overflow-y-auto">
                        {(entry.type === "user" ? filteredUsers : filteredSessions).map((item) => (
                            <li key={item.id}>
                              <button
                                  type="button"
                                  onClick={() => handleSelect(item, index)}
                                  className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer focus:outline-none"
                              >
                                {item.name || item.label}
                              </button>
                            </li>
                        ))}
                      </ul>
                  )}
                  {entry.name && (
                      <p className="text-sm text-gray-600">
                        Seleccionado: {entry.name} (ID: {entry.id})
                      </p>
                  )}
                  <button
                      type="button"
                      onClick={() => handleRemoveEntry(index)}
                      className="text-red-500 hover:underline"
                  >
                    Quitar etiqueta
                  </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddEntry}
                className="mt-2 px-4 py-2 bg-[#990000] text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Añadir Etiqueta
            </button>
          </div>

          {/* Botón de envío */}
          <button
              type="submit"
              className="px-4 py-2 bg-[#990000] text-white font-semibold rounded-md hover:bg-red-700 transition"
          >
            Generar Reporte
          </button>
        </form>
      </div>
  );
}
