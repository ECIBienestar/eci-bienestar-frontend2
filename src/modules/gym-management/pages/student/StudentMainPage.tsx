import { useEffect, useState } from "react";
import { FaUser, FaDumbbell } from "react-icons/fa";
import axios from "axios";

const StudentMainPage = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [latestProgress, setLatestProgress] = useState<any>(null);
    const [userRoutine, setUserRoutine] = useState<any>(null);
    const [showRoutineDetail, setShowRoutineDetail] = useState(false);

    const userId = "6832c304489cf8565c0ac37d";

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch(
                    `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/reservations/user/${userId}`
                );
                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    console.log("🔎 Todas las reservas del usuario:", data.data);

                    const today = new Date().toISOString().split("T")[0];
                    const filtered = data.data.filter((res: any) => {
                        const sessionDate = res.gymSessionId?.date?.trim();
                        const reservationDate = res.reservationDate?.split("T")[0];
                        return sessionDate === today && reservationDate === today;
                    });

                    console.log("✅ Reservas filtradas para hoy:", filtered);

                    setReservations(filtered);
                }
            } catch (error) {
                console.error("❌ Error al obtener reservas:", error);
            }
        };

        const fetchLatestProgress = async () => {
            try {
                const email = sessionStorage.getItem("email");
                if (!email) return;

                const user = await axios.get(
                    `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${encodeURIComponent(email)}`
                );
                const userId = user.data?.data?.id;

                const response = await axios.get(
                    `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/progress/${userId}`
                );
                const lastProgress = response.data?.data?.slice(-1)[0];

                if (lastProgress) {
                    const mappedLastProgress = {
                        goal: lastProgress.goal || "",
                        registrationDate: lastProgress.registrationDate || "",
                        weight: lastProgress.weight || 0.0,
                        height: lastProgress.height || 0.0,
                        waists: lastProgress.waists || 0.0,
                        chest: lastProgress.chest || 0.0,
                        rightarm: lastProgress.rightarm || 0.0,
                        leftarm: lastProgress.leftarm || 0.0,
                        rightleg: lastProgress.rightleg || 0.0,
                        leftleg: lastProgress.leftleg || 0.0,
                        routineId: lastProgress.routine?.id || "",
                    };

                    setLatestProgress(mappedLastProgress);

                    if (mappedLastProgress.routineId) {
                        fetchUserRoutine(mappedLastProgress.routineId);
                    }
                }
            } catch (error) {
                console.error("Error al cargar el último registro de progreso:", error);
            }
        };

        const fetchUserRoutine = async (routineId: string) => {
            try {
                const response = await fetch(
                    `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/routines/${routineId}`
                );
                const result = await response.json();
                if (result.success) {
                    setUserRoutine(result.data);
                }
            } catch (error) {
                console.error("Error al obtener rutina del usuario:", error);
            }
        };

        fetchReservations();
        fetchLatestProgress();
    }, []);

    const formatCm = (value: number) => `${value} cm`;
    const formatKg = (value: number) => `${value} kg`;

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 space-y-6">
                {/* Reservas */}
                <div className="p-4 bg-black text-white rounded-lg">
                    <h1 className="text-xl font-bold">Reservas de la semana</h1>
                </div>
                <div className="space-y-4">
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="p-4 rounded-lg bg-black text-white shadow-md flex justify-between items-center"
                        >
                            <div>
                                <p className="text-sm font-semibold">
                                    ⏰ {reservation.gymSessionId.startTime} - {reservation.gymSessionId.endTime}
                                </p>
                                <p className="text-sm">
                                    👤 Entrenador: {reservation.gymSessionId.coachId.name}
                                </p>
                                <p className={`text-sm font-semibold ${
                                    reservation.state === "APROBADO" ? "text-green-400" :
                                        reservation.state === "PENDIENTE" ? "text-yellow-400" : "text-red-400"
                                }`}>
                                    📌 Estado: {reservation.state}
                                </p>
                            </div>
                            <button
                                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center"
                                onClick={() => alert("Perfil del entrenador no implementado")}
                            >
                                <FaUser className="text-white text-lg" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Rutina y medidas */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Rutina */}
                    <div className="p-4 bg-black text-white rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Mi Rutina Asignada</h2>
                        {userRoutine ? (
                            !showRoutineDetail ? (
                                <button
                                    onClick={() => setShowRoutineDetail(true)}
                                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition"
                                >
                                    <FaDumbbell />
                                    <span>{userRoutine.name}</span>
                                </button>
                            ) : (
                                <div className="bg-white text-black rounded-lg p-4 space-y-2">
                                    <h3 className="text-lg font-bold">Detalles del ejercicio</h3>
                                    {userRoutine.exercises?.length > 0 ? (
                                        userRoutine.exercises.map((exercise: any, idx: number) => (
                                            <div key={idx}>
                                                <p><strong>Nombre:</strong> {exercise.name}</p>
                                                <p><strong>Series:</strong> {exercise.series}</p>
                                                <p><strong>Repeticiones:</strong> {exercise.repetitions}</p>
                                                <p><strong>Duración:</strong> {exercise.duration} minutos</p>
                                                <p><strong>Tipo:</strong> {exercise.type}</p>
                                                <p><strong>Grupos musculares:</strong> {exercise.muscleGroup}</p>
                                                <hr className="my-2" />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay ejercicios disponibles.</p>
                                    )}
                                    <button
                                        onClick={() => setShowRoutineDetail(false)}
                                        className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                                    >
                                        Volver
                                    </button>
                                </div>
                            )
                        ) : (
                            <p className="text-sm">Cargando rutina asignada...</p>
                        )}
                    </div>

                    {/* Medidas */}
                    <div className="p-4 bg-black text-white rounded-lg">
                        <h2 className="text-xl font-bold">Mis Últimas Medidas</h2>
                        {latestProgress ? (
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-semibold">📅 Fecha: {latestProgress.registrationDate}</p>
                                <p className="text-sm font-semibold">⚖️ Peso: {formatKg(latestProgress.weight)}</p>
                                <p className="text-sm font-semibold">📏 Altura: {formatCm(latestProgress.height)}</p>
                                <p className="text-sm font-semibold">🪢 Cintura: {formatCm(latestProgress.waists)}</p>
                                <p className="text-sm font-semibold">💪 Pecho: {formatCm(latestProgress.chest)}</p>
                                <p className="text-sm font-semibold">💪 Brazo Derecho: {formatCm(latestProgress.rightarm)}</p>
                                <p className="text-sm font-semibold">💪 Brazo Izquierdo: {formatCm(latestProgress.leftarm)}</p>
                                <p className="text-sm font-semibold">🦵 Pierna Derecha: {formatCm(latestProgress.rightleg)}</p>
                                <p className="text-sm font-semibold">🦵 Pierna Izquierda: {formatCm(latestProgress.leftleg)}</p>
                            </div>
                        ) : (
                            <p className="text-sm">Cargando medidas...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentMainPage;
