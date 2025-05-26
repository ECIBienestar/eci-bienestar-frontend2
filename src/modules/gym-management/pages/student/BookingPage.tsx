import { useState } from "react";

const mockSessions = [
  { id: "1", coachName: "Diana", date: "2025-05-25", startTime: "10:00", endTime: "11:00", capacity: 10, currentCapacity: 5 },
  { id: "2", coachName: "Tomas", date: "2025-05-25", startTime: "14:00", endTime: "15:00", capacity: 8, currentCapacity: 3 },
  { id: "3", coachName: "Diana", date: "2025-05-26", startTime: "09:00", endTime: "10:00", capacity: 5, currentCapacity: 5 },
  { id: "4", coachName: "Tomas", date: "2025-05-26", startTime: "16:00", endTime: "17:00", capacity: 12, currentCapacity: 0 },
  { id: "5", coachName: "Tomas", date: "2025-05-27", startTime: "18:00", endTime: "19:00", capacity: 15, currentCapacity: 10 },
];

const BookingPage = () => {
  const [filterDate, setFilterDate] = useState("");
  const [startTimeRange, setStartTimeRange] = useState("");
  const [endTimeRange, setEndTimeRange] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");

  const [reservingId, setReservingId] = useState<string | null>(null);
  const [] = useState<string | null>(null);

  const filterByTimeRange = (start: string, end: string, session: any) => {
    if (!start && !end) return true;
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
    const sessionStart = toMinutes(session.startTime);
    const sessionEnd = toMinutes(session.endTime);
    const filterStart = start ? toMinutes(start) : 0;
    const filterEnd = end ? toMinutes(end) : 24 * 60;

    return sessionStart >= filterStart && sessionEnd <= filterEnd;
  };

  const filteredSessions = mockSessions.filter((session) => {
    const matchesDate = !filterDate || session.date === filterDate;
    const matchesTimeRange = filterByTimeRange(startTimeRange, endTimeRange, session);
    const matchesEndTime = !filterEndTime || session.endTime === filterEndTime;

    return matchesDate && matchesTimeRange && matchesEndTime;
  });

  const handleReserve = async (sessionId: string) => {
    setReservingId(sessionId);

    try {
      const response = await fetch(`/api/sessions/${sessionId}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al reservar la sesión");

      // Opcional: recargar datos o actualizar capacidad
    } catch (error) {
      console.error(error);
    } finally {
      setReservingId(null);
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Reservar Sesión de Gimnasio</h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Filtrar por fecha</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Filtrar por hora de inicio</label>
            <input
              type="time"
              value={startTimeRange}
              onChange={(e) => setStartTimeRange(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Filtrar por hora de fin</label>
            <input
              type="time"
              value={endTimeRange}
              onChange={(e) => setEndTimeRange(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Filtrar por hora de fin exacta</label>
            <input
              type="time"
              value={filterEndTime}
              onChange={(e) => setFilterEndTime(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={() => {
              setFilterDate("");
              setStartTimeRange("");
              setEndTimeRange("");
              setFilterEndTime("");
            }}
            className="text-sm text-black-600 hover:underline mt-2"
          >
            Limpiar filtros
          </button>
        </div>


        {/* Resultados */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <p className="text-center text-gray-500">No hay sesiones que coincidan.</p>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-black text-white rounded-lg flex justify-between items-center shadow-md"
              >
                <div>
                  <p className="text-sm">👤 Entrenador: {session.coachName}</p>
                  <p className="text-sm">📅 Fecha: {session.date}</p>
                  <p className="text-sm">🕒 {session.startTime} - {session.endTime}</p>
                  <p className="text-sm">👥 Capacidad: {session.capacity}</p>
                  <p className="text-sm">📄 Inscritos: {session.currentCapacity} </p>
                </div>
                <button
                  onClick={() => handleReserve(session.id)}
                  disabled={session.currentCapacity >= session.capacity || reservingId === session.id}
                  className={`px-4 py-2 rounded ${
                    session.currentCapacity >= session.capacity
                      ? "bg-gray-400 cursor-not-allowed"
                      : reservingId === session.id
                        ? "bg-yellow-500 cursor-wait"
                        : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {session.currentCapacity >= session.capacity
                    ? "Llena"
                    : reservingId === session.id
                      ? "Reservando..."
                      : "Reservar"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
