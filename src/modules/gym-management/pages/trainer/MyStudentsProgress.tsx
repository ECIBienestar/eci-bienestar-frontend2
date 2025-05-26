import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProgressRecord {
    registrationDate: string; // YYYY-MM-DD
    weight: number;
    height: number;
    waists: number;
    chest: number;
    rightarm: number;
    leftarm: number;
    rightleg: number;
    leftleg: number;
}

const EvolutionPage = () => {
    const [records, setRecords] = useState<ProgressRecord[]>([]);

    useEffect(() => {
        // Simulación de datos (reemplazar por fetch real)
        const simulatedData: ProgressRecord[] = [
            {
                registrationDate: "2025-04-01",
                weight: 80,
                height: 170,
                waists: 90,
                chest: 100,
                rightarm: 33,
                leftarm: 32,
                rightleg: 55,
                leftleg: 54,
            },
            {
                registrationDate: "2025-04-15",
                weight: 78,
                height: 170,
                waists: 88,
                chest: 98,
                rightarm: 33.5,
                leftarm: 32.5,
                rightleg: 55.5,
                leftleg: 54.5,
            },
            {
                registrationDate: "2025-05-10",
                weight: 75,
                height: 170,
                waists: 85,
                chest: 95,
                rightarm: 34,
                leftarm: 33,
                rightleg: 56,
                leftleg: 55,
            },
        ];
        setRecords(simulatedData);
    }, []);

    // Etiquetas para eje X
    const labels = records.map((r) => r.registrationDate);

    // Datos para gráfico de barras
    const data = {
        labels,
        datasets: [
            {
                label: "Peso (kg)",
                data: records.map((r) => r.weight),
                backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
            {
                label: "Cintura (cm)",
                data: records.map((r) => r.waists),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
                label: "Pecho (cm)",
                data: records.map((r) => r.chest),
                backgroundColor: "rgba(255, 206, 86, 0.7)",
            },
            // Puedes agregar más barras para brazos y piernas aquí
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Evolución de tus medidas" },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Evolución de Medidas</h1>
            {records.length === 0 ? (
                <p>No hay registros para mostrar.</p>
            ) : (
                <>
                    <Bar options={options} data={data} />
                    <h1 className="text-2xl font-bold mb-6 mt-10">Tabla comparativa</h1>
                    <div className="mt-10 overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Fecha</th>
                                <th className="border border-gray-300 p-2 text-right">Peso (kg)</th>
                                <th className="border border-gray-300 p-2 text-right">Altura (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Cintura (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Pecho (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Brazo Derecho (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Brazo Izquierdo (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Pierna Derecha (cm)</th>
                                <th className="border border-gray-300 p-2 text-right">Pierna Izquierda (cm)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {records.map((rec) => (
                                <tr key={rec.registrationDate} className="odd:bg-white even:bg-gray-50">
                                    <td className="border border-gray-300 p-2">{rec.registrationDate}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.weight.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.height.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.waists.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.chest.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.rightarm.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.leftarm.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.rightleg.toFixed(1)}</td>
                                    <td className="border border-gray-300 p-2 text-right">{rec.leftleg.toFixed(1)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default EvolutionPage;