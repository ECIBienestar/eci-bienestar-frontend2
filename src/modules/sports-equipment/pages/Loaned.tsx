    import React, { useEffect, useState } from "react";
    import { getActiveLoansByUser } from "../services/loanService";

    interface Reservation {
        id: string;
        nombreItem: string;
        fecha: string;
        horaInicio: string;
        horaFin: string;
    }

    const horas = Array.from({ length: 13 }, (_, i) => 7 + i);
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const Loaned: React.FC = () => {
        const [reservas, setReservas] = useState<Reservation[]>([]);
        const [selectedReserva, setSelectedReserva] = useState<Reservation | null>(null);
        const today = new Date();
        const startOfWeek = new Date(today);
        const day = today.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        startOfWeek.setDate(today.getDate() + diffToMonday + 7);

        useEffect(() => {
            const loadReservations = async () => {
                try {
                    const loans = await getActiveLoansByUser("123");
                    const mapped = loans.map((loan: any) => {
                        const loanDate = new Date(loan.dateAndTimeLoan);
                        const returnDate = new Date(loan.dateAndTimeScheduleReturn);
                        return {
                            id: loan.id,
                            nombreItem: loan.equipmentName || "Equipo",
                            fecha: loanDate.toLocaleDateString("sv-SE"),
                            horaInicio: loanDate.toTimeString().slice(0, 5),
                            horaFin: returnDate.toTimeString().slice(0, 5),
                        };
                    });

                    setReservas(mapped);
                } catch (error) {
                    console.error("Error cargando préstamos activos:", error);
                }
            };
            loadReservations();
        }, []);

        const getDayDate = (offset: number) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + offset);
            return d.toLocaleDateString("sv-SE");
        };

        const isReserved = (day: string, hour: number) => {
            return reservas.find((res) => {
                const [startHour] = res.horaInicio.split(":").map(Number);
                const [endHour] = res.horaFin.split(":").map(Number);
                return res.fecha == day && hour >= startHour && hour < endHour;
            });
        };

        return (
            <div className="overflow-auto p-6 bg-gray-50 min-h-screen">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Calendario de Préstamos</h2>
                <div className="grid grid-cols-8 border border-gray-300 rounded-lg shadow overflow-hidden">
                    <div className="bg-[#f3f4f6] p-2 font-semibold text-sm text-center border-b border-gray-300">
                        Hora
                    </div>
                    {dias.map((dia, i) => (
                        <div
                            key={i}
                            className="bg-[#f3f4f6] p-2 font-semibold text-sm text-center border-b border-gray-300"
                        >
                            {dia}
                        </div>
                    ))}

                    {horas.map((hora) => (
                        <React.Fragment key={hora}>
                            <div className="border p-2 text-sm font-medium text-center bg-white text-gray-700 border-gray-300">
                                {hora}:00
                            </div>
                            {dias.map((_, dayIndex) => {
                                const dateStr = getDayDate(dayIndex);
                                const reserva = isReserved(dateStr, hora);
                                return (
                                    <div
                                        key={`${hora}-${dayIndex}`}
                                        className={`border border-gray-300 h-20 text-xs p-1 flex items-center justify-center transition-all duration-150 ${
                                            reserva
                                                ? "bg-green-100 text-green-900 font-semibold rounded-sm shadow-inner"
                                                : "bg-white"
                                        }`}
                                    >
                                        {reserva && (
                                            <div className="text-center text-[10px] leading-tight">
                                                <div className="font-bold truncate">{reserva.nombreItem}</div>
                                                <div className="text-gray-700">
                                                    {reserva.horaInicio} - {reserva.horaFin}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    export default Loaned;
