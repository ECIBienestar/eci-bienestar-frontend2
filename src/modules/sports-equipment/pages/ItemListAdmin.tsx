import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemsByCategory } from "../services/itemService";
import { createLoan } from "../services/itemService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faPlus,
    faTrash,
    faPenToSquare,
    faGears,
} from "@fortawesome/free-solid-svg-icons";

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
    const [showDetailPanel, setShowDetailPanel] = useState(false);

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
                if (id && VALID_CATEGORIES.includes(id)) {
                    const data = await getItemsByCategory(id);
                    setItems(data as Item[]);
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
                dateAndTimeLoan,
                loanStatus: "EN_PRESTAMO",
                dateAndTimeScheduleReturn,
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


    const handleDelete = async (itemId: string) => {
        const confirmDelete = confirm("¿Estás seguro de eliminar este ítem?");
        if (!confirmDelete) return;
        /**
        if (confirmDelete) {
            console.log("Eliminar ítem:", itemId);
            // Aquí se conectaría el endpoint de eliminación.
        }
            */
        try {
            const response = await fetch('https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0/equipment', {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    'equipment-id': itemId
                }
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            alert("Ítem eliminado exitosamente.");
            console.log("Ítem eliminado:", itemId);

            // Aquí puedes actualizar tu lista local de ítems, si la estás usando:
            // setItems(prev => prev.filter(item => item.id !== itemId));

        } catch (error) {
            console.error("Error al eliminar ítem:", error);
            alert("Ocurrió un error al eliminar el ítem.");
        }
    };

    const [showAddPanel, setShowAddPanel] = useState(false);
    const [newItemData, setNewItemData] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        estado: "",
        categoria: "",
        disponible: "",
    });

    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItemData({ ...newItemData, [name]: value });
    };

    const validateNewItem = () => {
        const { id, nombre, estado, categoria, disponible } = newItemData;
        return id && nombre && estado && categoria && disponible;
    };

    const handleAddNewItem = async () => {
        if (!validateNewItem()) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        const itemToSend = {
            id: newItemData.id,
            available: newItemData.disponible === "true",  // convertir string a booleano
            name: newItemData.nombre,
            type: newItemData.categoria,
            description: newItemData.descripcion,
            status: newItemData.estado
        };
/**
        console.log("Nuevo item a agregar:", newItemData);

        // Aquí puedes integrar tu servicio real de POST para crear un nuevo item.
        // Ej: await addItem(newItemData);

        setShowAddPanel(false);
        setNewItemData({ id: "", nombre: "", descripcion: "", estado: "", categoria: "", disponible: "" });
            */

        try {
            const response = await fetch('https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0/equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(itemToSend)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            alert("¡Ítem agregado exitosamente!");
            setShowAddPanel(false);
            setNewItemData({ id: "", nombre: "", descripcion: "", estado: "", categoria: "", disponible: "" });
        } catch (error) {
            console.error("Error al agregar ítem:", error);
            alert("Ocurrió un error al agregar el ítem.");
        }
    };

    const [showEditPanel, setShowEditPanel] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<any | null>(null);
    const [showReservePanel, setShowReservePanel] = useState(false);




    return (
        <div className="px-4 py-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="bg-[#5B1F00] text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-transform duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Volver
                </button>

                <button
                    onClick={() => setShowAddPanel(true)}
                    className="bg-[#5B1F00] text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-transform duration-200 text-sm font-semibold flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Agregar ítem
                </button>
            </div>

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
                            className="bg-white border-l-4 border-[#5B1F00] shadow rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center space-x-6 w-full">
                                <img
                                    src={item.imagen || "https://via.placeholder.com/120"}
                                    alt={item.nombre}
                                    className="w-28 h-28 object-contain rounded-md border"
                                />
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setShowDetailPanel(true);
                                        setShowReservePanel(false);
                                    }}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.nombre}</h3>
                                    <p className="text-gray-700 mb-1">
                                        {item.descripcion || "Sin descripción"}
                                    </p>
                                    <p className="text-gray-700 mb-1">
                                        Estado:{" "}
                                        <span className="font-medium capitalize">
                    {item.estado || "Desconocido"}
                  </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3 sm:ml-6">
              <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      item.disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                  }`}
              >
                {item.disponible ? "✅ Disponible" : "⛔ No disponible"}
              </span>

                                {item.disponible && (
                                    <button
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowReservePanel(true);
                                            setShowDetailPanel(false);
                                        }}
                                        className="bg-[#5B1F00] text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faGears} />
                                        Reservar
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setItemToEdit(item);
                                        setShowEditPanel(true);
                                    }}
                                    className="bg-[#5B1F00] text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-[#5B1F00] text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

    {showReservePanel && selectedItem && (
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
            {showAddPanel && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white border-4 border-gray-50 p-6 rounded-xl w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-3 text-black text-xl font-bold"
                            onClick={() => setShowAddPanel(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-[#4B1E0D]">Panel de Agregación</h3>
                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">ID</span>
                            <input
                                type="text"
                                name="id"
                                placeholder="Codigo identificador del artículo"
                                value={newItemData.id}
                                onChange={handleNewItemChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                                required
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Nombre</span>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre del elemento"
                                value={newItemData.nombre}
                                onChange={handleNewItemChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                                required
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Descripción del elemento</span>
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripcion"
                                value={newItemData.descripcion}
                                onChange={handleNewItemChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Estado del elemento</span>
                            <select
                                name="estado"
                                value={newItemData.estado}
                                onChange={handleNewItemChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                                required
                            >
                                <option value="">Estado</option>
                                <option value="bueno">Bueno</option>
                                <option value="regular">Regular</option>
                                <option value="malo">Malo</option>
                            </select>
                        </label>
                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Tipo del elemento</span>
                            <input
                                type="text"
                                name="categoria"
                                placeholder="Tipo"
                                value={newItemData.categoria}
                                onChange={handleNewItemChange}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                                required
                            />
                        </label>
                        <fieldset className="mb-3">
                            <legend className="text-[#4B1E0D] mb-1">Disponibilidad para el préstamo</legend>
                            <label className="inline-flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="disponible"
                                    value="true"
                                    checked={newItemData.disponible === "true"}
                                    onChange={handleNewItemChange}
                                    className="mr-2"
                                />
                                Disponible
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="disponible"
                                    value="false"
                                    checked={newItemData.disponible === "false"}
                                    onChange={handleNewItemChange}
                                    className="mr-2"
                                />
                                No disponible
                            </label>
                        </fieldset>

                        <button
                            onClick={handleAddNewItem}
                            className="bg-[#4B1E0D] text-white w-full py-2 mt-4 rounded hover:opacity-90"
                        >
                            Agregar contenido
                        </button>
                    </div>
                </div>
            )}
            {showEditPanel && itemToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white border-4 border-gray-50 p-6 rounded-xl w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-3 text-black text-xl font-bold"
                            onClick={() => setShowEditPanel(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-[#4B1E0D]">Panel de Modificación</h3>

                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">ID</span>
                            <input
                                type="text"
                                name="id"
                                value={itemToEdit.id}
                                onChange={(e) => setItemToEdit({ ...itemToEdit, id: e.target.value })}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                                disabled
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Nombre</span>
                            <input
                                type="text"
                                name="nombre"
                                value={itemToEdit.nombre}
                                onChange={(e) => setItemToEdit({ ...itemToEdit, nombre: e.target.value })}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Descripción</span>
                            <input
                                type="text"
                                name="descripcion"
                                value={itemToEdit.descripcion}
                                onChange={(e) => setItemToEdit({ ...itemToEdit, descripcion: e.target.value })}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Estado</span>
                            <select
                                name="estado"
                                value={itemToEdit.estado}
                                onChange={(e) => setItemToEdit({ ...itemToEdit, estado: e.target.value })}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            >
                                <option value="bueno">Bueno</option>
                                <option value="regular">Regular</option>
                                <option value="malo">Malo</option>
                            </select>
                        </label>

                        <label className="block mb-3">
                            <span className="text-[#4B1E0D]">Tipo</span>
                            <input
                                type="text"
                                name="categoria"
                                value={itemToEdit.categoria}
                                onChange={(e) => setItemToEdit({ ...itemToEdit, categoria: e.target.value })}
                                className="w-full border px-2 py-2 rounded mt-1 text-gray-700"
                            />
                        </label>

                        <fieldset className="mb-3">
                            <legend className="text-[#4B1E0D] mb-1">Disponibilidad</legend>
                            <label className="inline-flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="disponible"
                                    value="true"
                                    checked={itemToEdit.disponible === true || itemToEdit.disponible === "true"}
                                    onChange={() => setItemToEdit({ ...itemToEdit, disponible: "true" })}
                                    className="mr-2"
                                />
                                Disponible
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="disponible"
                                    value="false"
                                    checked={itemToEdit.disponible === false || itemToEdit.disponible === "false"}
                                    onChange={() => setItemToEdit({ ...itemToEdit, disponible: "false" })}
                                    className="mr-2"
                                />
                                No disponible
                            </label>
                        </fieldset>

                        <button
                            onClick={() => {
                                console.log("Item actualizado:", itemToEdit);
                                // Aquí podrías hacer el llamado a tu endpoint de actualización
                                setShowEditPanel(false);
                            }}
                            className="bg-[#4B1E0D] text-white w-full py-2 mt-4 rounded hover:opacity-90"
                        >
                            Actualizar contenido
                        </button>
                    </div>
                </div>
            )}

            {showDetailPanel && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative border-2 border-gray-200">
                        <button
                            className="absolute top-2 right-3 text-black text-xl font-bold"
                            onClick={() => setShowDetailPanel(false)}
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Panel de Información</h2>

                        <div className="space-y-3 text-[#1E1E1E]">
                            <p>
                                <strong>Id del artículo :</strong> {selectedItem.id}
                            </p>

                            <div className="flex justify-between items-center">
                                <p>
                                    <strong>Nombre del artículo :</strong><br />
                                    {selectedItem.nombre}
                                </p>
                                {selectedItem.imagen && (
                                    <img
                                        src={selectedItem.imagen}
                                        alt={selectedItem.nombre}
                                        className="w-24 h-24 object-contain rounded-md border"
                                    />
                                )}
                            </div>

                            <p>
                                <strong>Estado en el momento del préstamo :</strong><br />
                                {selectedItem.estado}
                            </p>


                            <p>
                                <strong>Descripción :</strong><br />
                                {selectedItem.descripcion}
                            </p>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ItemList;
