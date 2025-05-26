import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Reserva {
    sala: string;
    diaHora: string;
    juego: string | null;
    estado: "Confirmada" | "Por confirmar";
}

export default function MyReservations() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reservaAEliminar, setReservaAEliminar] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const reservasGuardadas = JSON.parse(localStorage.getItem("reservasCrea") || "[]");
        setReservas(reservasGuardadas);
    }, []);

    const eliminarReserva = (index: number) => {
        const nuevas = reservas.filter((_, i) => i !== index);
        setReservas(nuevas);
        localStorage.setItem("reservasCrea", JSON.stringify(nuevas));
    };

    const abrirModalEliminar = (index: number) => {
        setReservaAEliminar(index);
        setShowConfirmModal(true);
    };

    const confirmarEliminar = () => {
        if (reservaAEliminar !== null) {
            eliminarReserva(reservaAEliminar);
        }
        setShowConfirmModal(false);
        setReservaAEliminar(null);
    };

    const cancelarEliminar = () => {
        setShowConfirmModal(false);
        setReservaAEliminar(null);
    };

    return (
        <div className="p-6">
            {/* Modal de confirmación de eliminación */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            onClick={cancelarEliminar}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Cancelar reserva</h2>
                        <p className="text-center mb-4 text-gray-700">
                            ¿Estás seguro de que deseas cancelar esta reserva?
                        </p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={cancelarEliminar}
                                className="text-gray-600"
                            >
                                No, volver
                            </button>
                            <button
                                onClick={confirmarEliminar}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-green-700">Mis reservas</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/modules/recreation/crea-rooms")}
                        className="text-gray-600"
                    >
                        Reservar
                    </button>
                    <button
                        onClick={() => navigate("/modules/recreation/my-reservations")}
                        className="text-green-600 border-b-2 border-green-600"
                    >
                        Mis reservas
                    </button>
                </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-6">Mis Reservas de Sala CREA</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-separate border-spacing-y-2">
                    <thead>
                    <tr className="bg-green-700 text-white text-sm rounded-lg">
                        <th className="text-left px-4 py-3 rounded-tl-lg">SALA</th>
                        <th className="text-left px-4 py-3">DÍA Y HORA</th>
                        <th className="text-left px-4 py-3">JUEGO/ACTIVIDAD</th>
                        <th className="text-left px-4 py-3">ESTADO</th>
                        <th className="text-center px-4 py-3 rounded-tr-lg">ACCIONES</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservas.map((reserva, idx) => (
                        <tr key={idx} className="bg-white rounded-lg shadow-sm">
                            <td className="px-4 py-3 font-semibold text-sm text-gray-900">{reserva.sala}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{reserva.diaHora}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {reserva.juego ?? <span className="italic text-gray-400">Sin juego</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                                {reserva.estado}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => abrirModalEliminar(idx)}
                                    className="text-green-800 hover:text-red-500"
                                    aria-label="Eliminar reserva"
                                >
                                    <TrashIcon className="h-5 w-5 mx-auto" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {reservas.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center text-gray-500 py-6">
                                No tienes reservas registradas.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}