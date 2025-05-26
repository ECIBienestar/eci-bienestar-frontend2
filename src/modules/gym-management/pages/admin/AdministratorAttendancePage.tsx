import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

interface Session {
  id: string;
  coachId: {
    name: string;
    email: string;
  } | null;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  currentReservations: number;
  users: any[];
  attendance: any[] | null;
}

interface AggregatedData {
  date: string;
  coach: string;
  totalCapacity: number;
  totalAttendance: number;
}

const AdministratorAttendancePage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/session')
      .then((res) => {
        setSessions(res.data.data);
      })
      .catch((err) => {
        console.error('Error al obtener sesiones:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadExcel = () => {
    const worksheetData = sessions.map((s) => ({
      Fecha: s.date,
      'Hora Inicio': s.startTime,
      'Hora Fin': s.endTime,
      Entrenador: s.coachId?.name || 'Sin entrenador',
      Capacidad: s.capacity,
      'Reservas Actuales': s.currentReservations,
      Asistentes: s.attendance?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia Gimnasio');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'asistencia_gimnasio.xlsx');
  };

  // Agrupar datos para gráfica
  const groupedData: AggregatedData[] = [];

  const aggregationMap = new Map<string, AggregatedData>();

  sessions.forEach((s) => {
    const coachName = s.coachId?.name || 'Sin entrenador';
    const key = `${s.date}-${coachName}`;
    const attendanceCount = s.attendance?.length || 0;

    if (aggregationMap.has(key)) {
      const existing = aggregationMap.get(key)!;
      existing.totalCapacity += s.capacity;
      existing.totalAttendance += attendanceCount;
    } else {
      aggregationMap.set(key, {
        date: s.date,
        coach: coachName,
        totalCapacity: s.capacity,
        totalAttendance: attendanceCount,
      });
    }
  });

  aggregationMap.forEach((value) => groupedData.push(value));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Asistencia al Gimnasio</h1>

      {(() => {
        if (loading) {
          return <p>Cargando sesiones...</p>;
        }
        if (sessions.length === 0) {
          return <p>No hay sesiones disponibles.</p>;
        }
        return (
          <>
            {/* Tabla */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Fecha</th>
                    <th className="border border-gray-300 p-2">Hora Inicio</th>
                    <th className="border border-gray-300 p-2">Hora Fin</th>
                    <th className="border border-gray-300 p-2">Entrenador</th>
                    <th className="border border-gray-300 p-2 text-right">Capacidad</th>
                    <th className="border border-gray-300 p-2 text-right">Reservas</th>
                    <th className="border border-gray-300 p-2 text-right">Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 p-2">{s.date}</td>
                      <td className="border border-gray-300 p-2">{s.startTime}</td>
                      <td className="border border-gray-300 p-2">{s.endTime}</td>
                      <td className="border border-gray-300 p-2">{s.coachId?.name || 'Sin entrenador'}</td>
                      <td className="border border-gray-300 p-2 text-right">{s.capacity}</td>
                      <td className="border border-gray-300 p-2 text-right">{s.currentReservations}</td>
                      <td className="border border-gray-300 p-2 text-right">{s.attendance?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón Excel */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleDownloadExcel}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
              >
                Descargar Excel
              </button>
            </div>

            {/* Gráfica */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Resumen por día y entrenador</h2>
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalCapacity" fill="#8884d8" name="Capacidad Total" />
                  <Bar dataKey="totalAttendance" fill="#82ca9d" name="Asistencia Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default AdministratorAttendancePage;