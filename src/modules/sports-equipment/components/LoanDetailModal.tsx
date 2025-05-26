import React from "react";

interface LoanDetail {
    id: number;
    usuario: string;
    nombreArticulo: string;
    estado: string;
    fechaPrestamo: string;
    horaInicio: string;
    horaFin: string;
    descripcion: string;
    imagen?: string;
}

interface LoanDetailsModalProps {
    isOpen: boolean,
    onClose: () => void,
    data?: LoanDetail | null,
}

const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({isOpen, onClose, data}) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                    &times;
                </button>

                <h2 className="text-lg font-bold mb-4">Panel de Información</h2>

                <div className="flex justify-center mb-4">
                    <img
                        src={data.imagen || "https://via.placeholder.com/100"}
                        alt={data.nombreArticulo}
                        className="w-24 h-24 object-contain"
                    />
                </div>

                <div className="text-sm text-gray-800 space-y-1">
                    <p><strong>Id del artículo:</strong> {data.id}</p>
                    <p><strong>Usuario:</strong> {data.usuario}</p>
                    <p><strong>Nombre del artículo:</strong> {data.nombreArticulo}</p>
                    <p><strong>Estado durante el préstamo:</strong> {data.estado}</p>
                    <p><strong>Fecha de préstamo:</strong> {data.fechaPrestamo}</p>
                    <p><strong>Hora de inicio:</strong> {data.horaInicio}</p>
                    <p><strong>Hora de fin:</strong> {data.horaFin}</p>
                    <p><strong>Descripción:</strong> {data.descripcion}</p>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-[#5b2c06] text-white px-4 py-1 rounded hover:bg-[#4a2304]"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanDetailsModal;
