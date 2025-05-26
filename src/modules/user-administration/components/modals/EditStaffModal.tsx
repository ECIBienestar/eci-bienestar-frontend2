// src/components/EditStaffModal.tsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface EditStaffModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formError: string | null;

  staffId: string;
  staffIdType: string;
  staffFullName: string;
  staffPhone: string;
  staffEmail: string;
  staffPassword: string;
  staffRole:
    | "GENERAL_SERVICES_STAFF"
    | "PREFECT"
    | "TRAINER"
    | "WELLNESS_STAFF"
    | "MONITOR";
  staffSpecialty: string;

  setStaffId: (v: string) => void;
  setStaffIdType: (v: string) => void;
  setStaffFullName: (v: string) => void;
  setStaffPhone: (v: string) => void;
  setStaffEmail: (v: string) => void;
  setStaffPassword: (v: string) => void;
  setStaffRole: (v: "GENERAL_SERVICES_STAFF" | "PREFECT" | "TRAINER" | "WELLNESS_STAFF" | "MONITOR") => void;
  setStaffSpecialty: (v: string) => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  formError,

  staffId,
  staffIdType,
  staffFullName,
  staffPhone,
  staffEmail,
  staffPassword,
  staffRole,
  staffSpecialty,

  setStaffId,
  setStaffIdType,
  setStaffFullName,
  setStaffPhone,
  setStaffEmail,
  setStaffPassword,
  setStaffRole,
  setStaffSpecialty,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-4">Editar Staff</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="border border-gray-200 rounded p-4">
            <h4 className="text-xl font-medium mb-3">Información del Staff</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de ID</label>
                <select
                  value={staffIdType}
                  onChange={(e) => setStaffIdType(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
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
                  value={staffFullName}
                  onChange={(e) => setStaffFullName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Correo</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rol</label>
                <select
                  value={staffRole}
                  onChange={(e) =>
                    setStaffRole(
                      e.target.value as
                        | "GENERAL_SERVICES_STAFF"
                        | "PREFECT"
                        | "TRAINER"
                        | "WELLNESS_STAFF"
                        | "MONITOR"
                    )
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="GENERAL_SERVICES_STAFF">Servicios Generales</option>
                  <option value="PREFECT">Prefecto</option>
                  <option value="TRAINER">Entrenador</option>
                  <option value="WELLNESS_STAFF">Staff de Bienestar</option>
                  <option value="MONITOR">Monitor</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Especialidad</label>
                <input
                  type="text"
                  value={staffSpecialty}
                  onChange={(e) => setStaffSpecialty(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  placeholder="Ej. REHABILITACIÓN (opcional)"
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
              {isSubmitting ? "Actualizando..." : "Actualizar Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
