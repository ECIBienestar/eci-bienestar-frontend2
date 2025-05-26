// src/components/TeacherTable.tsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { TeacherListItem } from "../hooks/useTeachers";

interface TeacherTableProps {
  displayed: TeacherListItem[];
  filteredCount: number;
  isLoading: boolean;
  selectedIds: Set<number>;
  toggleSelect: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (id: number) => void;
}

const TeacherTable: React.FC<TeacherTableProps> = ({
  displayed,
  filteredCount,
  isLoading,
  selectedIds,
  toggleSelect,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onEdit,
}) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((item) => (
            <tr
              key={item.id}
              className={`border-b hover:bg-gray-50 cursor-pointer ${
                selectedIds.has(item.id) ? "bg-red-100" : ""
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <td className="px-4 py-2 text-gray-500">{item.id}</td>
              <td className="px-4 py-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-200 text-red-800 rounded-full flex items-center justify-center font-semibold">
                  {getInitial(item.name)}
                </div>
                <span className="font-medium text-gray-800">{item.name}</span>
              </td>
              <td className="px-4 py-2 text-gray-500">{item.email}</td>
              <td className="px-4 py-2 flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item.id);
                  }}
                  className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <i className="far fa-edit"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Show stats for ${item.name}`);
                  }}
                  className="text-green-600 hover:text-green-800 p-1.5 hover:bg-gray-100 rounded"
                  title="Stats"
                >
                  <i className="fas fa-chart-bar"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCount === 0 && !isLoading && (
        <p className="text-center text-gray-500 py-4">No data available.</p>
      )}

      {filteredCount > 10 && (
        <div className="flex justify-center items-center space-x-4 p-4">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
