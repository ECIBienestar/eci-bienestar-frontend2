import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemsByCategory } from "../services/itemService";
import { createLoan } from "../services/itemService";

interface Item {
    id: string;
    nombre: string;
    descripcion?: string;
    estado?: "bueno" | "regular" | "malo";
    categoria?: string;
    disponible: boolean;
    imagen?: string;
}


const VALID_CATEGORIES = ["futbol", "basket", "voley", "raquetas", "pelotas", "equipamiento"];

const ItemList = () => {
    const { id } = useParams();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [formData, setFormData] = useState({
        fecha: "",
        horaInicio: "",
        horaFin: "",
    });

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            setError(null);
            try {
                if (id) {
                    if (VALID_CATEGORIES.includes(id)) {
                        const data = await getItemsByCategory(id);
                        setItems(data as Item[]);
                    } else {
                        setItems([]);
                    }
                } else {    
                    setItems([]);
                }
            } catch (err) {
                setError("Ocurrió un error al cargar los artículos.");
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleReserve = async () => {
        if (!selectedItem) return;


        if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
            alert("Por favor completa todos los campos.");
            return;
        }

        try {

            const startDate = new Date(`${formData.fecha}T${formData.horaInicio}`);
            const endDate = new Date(`${formData.fecha}T${formData.horaFin}`);
            const dateAndTimeLoan = startDate.toLocaleString("sv-SE").replace(" ", "T");
            const dateAndTimeScheduleReturn = endDate.toLocaleString("sv-SE").replace(" ", "T");



            const loanData = {
                id: crypto.randomUUID(),
                equipmentId: selectedItem.id,
                userName: "usuario_demo",
                userId: "123",
                dateAndTimeLoan: dateAndTimeLoan,
                loanStatus: "EN_PRESTAMO",
                dateAndTimeScheduleReturn: dateAndTimeScheduleReturn,
                duration: `1h`,
            };


            await createLoan(loanData);


            alert("Reserva realizada exitosamente.");
            setSelectedItem(null);
            setFormData({ fecha: "", horaInicio: "", horaFin: "" });
        } catch (error) {
            console.error("Error al realizar reserva:", error);
            alert("No se pudo realizar la reserva. Intenta más tarde.");
        }
    };



    return (
        <div className="px-4 py-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Disponibles en: {id}
            </h2>

            {loading ? (
                <p className="text-gray-600">Cargando artículos...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : items.length === 0 ? (
                <p className="text-gray-600">No hay artículos disponibles.</p>
            ) : (
                <ul className="space-y-6">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition"
                        >
                            <div className="flex items-center space-x-6 w-full">
                                <img
                                    src={item.imagen || "https://via.placeholder.com/120"}
                                    alt={item.nombre}
                                    className="w-28 h-28 object-contain rounded-md border"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.nombre}</h3>
                                    <p className="text-gray-700 mb-1">{item.descripcion || "Sin descripción"}</p>
                                    <p className="text-gray-700 mb-1">
                                        Estado:{" "}
                                        <span className="font-medium capitalize">
                                        {item.estado || "Desconocido"}
                                    </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center gap-3 sm:ml-6">
                             <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                item.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                         {item.disponible ? "Disponible" : "No disponible"}
                                </span>
                                {item.disponible && (
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="bg-[#4B1E0D] text-white px-4 py-2 rounded hover:opacity-90 transition text-sm"
                                    >
                                        Reservar
                                    </button>
                                )}
                            </div>

                        </li>
                    ))}
                </ul>
            )}

            {/* Panel de reserva */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <h3 className="text-xl font-semibold mb-4">Reservar: {selectedItem.nombre}</h3>
                        <label className="block mb-3">
                            Fecha:
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>
                        <label className="block mb-3">
                            Hora de inicio:
                            <input
                                type="time"
                                name="horaInicio"
                                value={formData.horaInicio}
                                onChange={handleChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>
                        <label className="block mb-3">
                            Hora final:
                            <input
                                type="time"
                                name="horaFin"
                                value={formData.horaFin}
                                onChange={handleChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReserve}
                                className="bg-[#4B1E0D] text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemList;
