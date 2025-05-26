import { Card, CardHeader, CardBody } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes, faChartColumn } from "@fortawesome/free-solid-svg-icons";
import coliseoImg from "@modules/sports-equipment/Images-sport-equipment/coliseo.jpg";
import detalleImg from "@modules/sports-equipment/Images-sport-equipment/equipment.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <section className="p-8 bg-white rounded shadow mx-auto my-4 max-w-7xl text-center">
                <img
                    src={coliseoImg}
                    alt="Coliseo"
                    className="w-full h-[400px] object-cover rounded-lg mb-6"
                />

                <h2 className="text-3xl font-semibold mb-4 text-[#3D2B1F]">
                    Bienvenido ADMIN al sistema de equipos deportivos
                </h2>

                <p className="text-gray-800 mb-4 text-lg leading-relaxed">
                    Esta sección permite a los funcionarios gestionar el inventario de equipos deportivos,
                    administrar las reservas y consultar estadísticas clave para la toma de decisiones.
                </p>
                <p className="text-gray-600 italic mb-3">
                    Recuerda mantener actualizado el inventario para asegurar la disponibilidad y el buen estado de los equipos.
                </p>
                <p className="text-gray-700 mb-8">
                    Más información en el{" "}
                    <a
                        href="https://www.escuelaing.edu.co/es/campus/coliseo-el-otono/"
                        className="text-blue-600 underline hover:text-blue-800 transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        sitio oficial del Coliseo El Otoño
                    </a>
                </p>

                {/* Tarjetas de opciones para el admin */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-10">
                    <Card className="w-72 py-6 shadow-lg hover:shadow-2xl transition duration-300">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center text-center">
                            <FontAwesomeIcon icon={faBoxes} className="text-5xl text-[#5B1F00] mb-3" />
                            <h4 className="font-bold text-lg text-gray-800">Administrar Inventario</h4>
                        </CardHeader>
                        <CardBody className="py-4 flex justify-center">
                            <button
                                onClick={() => navigate("/modules/sports/availableAdmin")}
                                className="bg-[#5B1F00] text-white px-6 py-3 text-base rounded-lg border border-[#47210e] shadow-md hover:bg-[#441b00] hover:scale-105 transition transform duration-200"
                            >
                                Ir
                            </button>
                        </CardBody>
                    </Card>

                    <Card className="w-72 py-6 shadow-lg hover:shadow-2xl transition duration-300">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center text-center">
                            <FontAwesomeIcon icon={faChartColumn} className="text-5xl text-[#5B1F00] mb-3" />
                            <h4 className="font-bold text-lg text-gray-800">Ver Estadísticas</h4>
                        </CardHeader>
                        <CardBody className="py-4 flex justify-center">
                            <button
                                onClick={() => navigate("/modules/sports/statsAdmin")}
                                className="bg-[#5B1F00] text-white px-6 py-3 text-base rounded-lg border border-[#47210e] shadow-md hover:bg-[#441b00] hover:scale-105 transition transform duration-200"
                            >
                                Ver
                            </button>
                        </CardBody>
                    </Card>
                </div>
            </section>

            <footer className="bg-[#5B1F00] text-white text-xs text-center py-3 mt-6 rounded-t-md shadow-inner">
                Todos los derechos reservados ©2022 - Escuela Colombiana de Ingeniería Julio Garavito. Personería Jurídica 086 de enero 19 de 1973. Renovación de la Acreditación Institucional en Alta Calidad. Resolución N.° 000195 del 16 de enero de 2025 (vigencia de 8 años). Vigilada por Mineducación.
            </footer>
        </>
    );
};

export default Home;
