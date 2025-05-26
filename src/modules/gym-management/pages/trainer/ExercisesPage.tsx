import { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon, } from "@heroicons/react/24/solid";
import mancuernas from "/src/modules/gym-management/assets/images/mancuernas.png";
import barra from "/src/modules/gym-management/assets/images/barra.jpg";
import paralelas from "/src/modules/gym-management/assets/images/paralelas.png";
import mancuernas2 from "/src/modules/gym-management/assets/images/mancuernas2.png";

type Exercise = "" | "CARDIO" | "FLEXIBILIDAD" | "FUERZA" | "RESISTENCIA" | "POTENCIA" | "RECUPERACION";

const mockExercises = [
  {
    name: "Puente de glúteos",
    images: [mancuernas, mancuernas2],
    repetitions: 10,
    sets: 2,
    duration: 10,
    type: "CARDIO" as Exercise,
    muscleGroup: ["GLUTEOS", "PIERNALES"],
  },
  {
    name: "Press banca",
    images: [barra],
    repetitions: 5,
    sets: 2,
    duration: 10,
    type: "RESISTENCIA" as Exercise,
    muscleGroup: ["PECHO"],
  },
  {
    name: "Fondos",
    images: [paralelas],
    repetitions: 2,
    sets: 2,
    duration: 6,
    type: "FUERZA" as Exercise,
    muscleGroup: ["ESPALDA"],
  },
  {
    name: "Twists rusos",
    images: [mancuernas2],
    repetitions: 2,
    sets: 3,
    duration: 3,
    type: "FUERZA" as Exercise,
    muscleGroup: ["HOMBROS"],
  },
  {
    name: "Curl martillo",
    images: [mancuernas],
    repetitions: 4,
    sets: 3,
    duration: 2,
    type: "POTENCIA" as Exercise,
    muscleGroup: ["BICEPS"],
  },
  {
    name: "Extensiones de tríceps",
    images: [barra],
    repetitions: 1,
    sets: 3,
    duration: 5,
    type: "FUERZA" as Exercise,
    muscleGroup: ["TRICEPS"],
  },
  {
    name: "Elevaciones de piernas",
    images: [paralelas],
    repetitions: 3,
    sets: 1,
    duration: 1,
    type: "RECUPERACION" as Exercise,
    muscleGroup: ["ABDOMINALES"],
  },
  {
    name: "Sentadillas",
    images: [mancuernas2],
    repetitions: 2,
    sets: 2,
    duration: 2,
    type: "RESISTENCIA" as Exercise,
    muscleGroup: ["PIERNALES"],
  },
  {
    name: "Prensa de piernas",
    images: [mancuernas],
    repetitions: 5,
    sets: 2,
    duration: 1,
    type: "POTENCIA" as Exercise,
    muscleGroup: ["CUADRICEPS"],
  },
  {
    name: "Crunches",
    images: [barra],
    repetitions: 3,
    sets: 4,
    duration: 3,
    type: "RECUPERACION" as Exercise,
    muscleGroup: ["GEMELOS"],
  },
];


