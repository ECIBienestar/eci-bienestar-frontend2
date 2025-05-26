import { useNavigate } from "react-router-dom";
import salaImage from "../../../assets/images/recreational-rooms2.jpg";
import astuciaNaval from "../../../assets/images/modules/recreation/astucia-naval.png";
import parques from "../../../assets/images/modules/recreation/parques.png";
import tioRico from "../../../assets/images/modules/recreation/tio-rico.png";
import adivinaQuien from "../../../assets/images/modules/recreation/adivina-quien.png";
import pintura from "../../../assets/images/modules/recreation/pintura.png";
import { useState } from "react";

const juegos = [
  { nombre: "Astucia Naval", img: astuciaNaval },
  { nombre: "Parques", img: parques },
  { nombre: "Tío Rico", img: tioRico },
  { nombre: "Adivina Quién", img: adivinaQuien },
  { nombre: "Actividad Pintura", img: pintura },
];

interface Reserva {
  sala: string;
  diaHora: string;
  juego: string | null;
  estado: "Confirmada" | "Por confirmar";
}

const NuevaReserva2 = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [reservasRealizadas, setReservasRealizadas] = useState<Set<string>>(new Set());
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [slotConfirmado, setSlotConfirmado] = useState<string | null>(null);
  const [juegosConfirmados, setJuegosConfirmados] = useState<string[]>([]);

  const disponibilidadInicial: Record<string, string> = {
    "Martes-11:00 AM": "1 cupos",
    "Miércoles-2:00 PM": "6 cupos",
    "Viernes-3:00 PM": "Cupos llenos",
  };

  const [cuposDisponibles, setCuposDisponibles] = useState(disponibilidadInicial);

  const horarios = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const toggleSelection = (slot: string) => {
    if (reservasRealizadas.has(slot)) return;
    setSelectedSlot(slot);
    setShowConfirmModal(true);
  };

  const confirmarReserva = () => {
    if (!selectedSlot) return;

    const estado = cuposDisponibles[selectedSlot] || "10 cupos";
    let nuevosCupos = 10;

    if (estado.includes("cupos")) {
      nuevosCupos = parseInt(estado);
    } else if (estado === "Cupos llenos") {
      return;
    }

    nuevosCupos -= 1;

    const nuevoEstado = nuevosCupos === 0 ? "Cupos llenos" : `${nuevosCupos} cupos`;

    setCuposDisponibles(prev => ({
      ...prev,
      [selectedSlot]: nuevoEstado
    }));

    setReservasRealizadas(prev => new Set(prev).add(selectedSlot));

    // Guardar en localStorage
    const nuevaReserva: Reserva = {
      sala: "Sala CREA 2",
      diaHora: selectedSlot,
      juego: selectedGames.length > 0 ? selectedGames.join(", ") : null,
      estado: "Confirmada",
    };
    const reservasGuardadas: Reserva[] = JSON.parse(localStorage.getItem("reservasCrea") || "[]");
    reservasGuardadas.push(nuevaReserva);
    localStorage.setItem("reservasCrea", JSON.stringify(reservasGuardadas));

    // Mostrar overlay de éxito
    setSlotConfirmado(selectedSlot);
    setJuegosConfirmados(selectedGames);
    setShowSuccessOverlay(true);

    // Reset
    setShowConfirmModal(false);
    setSelectedGames([]);
    setSelectedSlot(null);

    // Ocultar después de 4 segundos (opcional)
    setTimeout(() => setShowSuccessOverlay(false), 4000);
  };

  return (
      <div className="p-6 relative">
        {/* Overlay de éxito */}
        {showSuccessOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center border-t-4 border-green-600">
                <div className="text-green-600 text-3xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">¡Reserva Confirmada!</h3>
                <p className="text-gray-600 mb-2">Reservaste Sala CREA Pintura</p>
                <p className="text-gray-500 text-sm">{slotConfirmado}</p>
                {juegosConfirmados.length > 0 && (
                    <div className="mt-3">
                      <p className="text-green-600 font-medium">Juegos/Actividades seleccionados:</p>
                      <ul className="text-gray-700">
                        {juegosConfirmados.map(j => (
                            <li key={j}>{j}</li>
                        ))}
                      </ul>
                    </div>
                )}
                <button
                    onClick={() => setShowSuccessOverlay(false)}
                    className="mt-4 text-green-600 font-medium hover:underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
        )}

        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Sala CREA Juegos</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate("/modules/recreation/crea-rooms")}
                    className="text-green-600 border-b-2 border-green-600">
              Reservar
            </button>
            <button onClick={() => navigate("/modules/recreation/my-reservations")} className="text-gray-600">
              Mis reservas
            </button>
          </div>
        </div>

        {/* Imagen y descripción */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <img src={salaImage} alt="Sala CREA" className="rounded-xl w-full md:w-1/2 object-cover"/>
          <ul className="text-gray-700 list-disc pl-5 text-lg">
            <li>Puffs grandes, perfectos para descansar</li>
            <li>Zona de pintura, crea y diviértete</li>
            <li>Juegos de mesa de todos los tipos</li>
          </ul>
        </div>

        {/* Juegos disponibles */}
        <div className="mb-10 px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Juegos que encontrarás</h2>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {juegos.map((juego, index) => (
                <div
                    key={index}
                    className="min-w-[160px] text-center border rounded-lg p-6 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg bg-white"
                >
                  <img src={juego.img} alt={juego.nombre} className="h-32 mx-auto object-contain"/>
                  <p className="mt-3 text-base font-medium text-gray-700">{juego.nombre}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Modal Confirmación */}
        {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    onClick={() => {
                      setShowConfirmModal(false);
                      setSelectedSlot(null);
                      setSelectedGames([]);
                    }}
                    aria-label="Cerrar"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Confirmar reserva</h2>
                <p className="text-center mb-4 text-gray-700">
                  {selectedSlot && `¿Deseas reservar para el horario ${selectedSlot}?`}
                </p>

                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Selecciona uno o más juegos/actividades (opcional)</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {juegos.map((juego, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                              setSelectedGames(prev =>
                                  prev.includes(juego.nombre)
                                      ? prev.filter(j => j !== juego.nombre)
                                      : [...prev, juego.nombre]
                              );
                            }}
                            className={`p-2 border rounded-lg hover:bg-green-100 ${
                                selectedGames.includes(juego.nombre) ? "bg-green-200 font-semibold" : ""
                            }`}
                        >
                          <img src={juego.img} alt={juego.nombre} className="h-16 mx-auto mb-1" />
                          <p>{juego.nombre}</p>
                        </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                      onClick={() => {
                        setShowConfirmModal(false);
                        setSelectedSlot(null);
                        setSelectedGames([]);
                      }}
                      className="text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                      onClick={confirmarReserva}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Tabla de horarios */}
        <table className="table-fixed border-collapse w-full text-sm rounded-lg overflow-hidden mt-6">
          <thead>
          <tr>
            <th className="border px-2 py-2 bg-green-700 text-white w-[100px]">Hora</th>
            {dias.map(dia => (
                <th key={dia} className="border px-2 py-2 bg-green-700 text-white w-[100px]">{dia}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {horarios.map(hora => (
              <tr key={hora}>
                <td className="border px-2 py-2 font-medium">{hora}</td>
                {dias.map(dia => {
                  const slotKey = `${dia}-${hora}`;
                  const estado = cuposDisponibles[slotKey];
                  const isLleno = estado === "Cupos llenos";
                  const isReservado = reservasRealizadas.has(slotKey);

                  return (
                      <td
                          key={slotKey}
                          className={`border px-2 py-2 text-center cursor-pointer truncate transition-all duration-150
                    ${
                              isLleno
                                  ? "bg-red-100 text-red-600 cursor-not-allowed"
                                  : isReservado
                                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                      : "bg-green-100 hover:bg-green-200"
                          }`}
                          onClick={() => {
                            if (!isLleno && !isReservado) {
                              toggleSelection(slotKey);
                            }
                          }}
                      >
                        {estado || "10 cupos"}
                      </td>
                  );
                })}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default NuevaReserva2;