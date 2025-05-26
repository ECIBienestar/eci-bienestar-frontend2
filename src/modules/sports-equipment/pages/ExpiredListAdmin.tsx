import { useEffect, useState } from "react";

interface ReservaEntregada {
    id: string;
    equipmentId: string;
    userName: string;
    userId: string;
    dateAndTimeLoan: string;
    loanStatus: string;
    dateAndTimeScheduleReturn: string;
    duration: string;
}

const Expired = () => {
    const [reservas, setReservas] = useState<ReservaEntregada[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntregados = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    'https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0/loans/returned-by-user',
                    {
                        method: 'GET',
                        headers: {
                            'Accept': '*/*',
                            'user-id': '123'  // mock userId
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error en la respuesta: ${response.status}`);
                }

                const data: ReservaEntregada[] = await response.json();

                setReservas(data);
            } catch (error) {
                console.error("Error al cargar reservas entregadas:", error);
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEntregados();
    }, []);

    return (
        <div className="px-4 py-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Artículos entregados</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : reservas.length === 0 ? (
                <p>No hay artículos entregados.</p>
            ) : (
                <ul className="space-y-4">
                    {reservas.map((reserva) => (
                        <li
                            key={reserva.id}
                            className="bg-white border-l-4 border-green-600 shadow-md rounded-lg p-4 flex flex-col"
                        >
                            <span className="text-lg font-semibold text-gray-800">ID Equipo: {reserva.equipmentId}</span>
                            <span className="text-sm text-gray-600 mb-1">Usuario: {reserva.userName}</span>
                            <span className="text-sm text-green-600 font-medium">
                                Fecha y hora préstamo: {new Date(reserva.dateAndTimeLoan).toLocaleString()}
                            </span>
                            <span className="text-sm text-green-600 font-medium">
                                Fecha y hora devolución: {new Date(reserva.dateAndTimeScheduleReturn).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">Duración: {reserva.duration}</span>
                            <span className="text-sm text-gray-600">Estado: {reserva.loanStatus}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Expired;
