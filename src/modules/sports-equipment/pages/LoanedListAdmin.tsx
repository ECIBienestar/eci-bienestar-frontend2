import { useEffect, useState } from "react";
import LoanDetailsModal from "../components/LoanDetailModal";
import { getActiveLoansByUser } from "../services/loanService";

interface Loan {
    id: string;
    usuario: string;
    nombreArticulo: string;
    estado: string;
    fechaPrestamo: string;
    horaInicio: string;
    horaFin: string;
    descripcion: string;
    imagen?: string;
}

const ActiveLoans = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            setLoading(true);
            try {
                const data = await getActiveLoansByUser("123");

                const mappedLoans: Loan[] = data.map((item: any) => {
                    const loanDate = new Date(item.dateAndTimeLoan);
                    const returnDate = new Date(item.dateAndTimeScheduleReturn);

                    return {
                        id: item.id,
                        usuario: item.userName,
                        nombreArticulo: item.equipmentName || item.equipmentId,
                        estado: item.loanStatus,
                        fechaPrestamo: loanDate.toLocaleString(),
                        horaInicio: loanDate.toTimeString().slice(0, 5),
                        horaFin: returnDate.toTimeString().slice(0, 5),
                        descripcion: item.duration || "N/A",
                        imagen: item.equipmentImage || undefined
                    };
                });

                setLoans(mappedLoans);
            } catch (err) {
                console.error("Error fetching loans:", err);
                setLoans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    const openModal = (loan: Loan) => {
        setSelectedLoan(loan);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLoan(null);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Tus Reservas Activas</h2>

            {loading ? (
                <p>Cargando reservas...</p>
            ) : loans.length === 0 ? (
                <p>No tienes reservas activas por el momento.</p>
            ) : (
                <ul className="space-y-4">
                    {loans.map((loan) => (
                        <li
                            key={loan.id}
                            onClick={() => openModal(loan)}
                            className="bg-white border-l-4 border-green-600 shadow-md rounded-lg p-4 flex flex-col cursor-pointer hover:shadow-lg transition"
                        >
                            <span className="text-lg font-semibold text-gray-800">
                                {loan.nombreArticulo}
                            </span>
                            <span className="text-sm text-gray-600 mb-1">Usuario: {loan.usuario}</span>
                            <span className="text-sm text-green-600 font-medium">
                                Fecha y hora préstamo: {loan.fechaPrestamo}
                            </span>
                            <span className="text-sm text-green-600 font-medium">
                                Hora fin: {loan.horaFin}
                            </span>
                            <span className="text-sm text-gray-600">Duración: {loan.descripcion}</span>
                            <span className="text-sm text-gray-600">Estado: {loan.estado}</span>
                        </li>
                    ))}
                </ul>
            )}

            <LoanDetailsModal isOpen={modalOpen} onClose={closeModal} data={selectedLoan} />
        </div>
    );
};

export default ActiveLoans;
