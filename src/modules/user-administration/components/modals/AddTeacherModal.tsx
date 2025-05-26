// src/components/AddTeacherModal.tsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface AddTeacherModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formError: string | null;

  teacherId: string;
  teacherIdType: string;
  teacherFullName: string;
  teacherPhone: string;
  teacherEmail: string;
  teacherPassword: string;

  setTeacherId: (v: string) => void;
  setTeacherIdType: (v: string) => void;
  setTeacherFullName: (v: string) => void;
  setTeacherPhone: (v: string) => void;
  setTeacherEmail: (v: string) => void;
  setTeacherPassword: (v: string) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  formError,

  teacherId,
  teacherIdType,
  teacherFullName,
  teacherPhone,
  teacherEmail,
  teacherPassword,

  setTeacherId,
  setTeacherIdType,
  setTeacherFullName,
  setTeacherPhone,
  setTeacherEmail,
  setTeacherPassword,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-4">Añadir Profesor</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Teacher Info Section */}
          <div className="border border-gray-200 rounded p-4">
            <h4 className="text-xl font-medium mb-3">Información del Profesor</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de ID</label>
                <select
                  value={teacherIdType}
                  onChange={(e) => setTeacherIdType(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                >
                  <option value="ANI">ANI</option>
                  <option value="CC">CC</option>
                  <option value="TI">TI</option>
                  <option value="NIP">NIP</option>
                  <option value="NUIP">NUIP</option>
                  <option value="PA">PA</option>
                  <option value="RC">RC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Nombre Completo</label>
                <input
                  type="text"
                  value={teacherFullName}
                  onChange={(e) => setTeacherFullName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefono</label>
                <input
                  type="text"
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Correo</label>
                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
            </div>
          </div>

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Crear Profesor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherModal;
