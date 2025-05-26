import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface EditDoctorModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formError: string | null;

  doctorId: string;
  doctorIdType: string;
  doctorFullName: string;
  doctorPhone: string;
  doctorEmail: string;
  doctorPassword: string;
  doctorRole: "MEDICAL_SECRETARY" | "MEDICAL_STAFF";
  doctorSpecialty: string;

  setDoctorId: (v: string) => void;
  setDoctorIdType: (v: string) => void;
  setDoctorFullName: (v: string) => void;
  setDoctorPhone: (v: string) => void;
  setDoctorEmail: (v: string) => void;
  setDoctorPassword: (v: string) => void;
  setDoctorRole: (v: "MEDICAL_SECRETARY" | "MEDICAL_STAFF") => void;
  setDoctorSpecialty: (v: string) => void;
}

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  formError,

  doctorId,
  doctorIdType,
  doctorFullName,
  doctorPhone,
  doctorEmail,
  doctorPassword,
  doctorRole,
  doctorSpecialty,

  setDoctorId,
  setDoctorIdType,
  setDoctorFullName,
  setDoctorPhone,
  setDoctorEmail,
  setDoctorPassword,
  setDoctorRole,
  setDoctorSpecialty,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-4">Editar Doctor</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Doctor Info Section */}
          <div className="border border-gray-200 rounded p-4">
            <h4 className="text-xl font-medium mb-3">Información del Doctor</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de ID</label>
                <select
                  value={doctorIdType}
                  onChange={(e) => setDoctorIdType(e.target.value)}
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
                  value={doctorFullName}
                  onChange={(e) => setDoctorFullName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Correo</label>
                <input
                  type="email"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={doctorPassword}
                  onChange={(e) => setDoctorPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rol</label>
                <select
                  value={doctorRole}
                  onChange={(e) =>
                    setDoctorRole(e.target.value as "MEDICAL_SECRETARY" | "MEDICAL_STAFF")
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="MEDICAL_SECRETARY">Secretario Médico</option>
                  <option value="MEDICAL_STAFF">Personal Médico</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Especialidad</label>
                <input
                  type="text"
                  value={doctorSpecialty}
                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  placeholder="Ej. CARDIOLOGÍA"
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
              {isSubmitting ? "Actualizando..." : "Actualizar Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorModal;