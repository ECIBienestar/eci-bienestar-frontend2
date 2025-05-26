import React from 'react';

interface ClassSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClassSearchBar: React.FC<ClassSearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="search-class" className="block text-sm font-medium text-gray-700 mb-1">
        Buscar Clase
      </label>
      <div className="relative">
        <input
          type="text"
          id="search-class"
          className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Buscar clase por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ClassSearchBar;