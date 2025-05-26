import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

import pectorales from "/src/modules/gym-management/assets/images/pectorales.png";
import dorsales from "/src/modules/gym-management/assets/images/dorsales.png";
import deltoides from "/src/modules/gym-management/assets/images/deltoides.png";
import biceps from "/src/modules/gym-management/assets/images/biceps.png";
import triceps from "/src/modules/gym-management/assets/images/triceps.png";
import abdominales from "/src/modules/gym-management/assets/images/abdominales.png";
import cuadriceps from "/src/modules/gym-management/assets/images/cuadriceps.png";
import isquiotibiales from "/src/modules/gym-management/assets/images/isquiotibiales.png";
import gluteos from "/src/modules/gym-management/assets/images/gluteos.png";

const mockedMuscleGroups = [
  { id: 1, name: "Glúteos", img: gluteos, description: "Rutina para glúteos", exercises: ["Puente de glúteos"], durationDays: 10, difficulty: "Facil" },
  { id: 2, name: "Pecho", img: pectorales, description: "Rutina para pecho", exercises: ["Press de banca"], durationDays: 5, difficulty: "Facil" },
  { id: 3, name: "Espalda", img: dorsales, description: "Rutina para espalda", exercises: ["Fondos"], durationDays: 7, difficulty: "Mediano" },
  { id: 4, name: "Hombros", img: deltoides, description: "Rutina para hombros", exercises: ["Twists rusos"], durationDays: 6, difficulty: "Mediano" },
  { id: 5, name: "Bíceps", img: biceps, description: "Rutina para bíceps", exercises: ["Curl martillo"], durationDays: 4, difficulty: "Mediano" },
  { id: 6, name: "Tríceps", img: triceps, description: "Rutina para tríceps", exercises: ["Extensiones de tríceps"], durationDays: 5, difficulty: "Facil" },
  { id: 7, name: "Abdominales", img: abdominales, description: "Rutina para abdominales", exercises: ["Elevaciones de piernas"], durationDays: 3, difficulty: "Facil" },
  { id: 8, name: "Pierna", img: isquiotibiales, description: "Rutina para pierna", exercises: ["Sentadillas"], durationDays: 2, difficulty: "Dificil" },
  { id: 9, name: "Cuádriceps", img: cuadriceps, description: "Rutina para cuádriceps", exercises: ["Prensa de piernas"], durationDays: 5, difficulty: "Mediano" },
  { id: 10, name: "Gemelos", img: isquiotibiales, description: "Rutina para gemelos", exercises: ["Crunches"], durationDays: 3, difficulty: "Facil" },
];

type Exercise = {
  name: string;
  repetitions: number;
  sets: number;
  duration: number;
  type: string;
  muscleGroup: string[];
  images: string[];
};

const routinesByMuscle: Record<string, Exercise[]> = {
  Glúteos: [
    {
      name: "Puente de glúteos",
      images: ["/src/modules/gym-management/assets/images/gluteos.png"],
      repetitions: 10,
      sets: 2,
      duration: 10,
      type: "CARDIO",
      muscleGroup: ["GLUTEOS"],
    },
  ],
  Pecho: [
    {
    name: "Press banca",
    images: ["/src/modules/gym-management/assets/images/pectorales.png"],
    repetitions: 5,
    sets: 2,
    duration: 10,
    type: "RESISTENCIA",
    muscleGroup: ["PECHO"],
    },
  ],
  Espalda: [
    {
      name: "Fondos",
      images: ["/src/modules/gym-management/assets/images/dorsales.png"],
      repetitions: 2,
      sets: 2,
      duration: 6,
      type: "FUERZA",
      muscleGroup: ["ESPALDA"],
    },
  ],
  Hombros: [
    {
      name: "Twists rusos",
      images: ["/src/modules/gym-management/assets/images/deltoides.png"],
      repetitions: 2,
      sets: 3,
      duration: 3,
      type: "FUERZA",
      muscleGroup: ["HOMBROS"],
    },
  ],
  Biceps: [
    {
      name: "Curl martillo",
      images: ["/src/modules/gym-management/assets/images/biceps.png"],
      repetitions: 4,
      sets: 3,
      duration: 2,
      type: "POTENCIA",
      muscleGroup: ["BICEPS"],
    },
  ],
  Triceps: [
    {
      name: "Extensiones de tríceps",
      images: ["/src/modules/gym-management/assets/images/triceps.png"],
      repetitions: 1,
      sets: 3,
      duration: 5,
      type: "FUERZA",
      muscleGroup: ["TRICEPS"],
    },
  ],
  Abdominales: [
    {
      name: "Elevaciones de piernas",
      images: ["/src/modules/gym-management/assets/images/abdominales.png"],
      repetitions: 3,
      sets: 1,
      duration: 1,
      type: "RECUPERACION",
      muscleGroup: ["ABDOMINALES"],
    },
  ],
  Pierna: [
    {
      name: "Sentadillas",
      images: ["/src/modules/gym-management/assets/images/isquiotibiales.png"],
      repetitions: 2,
      sets: 2,
      duration: 2,
      type: "RESISTENCIA",
      muscleGroup: ["PIERNALES"],
    },
  ],
  Cuádriceps: [
    {
      name: "Prensa de piernas",
      images: ["/src/modules/gym-management/assets/images/cuadriceps.png"],
      repetitions: 5,
      sets: 2,
      duration: 1,
      type: "POTENCIA",
      muscleGroup: ["CUADRICEPS"],
    },
  ],
  Gemelos: [
    {
      name: "Crunches",
      images: ["/src/modules/gym-management/assets/images/isquiotibiales.png"],
      repetitions: 3,
      sets: 4,
      duration: 3,
      type: "RECUPERACION",
      muscleGroup: ["GEMELOS"],
    },
  ],
};