export const ExercisesPage = () => {
  const [exercises, setExercises] = useState(mockExercises);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState<{
    name: string;
    image: File | string;
    repetitions: number;
    sets: number;
    duration: number;
    type: "" | Exercise;
    muscleGroup: string;
  }>({
    name: "",
    image: "",  
    repetitions: 0,
    sets: 0,
    duration: 0,
    type: "",
    muscleGroup: "",
  });

  const currentExercise = exercises[currentIndex];

  const goNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddExercise = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  const newEx = {
    name: newExercise.name,
    images: [
      typeof newExercise.image === "string"
        ? newExercise.image
        : URL.createObjectURL(newExercise.image as File),
    ],
    repetitions: newExercise.repetitions,
    sets: newExercise.sets,
    duration: newExercise.duration,
    type: newExercise.type as Exercise,
    muscleGroup: newExercise.muscleGroup.split(",").map((m) => m.trim()),
  };

  if (isEditing && editIndex !== null) {
    const updated = [...exercises];
    updated[editIndex] = newEx;
    setExercises(updated);
    setCurrentIndex(editIndex);
  } else {
    setExercises([...exercises, newEx]);
    setCurrentIndex(exercises.length);
  }

  setNewExercise({ name: "", image: "", repetitions: 0, sets: 0, duration: 0, type: "", muscleGroup: "" });
  setIsModalOpen(false);
  setIsEditing(false);
  setEditIndex(null);
};

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [] = useState<string | null>(null);


   return (
    <div className="p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 bg-black text-white p-3 rounded-t-lg">
        <h2 className="text-xl font-semibold">{currentExercise.name}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewExercise({
                name: currentExercise.name,
                image: currentExercise.images[0] || "",
                repetitions: currentExercise.repetitions,
                sets: currentExercise.sets,
                duration: currentExercise.duration,
                type: currentExercise.type,
                muscleGroup: currentExercise.muscleGroup.join(", "),
              });
              setEditIndex(currentIndex);
              setIsEditing(true);
              setIsModalOpen(true);
            }}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200"
            aria-label="Editar ejercicio"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="bg-white text-black p-2 rounded-full hover:bg-red-200"
            aria-label="Eliminar ejercicio"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setNewExercise({ name: "", image: "", repetitions: 0, sets: 0, duration: 0, type: "", muscleGroup: "" });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200"
            aria-label="Agregar ejercicio"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </header>


      {/* Imágenes */}
      <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
        {currentExercise.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Ejercicio ${idx}`}
            className="w-[150px] h-[200px] object-contain rounded-lg shadow bg-white"
          />
        ))}
      </div>
      {/* Información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="bg-white border rounded-lg shadow-md">
          <h3 className="bg-black text-white p-2 rounded-t-md font-semibold">
            Datos del ejercicio
          </h3>
          <div className="p-4 text-sm">
            <p><strong>Repeticiones:</strong> {currentExercise.repetitions}</p>
            <p><strong>Series:</strong> {currentExercise.sets}</p>
            <p><strong>Duración:</strong> {currentExercise.duration} segundos</p>
            <p><strong>Tipo:</strong> {currentExercise.type}</p>
            <p><strong>Grupo muscular:</strong> {currentExercise.muscleGroup.join(", ")}</p>
          </div>
        </div>
        
      </div>

      {/* Navegación */}
      <div className="flex justify-center gap-6 pt-4">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="text-gray-700 hover:text-black text-base sm:text-lg transition"
        >
          ← Anterior
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === exercises.length - 1}
          className="text-gray-700 hover:text-black text-base sm:text-lg transition"
        >
          Siguiente →
        </button>
      </div>

      {/* Modal de ejercicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-md relative overflow-y-auto max-h-[90vh] p-4 sm:p-6">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-4">Agregar nuevo ejercicio</h3>
            <form onSubmit={handleAddExercise} className="space-y-3">
              <label className="block font-semibold text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block font-semibold text-gray-700">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewExercise({ ...newExercise, image: file });
                  }
                }}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block font-semibold text-gray-700">Repeticiones</label>
              <input
                type="number"
                value={newExercise.repetitions}
                onChange={(e) => setNewExercise({ ...newExercise, repetitions: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block font-semibold text-gray-700">Series</label>
              <input
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block font-semibold text-gray-700">Duración</label>
              <input
                type="number"
                placeholder="Duración (segundos)"
                value={newExercise.duration}
                onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded"
              />

              <label className="block font-semibold text-gray-700">Tipo de ejercicio</label>
              <select
                value={newExercise.type}
                onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value as Exercise })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Tipo de ejercicio</option>
                <option value="CARDIO">Cardio</option>
                <option value="STRENGTH">Fuerza</option>
                <option value="FLEXIBILITY">Flexibilidad</option>
              </select>

              <label className="block font-semibold text-gray-700">Grupo muscular</label>
              <input
                type="text"
                placeholder="Grupo muscular (separado por comas)"
                value={newExercise.muscleGroup}
                onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <button
                type="submit"
                className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
              >
                {isEditing ? "Guardar cambios" : "Agregar ejercicio"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">¿Eliminar ejercicio?</h3>
            <p className="text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const updated = [...exercises];
                  updated.splice(currentIndex, 1);
                  setExercises(updated);
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setIsConfirmOpen(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExercisesPage;

