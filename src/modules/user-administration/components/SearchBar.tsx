// src/components/SearchBar.tsx
import React, { ChangeEvent } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface SearchBarProps {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
  onDeleteClick: () => void;
  disableDelete: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onAddClick,
  onDeleteClick,
  disableDelete,
}) => (
  <div className="flex items-center mb-6 space-x-2">
    <input
      type="text"
      value={query}
      onChange={onChange}
      placeholder="Busca por nombre o correo… 🔍"
      className="flex-1 p-2 border border-gray-300 rounded"
    />
    <button
      onClick={onAddClick}
      className="text-white bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center"
      title="Add Student"
    >
      <i className="fas fa-plus"></i>
    </button>
    <button
      onClick={onDeleteClick}
      disabled={disableDelete}
      className="text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50"
      title="Delete Selected"
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  </div>
);

export default SearchBar;
