import { useNavigate } from "react-router-dom";
import salaImage from "../../../assets/images/recreational-rooms.jpg";
import salaImage2 from "../../../assets/images/recreational-rooms2.jpg";

const NuestrasSalas = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            {/* Cabecera */}
            <div className="w-full max-w-3xl mb-8">
                <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">Nuestras salas</h1>
                <p className="text-gray-600 text-center">
                    Elige una sala para ver su disponibilidad y reservar tu espacio.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-3xl">
                {/* Sala CREA 1 */}
                <button
                    onClick={() => navigate("/modules/recreation/student-rooms")}
                    className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition w-72 border-2 border-green-100 hover:border-green-400 focus:outline-none"
                >
                    <img
                        src={salaImage}
                        alt="Sala CREA 1"
                        className="rounded-lg w-full h-44 object-cover mb-4"
                    />
                    <span className="text-lg font-semibold text-green-700 mb-1">Sala CREA 1</span>
                    <span className="text-sm text-gray-500">Haz clic para reservar</span>
                </button>

                {/* Sala CREA 2 */}
                <button
                    onClick={() => navigate("/modules/recreation/student-rooms2")}
                    className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition w-72 border-2 border-green-100 hover:border-green-400 focus:outline-none"
                >
                    <img
                        src={salaImage2}
                        alt="Sala CREA 2"
                        className="rounded-lg w-full h-44 object-cover mb-4"
                    />
                    <span className="text-lg font-semibold text-green-700 mb-1">Sala CREA 2</span>
                    <span className="text-sm text-gray-500">Haz clic para reservar</span>
                </button>
            </div>
        </div>
    );
};

export default NuestrasSalas;