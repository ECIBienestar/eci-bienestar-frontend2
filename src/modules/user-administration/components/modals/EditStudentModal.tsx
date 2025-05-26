// src/components/EditStudentModal.tsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface EditStudentModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formError: string | null;

  stuId: string;
  stuIdType: string;
  stuFullName: string;
  stuPhone: string;
  stuEmail: string;
  stuPassword: string;
  stuCode: string;
  stuProgram: string;
  stuSemester: number;
  stuBirthDate: string;
  stuAddress: string;

  setStuId: (v: string) => void;
  setStuIdType: (v: string) => void;
  setStuFullName: (v: string) => void;
  setStuPhone: (v: string) => void;
  setStuEmail: (v: string) => void;
  setStuPassword: (v: string) => void;
  setStuCode: (v: string) => void;
  setStuProgram: (v: string) => void;
  setStuSemester: (v: number) => void;
  setStuBirthDate: (v: string) => void;
  setStuAddress: (v: string) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  formError,

  stuId,
  stuIdType,
  stuFullName,
  stuPhone,
  stuEmail,
  stuPassword,
  stuCode,
  stuProgram,
  stuSemester,
  stuBirthDate,
  stuAddress,

  setStuId,
  setStuIdType,
  setStuFullName,
  setStuPhone,
  setStuEmail,
  setStuPassword,
  setStuCode,
  setStuProgram,
  setStuSemester,
  setStuBirthDate,
  setStuAddress,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-4">Editar Estudiante</h3>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Sección de información del estudiante */}
          <div className="border border-gray-200 rounded p-4">
            <h4 className="text-xl font-medium mb-3">Información del Estudiante</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={stuId}
                  onChange={(e) => setStuId(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de ID</label>
                <select
                  value={stuIdType}
                  onChange={(e) => setStuIdType(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="ANI">ANI</option>
                  <option value="CC">CC</option>
                  <option value="TI">TI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Nombre Completo</label>
                <input
                  type="text"
                  value={stuFullName}
                  onChange={(e) => setStuFullName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefono</label>
                <input
                  type="text"
                  value={stuPhone}
                  onChange={(e) => setStuPhone(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Correo</label>
                <input
                  type="email"
                  value={stuEmail}
                  onChange={(e) => setStuEmail(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={stuPassword}
                  onChange={(e) => setStuPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Codigo del Estudiante</label>
                <input
                  type="text"
                  value={stuCode}
                  onChange={(e) => setStuCode(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Programa</label>
                <select
                  value={stuProgram}
                  onChange={(e) => setStuProgram(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="BIOMEDICAL_ENGINEERING">Ingeniería Biomédica</option>
                  <option value="BIOTECHNOLOGY_ENGINEERING">Ingeniería en Biotecnología</option>
                  <option value="BUSINESS_ADMINISTRATION">Administración de Empresas</option>
                  <option value="CIVIL_ENGINEERING">Ingeniería Civil</option>
                  <option value="CYBERSECURITY_ENGINEERING">Ingeniería de Ciberseguridad</option>
                  <option value="ECONOMICS">Economía</option>
                  <option value="ELECTRICAL_ENGINEERING">Ingeniería Eléctrica</option>
                  <option value="ELECTRONIC_ENGINEERING">Ingeniería Electrónica</option>
                  <option value="ENVIRONMENTAL_ENGINEERING">Ingeniería Ambiental</option>
                  <option value="INDUSTRIAL_ENGINEERING">Ingeniería Industrial</option>
                  <option value="MATHEMATICS">Matemáticas</option>
                  <option value="MECHANICAL_ENGINEERING">Ingeniería Mecánica</option>
                  <option value="OTHER">Otro</option>
                  <option value="SOFTWARE_ENGINEERING">Ingeniería de Sistemas</option>
                  <option value="STATISTICAL_ENGINEERING">Ingeniería Estadística</option>
                  <option value="AI_ENGINEERING">Ingeniería en Inteligencia Artificial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Semestre</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={stuSemester}
                  onChange={(e) => setStuSemester(Number(e.target.value))}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={stuBirthDate}
                  onChange={(e) => setStuBirthDate(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Dirección</label>
                <input
                  type="text"
                  value={stuAddress}
                  onChange={(e) => setStuAddress(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
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
              {isSubmitting ? "Updating..." : "Actualizar Estudiante"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
