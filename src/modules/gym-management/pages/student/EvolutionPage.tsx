import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Bar } from "react-chartjs-2";


ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressRecords = async () => {
      try {
        const email = sessionStorage.getItem("email");
        if (!email) throw new Error("Email no encontrado en sesión.");

        // Obtener datos del usuario
        const userResponse = await axios.get(`https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${encodeURIComponent(email)}`);
        const user = userResponse.data.data;

        if (!user || !user.id) throw new Error("Usuario no encontrado.");

        const response = await axios.get(`https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/progress/${user.id}`);

        setRecords(response.data.data);
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressRecords();
  }, []);
  
  const generateColor = (index: number): string => {
    const baseColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(201, 203, 207, 0.7)',
      'rgba(0, 200, 150, 0.7)',
    ];
    return baseColors[index % baseColors.length];
  };

  const labels = [
    'Peso', 'Altura', 'Cintura', 'Pecho',
    'Brazo Derecho', 'Brazo Izquierdo',
    'Pierna Derecha', 'Pierna Izquierda'
  ];

  const datasets = records.map((rec, index) => ({
    label: new Date(rec.registrationDate).toLocaleDateString('es-CO'),
    data: [
      rec.weight,
      rec.height,
      rec.waists,
      rec.chest,
      rec.rightarm,
      rec.leftarm,
      rec.rightleg,
      rec.leftleg,
    ],
    backgroundColor: generateColor(index),
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Histograma de Evolución Física',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const handleDownloadExcel = () => {
    const worksheetData = records.map((rec) => ({
      Fecha: new Date(rec.registrationDate).toLocaleDateString('es-CO'),
      'Peso (kg)': rec.weight,
      'Altura (cm)': rec.height,
      'Cintura (cm)': rec.waists,
      'Pecho (cm)': rec.chest,
      'Brazo Derecho (cm)': rec.rightarm,
      'Brazo Izquierdo (cm)': rec.leftarm,
      'Pierna Derecha (cm)': rec.rightleg,
      'Pierna Izquierda (cm)': rec.leftleg,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evolución Física');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'evolucion_fisica.xlsx');
  };

  let content;

  if (loading) {
    content = <p>Cargando registros...</p>;
  } else if (records.length === 0) {
    content = <p>No hay registros para mostrar.</p>;
  } else {
    content = (
      <>
        <Bar options={options} data={data} className="mt-6" />

        <h2 className="text-2xl font-bold mt-10 mb-4">Tabla comparativa</h2>

        <div className="overflow-x-auto">
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
                  <td className="border border-gray-300 p-2">
                    {new Date(rec.registrationDate).toLocaleDateString('es-CO')}
                  </td>
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

        {/* Botón de descarga al final */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleDownloadExcel}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Descargar Excel
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Histograma de Medidas
      </h1>
      {content}
    </div>
  );
};

export default EvolutionPage;