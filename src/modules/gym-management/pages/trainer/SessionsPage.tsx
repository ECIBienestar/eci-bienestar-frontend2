import { useState } from "react";
import {
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";


type Student = {
  id: number;
  name: string;
  attended: boolean | null;
  canceled: boolean;
};

type Session = {
  label: string;
  day: string;
  time: string;
  capacity: number;
  students: Student[];
};

const mockStudents: Student[] = [
  { id: 1, name: "Juan Pérez", attended: null, canceled: false },
  { id: 2, name: "María López", attended: null, canceled: true },
  { id: 3, name: "Carlos Gómez", attended: null, canceled: false },
  { id: 4, name: "Lucía Fernández", attended: true, canceled: false },
  { id: 5, name: "Diego Martínez", attended: false, canceled: false },
  { id: 6, name: "Ana Torres", attended: true, canceled: false },
  { id: 7, name: "Luis Ramírez", attended: null, canceled: true },
  { id: 8, name: "Sofía Herrera", attended: false, canceled: false },
  { id: 9, name: "Gabriel Díaz", attended: true, canceled: false },
  { id: 10, name: "Camila Morales", attended: null, canceled: false },
  { id: 11, name: "Felipe Castro", attended: null, canceled: false },
  { id: 12, name: "Valentina Ríos", attended: null, canceled: false },
  { id: 13, name: "Sebastián Vega", attended: true, canceled: false },
  { id: 14, name: "Isabela Silva", attended: false, canceled: true },
  { id: 15, name: "Mateo Navarro", attended: null, canceled: false },
];


const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hours = [
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

const capacities = [5, 10, 15, 20, 25, 30];

export default function GymSchedule() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      label: "Sesion 1",
      day: "Lunes",
      time: "08:00 AM",
      capacity: 10,
      students: mockStudents.slice(0, 5),
    },
    {
      label: "Sesion 2",
      day: "Lunes",
      time: "10:00 AM",
      capacity: 8,
      students: mockStudents.slice(5, 10),
    },
    {
      label: "Sesion 3",
      day: "Martes",
      time: "09:00 AM",
      capacity: 6,
      students: mockStudents.slice(2, 7),
    },
    {
      label: "Sesion ",
      day: "Miércoles",
      time: "10:00 AM",
      capacity: 10,
      students: mockStudents.slice(7, 12),
    },
    {
      label: "Sesion 5",
      day: "Jueves",
      time: "11:00 AM",
      capacity: 12,
      students: mockStudents.slice(0, 6),
    },

  ]);

  const [selected, setSelected] = useState<Session | null>(null);
  const [editing, setEditing] = useState<Session | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const handleUpdate = (updated: Session) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.day === editing?.day && s.time === editing?.time && s.capacity === editing?.capacity ? updated : s
      )
    );
    setEditing(null);
  };

  const handleCreate = (newSession: Session) => {
    const exists = sessions.some(
      (s) => s.day === newSession.day && s.time === newSession.time && s.capacity ===  newSession.capacity
    );
    if (!exists) {
      setSessions((prev) => [...prev, newSession]);
    } else {
      alert("Ya existe una sesión en ese día y hora.");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sesiones creadas</h2>
        <button
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full p-1 hover:bg-gray-200"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(session);
                            }}
                            className="absolute bottom-1 right-1"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
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

      {/* Editar y Eliminar*/}
      {editing && (
        <SessionEditModal
          session={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
          onDelete={(sessionToDelete) => {
            setSessions((prev) =>
              prev.filter(
                (s) => !(s.day === sessionToDelete.day && s.time === sessionToDelete.time && s.capacity === sessionToDelete.capacity)
              )
            );
            setEditing(null);
          }}
        />
      )}

      {/* Crear */}
      {creating && (
        <CreateSessionModal
          onClose={() => setCreating(false)}
          onCreate={handleCreate}
        />
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
  const handleAttendance = (studentId: number, attended: boolean) => {
    const updatedStudents = session.students.map((student) =>
        student.id === studentId ? { ...student, attended } : student
    );
    session.students = updatedStudents; // Actualiza la lista de estudiantes
  };

  return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Detalle de la sesión</h2>
          <p><strong>Nombre:</strong> {session.label}</p>
          <p><strong>Día:</strong> {session.day}</p>
          <p><strong>Hora:</strong> {session.time}</p>
          <p><strong>Capacidad:</strong> {session.capacity}</p>
          <h3 className="text-lg font-semibold mt-4">Estudiantes inscritos:</h3>
          <ul className="space-y-2">
            {session.students.map((student) => (
                <li key={student.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button
                        className="text-gray-600 hover:text-black"
                        onClick={(e) => e.preventDefault()} // Sin funcionalidad por ahora
                    >
                      <UserIcon className="w-5 h-5" />
                    </button>
                    <span>{student.name}</span>
                  </div>
                  <div className="space-x-2">
                    {student.canceled ? (
                        <span className="text-red-500">Sesión cancelada</span>
                    ) : (
                        <>
                          <button
                              onClick={() => handleAttendance(student.id, true)}
                              className={`px-2 py-1 rounded ${
                                  student.attended === true ? "bg-green-500 text-white" : "bg-gray-200"
                              }`}
                          >
                            Asistió
                          </button>
                          <button
                              onClick={() => handleAttendance(student.id, false)}
                              className={`px-2 py-1 rounded ${
                                  student.attended === false ? "bg-red-500 text-white" : "bg-gray-200"
                              }`}
                          >
                            No vino
                          </button>
                        </>
                    )}
                  </div>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

// Modal para editar y eliminar la sesión
function SessionEditModal({
  session,
  onClose,
  onSave,
  onDelete,
}: {
  session: Session;
  onClose: () => void;
  onSave: (s: Session) => void;
  onDelete: (s: Session) => void;
}) {
  const [formData, setFormData] = useState(session);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta sesión?")) {
      onDelete(session);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Editar sesión</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nombre</label>
            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Día</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Hora</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block front-medium">Capacidad</label>
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {capacities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Guardar cambios
            </button>

            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Eliminar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal para crear nueva sesión
function CreateSessionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (session: Session) => void;
}) {
  const [formData, setFormData] = useState<Session>({
    label: "",
    day: "Lunes",
    time: "08:00 AM",
    capacity: 15,
    students: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Crear nueva sesión</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nombre</label>
            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Día</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Hora</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Capacidad</label>
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {capacities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Crear sesión
          </button>
        </div>
      </div>
    </div>
  );
}