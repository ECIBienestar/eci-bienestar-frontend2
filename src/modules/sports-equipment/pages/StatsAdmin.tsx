import coliseoImg from "@modules/sports-equipment/Images-sport-equipment/coliseo.jpg";

const Home = () => {
    const estadisticas = {
        categoriaMasPedida: "Fútbol",
        diaMasReservas: "Miércoles",
        objetoMasReservado: "Balón de fútbol",
        reservasPorDia: {
            Lunes: 12,
            Martes: 18,
            Miércoles: 40,
            Jueves: 20,
            Viernes: 10,
            Sábado: 2,
        },
    };

    const colores = [
        "fill-green-600 bg-green-600",
        "fill-yellow-500 bg-yellow-500",
        "fill-blue-500 bg-blue-500",
        "fill-purple-500 bg-purple-500",
        "fill-pink-500 bg-pink-500",
        "fill-red-500 bg-red-500",
    ];

    const totalReservas = Object.values(estadisticas.reservasPorDia).reduce((a, b) => a + b, 0);

    // Calcular los ángulos para el SVG pie chart
    const slices = [];
    let startAngle = 0;

    Object.entries(estadisticas.reservasPorDia).forEach(([dia, valor], index) => {
        const porcentaje = valor / totalReservas;
        const endAngle = startAngle + porcentaje * 360;

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
        const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
        const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
        const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `
            M 100 100
            L ${x1} ${y1}
            A 100 100 0 ${largeArc} 1 ${x2} ${y2}
            Z
        `;

        slices.push({
            path: pathData,
            colorClass: colores[index % colores.length].split(" ")[0],
            dotClass: colores[index % colores.length].split(" ")[1],
            dia,
            valor,
        });

        startAngle = endAngle;
    });

    return (
        <>
            <section className="p-8 bg-white rounded shadow mx-4 my-6">
                <img
                    src={coliseoImg}
                    alt="Coliseo"
                    className="w-full h-64 object-cover rounded mb-8"
                />

                <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
                    Estadísticas de Uso
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-100 p-6 rounded shadow text-center">
                        <p className="text-sm text-gray-600 mb-1">Categoría más pedida</p>
                        <h3 className="text-2xl font-semibold text-green-700">{estadisticas.categoriaMasPedida}</h3>
                    </div>

                    <div className="bg-yellow-100 p-6 rounded shadow text-center">
                        <p className="text-sm text-gray-600 mb-1">Día con más reservas</p>
                        <h3 className="text-2xl font-semibold text-yellow-700">{estadisticas.diaMasReservas}</h3>
                    </div>

                    <div className="bg-blue-100 p-6 rounded shadow text-center">
                        <p className="text-sm text-gray-600 mb-1">Objeto más reservado</p>
                        <h3 className="text-2xl font-semibold text-blue-700">{estadisticas.objetoMasReservado}</h3>
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                        Reservas por día de la semana
                    </h4>

                    <div className="flex flex-col items-center justify-center">
                        <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
                            {slices.map((slice, index) => (
                                <path
                                    key={index}
                                    d={slice.path}
                                    className={slice.colorClass}
                                />
                            ))}
                        </svg>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                            {slices.map((slice, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${slice.dotClass}`}></span>
                                    <span>{slice.dia} ({slice.valor})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#5B1F00] text-white text-xs text-center py-3 mt-6">
                Todos los derechos reservados ©2022 - Escuela Colombiana de Ingeniería Julio Garavito.
            </footer>
        </>
    );
};

export default Home;
