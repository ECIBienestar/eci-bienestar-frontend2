import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Datos mockeados
const roomUsageData = [
  { name: "Sala Recrea", reservas: 45 },
  { name: "Sala Crea", reservas: 78 },
];

const peakHoursData = [
  { hora: "8:00", reservas: 5 },
  { hora: "10:00", reservas: 12 },
  { hora: "12:00", reservas: 8 },
  { hora: "14:00", reservas: 15 },
  { hora: "16:00", reservas: 20 },
];

const occupancyData = [
  { name: "Ocupado", value: 65 },
  { name: "Disponible", value: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        type="button"
        onClick={() => navigate("/modules/recreation")}
        className="mr-4 text-green-700 hover:text-green-900 flex items-center"
        aria-label="Volver a opciones de salas recreativas"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Volver
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Estadísticas de Salas Recreativas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tarjetas de resumen */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total de Reservas
          </h3>
          <p className="text-3xl font-bold text-blue-600">70</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Tasa de Ocupación
          </h3>
          <p className="text-3xl font-bold text-green-600">65%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de uso por sala */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Uso por Sala
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de horas pico */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Horas Pico de Uso
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reservas" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de ocupación */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Tasa de Ocupación
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {occupancyData.map((_entry, index) => (
                    <Cell
                      key={`cell-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Métricas Adicionales
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo promedio de reserva</span>
              <span className="font-semibold">2.5 horas</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reservas canceladas</span>
              <span className="font-semibold">12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfacción del usuario</span>
              <span className="font-semibold">4.5/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
