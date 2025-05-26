import React, { useState } from "react";
import Modal from "../../components/common/modal";
import { useCreateClass } from "../../hooks/useClasses";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createNewClass, loading, error, reset } = useCreateClass();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    repetition: "",
    instructorId: "",
    startTime: "",
    endTime: "",
    maxStudents: 0,
    resources: [] as { nombre: string; cantidad: number }[],
  });

  const [resource, setResource] = useState({ nombre: "", cantidad: 0 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "maxStudents") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddResource = () => {
    if (resource.nombre.trim() !== "") {
      setFormData({
        ...formData,
        resources: [...formData.resources, { ...resource }],
      });
      setResource({ nombre: "", cantidad: 0 });
    }
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cantidad") {
      setResource({
        ...resource,
        [name]: parseInt(value) || 0,
      });
    } else {
      setResource({
        ...resource,
        [name]: value,
      });
    }
  };

  const handleRemoveResource = (index: number) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    setFormData({
      ...formData,
      resources: updatedResources,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createNewClass({
      ...formData,
      endTimeRepetition: formData.repetition || null,
    });

    if (result) {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    reset();
    setFormData({
      name: "",
      type: "",
      repetition: "",
      instructorId: "",
      startTime: "",
      endTime: "",
      maxStudents: 0,
      resources: [],
    });
    setResource({ nombre: "", cantidad: 0 });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Nueva Clase">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="Deportiva">Deportiva</option>
            <option value="Cultural">Cultural</option>
            <option value="Académica">Académica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructor
          </label>
          <input
            type="text"
            name="instructorId"
            value={formData.instructorId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de inicio
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de fin
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repetición
          </label>
          <select
            name="repetition"
            value={formData.repetition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Sin repetición</option>
            <option value="Lun/Mar">Lunes y Martes</option>
            <option value="Lun/Mie">Lunes y Miércoles</option>
            <option value="Mar/Jue">Martes y Jueves</option>
            <option value="Mie/Vie">Miércoles y Viernes</option>
            <option value="Jue">Jueves</option>
            <option value="Vie">Viernes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad máxima
          </label>
          <input
            type="number"
            name="maxStudents"
            value={formData.maxStudents}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="1"
            required
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-2">Recursos necesarios</h3>

          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              name="nombre"
              value={resource.nombre}
              onChange={handleResourceChange}
              placeholder="Nombre del recurso"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              name="cantidad"
              value={resource.cantidad || ""}
              onChange={handleResourceChange}
              placeholder="Cantidad"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />
            <button
              type="button"
              onClick={handleAddResource}
              className="bg-[#362550] text-white px-3 py-2 rounded-md hover:bg-purple-700"
            >
              +
            </button>
          </div>

          {formData.resources.length > 0 && (
            <div className="mt-2 border rounded-md overflow-hidden">
              {formData.resources.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b last:border-b-0"
                >
                  <div>
                    {item.nombre} ({item.cantidad})
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#362550] text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClassModal;
