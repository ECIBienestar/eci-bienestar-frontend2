import React from 'react';
import { Class } from '../../services/classesService';
import Pagination from '../common/pagination';
import { formatSchedule, formatCapacity } from '../../utils/timeFormatUtils';

interface ClassManagementListProps {
  classes: Class[];
  currentClasses: Class[];
  currentPage: number;
  totalPages: number;
  deleteLoading: boolean;
  formatTime: (time: string) => string;
  handleOpenEditModal: (classItem: Class) => void;
  handleDelete: (id: string) => void;
  paginate: (pageNumber: number) => void;
}

const ClassManagementList: React.FC<ClassManagementListProps> = ({
  classes,
  currentClasses,
  currentPage,
  totalPages,
  deleteLoading,
  formatTime,
  handleOpenEditModal,
  handleDelete,
  paginate,
}) => { 
  
  if (classes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay clases disponibles. Agrega una nueva clase para empezar.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="rounded-3xl overflow-hidden border-2 border-[#362550]">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#362550] text-white">
              <tr>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">Tipo</th>
                <th className="py-4 px-6 text-left">Instructor</th>
                <th className="py-4 px-6 text-left">Horario</th>
                <th className="py-4 px-6 text-left">Capacidad</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentClasses.map((classItem) => (
                <tr key={classItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{classItem.name}</td>
                  <td className="py-4 px-6">{classItem.type}</td>
                  <td className="py-4 px-6">{classItem.instructorId}</td>
                  <td className="py-4 px-6">
                    {formatSchedule(classItem, formatTime)}
                  </td>
                  <td className="py-4 px-6">
                    {formatCapacity(0, classItem.maxStudents)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleOpenEditModal(classItem)}
                        className="text-[#362550] hover:text-purple-700 mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(classItem.id)}
                        className="text-[#362550] hover:text-red-800 ml-2"
                        disabled={deleteLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </>
  );
};

export default ClassManagementList;