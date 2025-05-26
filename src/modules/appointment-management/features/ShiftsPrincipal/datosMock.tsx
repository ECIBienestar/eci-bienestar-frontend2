import { Shift } from "../../../appointment-management/models/shift";
import { User } from "../../../appointment-management/models/User";
import { CarroselItem } from "../../types/carroselType";

export const carroselItems: CarroselItem[] = [
  {
    id: 1,
    type: "image",
    title: "Programa de bienestar",
    duration: 4,
    url: "https://cdn.pixabay.com/photo/2020/10/02/09/01/tablets-5620566_1280.jpg",
  },
  {
    id: 2,
    type: "image",
    title: "Programa de bienestar",
    duration: 4,
    url: "https://cdn.pixabay.com/photo/2020/10/02/09/01/tablets-5620566_1280.jpg",
  },
  {
    id: 3,
    type: "image",
    title: "Programa de salud mental",
    duration: 3,
    url: "https://cdn.pixabay.com/photo/2017/10/07/14/55/depression-2826711_1280.jpg",
  },
  {
    id: 4,
    type: "image",
    title: "Programa de odontología",
    duration: 4,
    url: "https://cdn.pixabay.com/photo/2015/03/11/05/03/dentistry-668191_1280.jpg",
  },
];

export const shiftItems: Shift[] = [
  {
    id: "1",
    code: "M-43",
    specialty: "Medicina general",
    priority: 1,
    date: "2023-10-01",
    status: "Pending",
    levelAtention: "Normal",
    UserId: "user-001",
  },
  {
    id: "2",
    code: "P-17",
    specialty: "Psicologia",
    priority: 2,
    date: "2023-10-02",
    status: "Completed",
    levelAtention: "High",
    UserId: "user-002",
  },
  {
    id: "3",
    code: "O-12",
    specialty: "Odontologia",
    priority: 3,
    date: "2023-10-03",
    status: "Pending",
    levelAtention: "Low",
    UserId: "user-003",
  },
  {
    id: "4",
    code: "P-215",
    specialty: "Psicologia",
    priority: 1,
    date: "2023-10-04",
    status: "In Progress",
    levelAtention: "Medium",
    UserId: "user-004",
  },
];

export const users: User[] = [
  {
    id: "user-001",
    name: "María González",
    role: "Paciente",
    shifts: [shiftItems[0]],
  },
  {
    id: "user-002",
    name: "Carlos Pérez",
    role: "Paciente",
    shifts: [shiftItems[1]],
  },
  {
    id: "user-003",
    name: "Lucía Fernández",
    role: "Paciente",
    shifts: [shiftItems[2]],
  },
  {
    id: "user-004",
    name: "Juan Ramírez",
    role: "Paciente",
    shifts: [shiftItems[3]],
  },
];

export const enrichedShiftItems = shiftItems.map((shift) => {
  const user = users.find((u) => u.id === shift.UserId);
  return {
    ...shift,
    turn: shift.code,
    namePatient: user?.name || "Paciente desconocido",
  };
});
