import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Title, Tooltip);

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProgressRecord {
  id: string;
  registrationDate: string;
  weight: number;
  height: number;
  waists: number;
  chest: number;
  rightarm: number;
  leftarm: number;
  rightleg: number;
  leftleg: number;
}

const AdministratorProgressPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/trainer/users"
      );
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const fetchProgress = async (userId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/progress/${userId}`
      );
      setRecords(res.data.data);
    } catch (err) {
      console.error("Error al cargar progreso", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchProgress(selectedUserId);
    }
  }, [selectedUserId]);

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
    "Peso",
    "Altura",
    "Cintura",
    "Pecho",
    "Brazo Der.",
    "Brazo Izq.",
    "Pierna Der.",
    "Pierna Izq.",
  ];

  const datasets = records.map((rec, index) => ({
    label: rec.registrationDate,
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

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Histograma de Evolución Física",
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Seguimiento por Usuario</h1>

      <select
        className="p-2 border mb-6"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Seleccione un usuario</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {(() => {
        if (loading) {
          return <p>Cargando registros...</p>;
        }
        if (records.length === 0 && selectedUserId) {
          return <p>No hay registros para este usuario.</p>;
        }
        if (records.length > 0) {
          return (
            <>
              <Bar options={options} data={data} />
              <h2 className="text-2xl font-bold mb-6 mt-10">Tabla comparativa</h2>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Fecha</th>
                      {labels.map((label) => (
                        <th key={label} className="border p-2 text-right">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => (
                      <tr key={rec.id} className="odd:bg-white even:bg-gray-50">
                        <td className="border p-2">{rec.registrationDate}</td>
                        <td className="border p-2 text-right">{rec.weight}</td>
                        <td className="border p-2 text-right">{rec.height}</td>
                        <td className="border p-2 text-right">{rec.waists}</td>
                        <td className="border p-2 text-right">{rec.chest}</td>
                        <td className="border p-2 text-right">{rec.rightarm}</td>
                        <td className="border p-2 text-right">{rec.leftarm}</td>
                        <td className="border p-2 text-right">{rec.rightleg}</td>
                        <td className="border p-2 text-right">{rec.leftleg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botón de descarga al final */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleDownloadExcel}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                >
                  Descargar Excel
                </button>
              </div>
            </>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default AdministratorProgressPage;