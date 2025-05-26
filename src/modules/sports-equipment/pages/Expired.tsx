import { useEffect, useState } from "react";

interface ArticuloVencido {
    id: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
    fechaFin: string;
}

const Expired = () => {
    const [articulos, setArticulos] = useState<ArticuloVencido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchVencidos = async () => {
            setLoading(true);
            try {

                const data: ArticuloVencido[] = [
                    {
                        id: 1,
                        nombre: "Balón Adidas",
                        descripcion: "Uso exclusivo para torneos",
                        imagen: "",
                        fechaFin: "2025-05-10",
                    },
                    {
                        id: 2,
                        nombre: "Raqueta Wilson",
                        descripcion: "Prestada por más de 3 días",
                        imagen: "",
                        fechaFin: "2025-05-08",
                    },
                ];

                setArticulos(data);
            } catch (err) {
                console.error("Error al cargar artículos vencidos");
            } finally {
                setLoading(false);
            }
        };

        fetchVencidos();
    }, []);

    return (
        <div className="px-4 py-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Artículos vencidos</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : articulos.length === 0 ? (
                <p>No hay artículos vencidos.</p>
            ) : (
                <ul className="space-y-4">
                    {articulos.map((item) => (
                        <li
                            key={item.id}
                            className="bg-white border-l-4 border-red-600 shadow-md rounded-lg p-4 flex items-center"
                        >
                            <img
                                src={item.imagen || "https://via.placeholder.com/80"}
                                alt={item.nombre}
                                className="w-20 h-20 object-contain rounded mr-4"
                            />
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-800">{item.nombre}</span>
                                <span className="text-sm text-gray-600 mb-1">
                                    {item.descripcion || "Sin descripción"}
                                </span>
                                <span className="text-sm text-red-600 font-medium">
                                    Vencido desde: {item.fechaFin}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Expired;
