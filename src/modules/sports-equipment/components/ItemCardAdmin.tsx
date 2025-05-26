import React from 'react';

interface ItemCardAdminProps {
    id: number;
    label: string;
    image: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const ItemCardAdmin: React.FC<ItemCardAdminProps> = ({ id, label, image, onEdit, onDelete }) => {
    return (
        <div className="rounded-lg overflow-hidden shadow transition border-2 border-[#4B1E0D] bg-white">
            <div className="px-4 pt-4 pb-2 flex flex-col items-center justify-center">
                <img src={image} alt={label} className="w-32 h-32 object-contain mb-2" />
                <div className="text-center text-white bg-[#4B1E0D] mt-2 w-full py-2 rounded-md font-semibold text-sm">
                    {label}
                </div>
            </div>
            <div className="flex justify-around mt-4 pb-4">
                <button
                    onClick={() => onEdit(id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default ItemCardAdmin;
