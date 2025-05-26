import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";


type Session = {
  label: string;
  day: string;
  time: string;
  trainer?: string;
  capacity: number;
  currentCapacity: number;
  status?: string;
};

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hours = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function ReservationPage() {
  const [sessions] = useState<Session[]>([
    {
      label: "Sesion gimnasio",
      day: "Martes",
      time: "09:00 AM", // <- corregido
      trainer: "trainer2",
      capacity: 10,
      currentCapacity: 10,
      status: "Aprobado",
    },
    {
      label: "Sesion gimnasio",
      day: "Jueves",
      time: "4:00 PM",
      trainer: "Sebastián Felipe Cortés Rincón",
      capacity: 6,
      currentCapacity: 6,
      status: "Aprobado",
    },
    {
      label: "Sesion gimnasio",
      day: "Viernes",
      time: "1:00 PM",
      trainer: "Sebastián Felipe Cortés Rincón",
      capacity: 8,
      currentCapacity: 8,
      status: "Aprobado",
    },
    {
      label: "Sesion gimnasio",
      day: "Lunes",
      time: "07:00 AM", // <- corregido (pero no está en la matriz de horas)
      trainer: "Sebastián Felipe Cortés Rincón",
      capacity: 5,
      currentCapacity: 5,
      status: "Aprobado",
    },
  ]);


  const [selected, setSelected] = useState<Session | null>(null);

  return (
    <div className="p-4">
      <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reservas</h2>
      </div>
      
      <div className="overflow-x-auto border rounded-b-lg">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2 border">Hora</th>
              {days.map((day) => (
                <th key={day} className="p-2 border">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="text-sm">
                <td className="p-2 border">{hour}</td>
                {days.map((day) => {
                  const session = sessions.find(
                    (s) => s.day === day && s.time === hour
                  );
                  return (
                    <td key={`${day}-${hour}`} className="p-2 border h-16">
                      {session && (
                        <div
                          onClick={() => setSelected(session)}
                          className="bg-black text-white rounded-lg p-2 relative cursor-pointer"
                        >
                          {session.label}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ver detalle */}
      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// Modal para ver sesión
function SessionDetailModal({
  session,
  onClose,
  }: {
  session: Session;
  onClose: () => void;
}) {
  return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Detalle de la sesión</h2>
          <p><strong>Entrenador:</strong> {session.trainer}</p>
          <p><strong>Capacidad:</strong> {session.capacity}</p>
          <p><strong>Inscritos:</strong> {session.currentCapacity}</p>
          <p><strong>Estado:</strong> {session.status}</p>
        </div>
      </div>
  );
}