export default function RoutinesPage() {
  const [selectedMuscle, setSelectedMuscle] = React.useState<string | null>(null);

  return (
    <div className="p-4">
      {/* Encabezado negro con título blanco */}
      <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-lg font-semibold">Rutinas</h1>
      </div>

      {/* Tarjetas negras con texto blanco */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white p-4 rounded-b-lg">
        {mockedMuscleGroups.map((muscle) => (
          <div
            key={muscle.name}
            onClick={() => setSelectedMuscle(muscle.name)}
            className="bg-black text-white rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={muscle.img}
              alt={muscle.name}
              className="w-20 h-20 object-contain mb-2"
            />
            <span className="text-center font-semibold">{muscle.name}</span>
          </div>
        ))}
      </div>
      {selectedMuscle && (
        <RoutineDetailModal
          muscleGroup={selectedMuscle}
          onClose={() => setSelectedMuscle(null)}
        />
      )}
    </div>
  );
}

// Modal para ver detalles de la rutina
const RoutineDetailModal = ({
  muscleGroup,
  onClose,
}: {
  muscleGroup: string;
  onClose: () => void;
}) => {
  const routineExercises: Exercise[] = routinesByMuscle[muscleGroup] || [];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (routineExercises.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-black mb-4">
            Músculo: {muscleGroup}
          </h2>
          <p className="text-gray-700">
            No hay rutinas disponibles para este grupo muscular.
          </p>
        </div>
      </div>
    );
  }
  const currentExercise = routineExercises[currentIndex];

  const prevExercise = () => {
    setCurrentIndex((i) => (i === 0 ? routineExercises.length - 1 : i - 1));
  };

  const nextExercise = () => {
    setCurrentIndex((i) => (i === routineExercises.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-4xl relative flex flex-col space-y-6 overflow-y-auto max-h-[90vh]">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Cerrar modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
          Músculo: {muscleGroup} – Ejercicio {currentIndex + 1} de {routineExercises.length}
        </h2>

        {/* Contenido principal */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Imágenes */}
          <div className="flex space-x-4 overflow-x-auto sm:w-1/2">
            {currentExercise.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`rutina-${index}`}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain border rounded-lg shadow"
              />
            ))}
          </div>

          {/* Detalles */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner w-full sm:w-1/2 text-sm sm:text-base space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles del ejercicio</h3>
            <p><span className="font-semibold">Nombre:</span> {currentExercise.name}</p>
            <p><span className="font-semibold">Series:</span> {currentExercise.sets}</p>
            <p><span className="font-semibold">Repeticiones:</span> {currentExercise.repetitions}</p>
            <p><span className="font-semibold">Duración:</span> {currentExercise.duration} minutos</p>
            <p><span className="font-semibold">Tipo:</span> {currentExercise.type}</p>
            <p>
              <span className="font-semibold">Grupos musculares:</span>{" "}
              {Array.isArray(currentExercise.muscleGroup)
                ? currentExercise.muscleGroup.join(", ")
                : currentExercise.muscleGroup}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={prevExercise}
            className="text-gray-700 hover:text-black text-base sm:text-lg transition"
            aria-label="Ejercicio anterior"
          >
            ← Anterior
          </button>
          <button
            onClick={nextExercise}
            className="text-gray-700 hover:text-black text-base sm:text-lg transition"
            aria-label="Ejercicio siguiente"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );

}
