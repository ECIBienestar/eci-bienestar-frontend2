import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock, faUsers,faUser, faEnvelope,  } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface GymSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  currentReservations: number;
}

interface Trainer {
  name: string;
  email: string;
  role: string;
  gender: string;
  registered: boolean;
  registrationDate: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
}

function getLocalDateISO() {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
}

const TrainerMainPage = () => {
  const userEmail = sessionStorage.getItem("email") || "";

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loadingTrainer, setLoadingTrainer] = useState(true);

  const [todaySessions, setTodaySessions] = useState<GymSession[]>([]);
  const [loadingTodaySessions, setLoadingTodaySessions] = useState(true);

  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    async function fetchRoutines() {
      try {
        const res = await axios.get("https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/routines");
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRoutines(data);
      } catch (e) {
        console.error("Error fetching routines:", e);
        setRoutines([]);
      }
    }

    async function fetchTrainerByEmail() {
      try {
        const res = await axios.get(
            `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${encodeURIComponent(
                userEmail
            )}`
        );
        if (res.data.success && res.data.data) {
          setTrainer(res.data.data || null);
        } else {
          setTrainer(null);
        }
      } catch (e) {
        console.error("Error fetching trainer by email:", e);
        setTrainer(null);
      } finally {
        setLoadingTrainer(false);
      }
    }

    async function fetchTodaySessions() {
      try {
        const today = getLocalDateISO();
        const res = await axios.get(
            `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/session/date/${today}`
        );
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setTodaySessions(data);
      } catch (e) {
        console.error("Error fetching today's sessions:", e);
        setTodaySessions([]);
      } finally {
        setLoadingTodaySessions(false);
      }
    }

    fetchRoutines();
    fetchTrainerByEmail();
    fetchTodaySessions();
  }, [userEmail]);

  return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 space-y-6">
          {/* Sesiones de Hoy */}
          <div className="p-6 bg-black text-white rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Sesiones de Hoy</h2>
            {loadingTodaySessions ? (
                <p>Cargando sesiones...</p>
            ) : todaySessions.length === 0 ? (
                <p>No hay sesiones para hoy.</p>
            ) : (
                <div className="space-y-4">
                  {todaySessions.map((session) => (
                      <div
                          key={session.id}
                          className="p-4 rounded-lg bg-gray-800 text-white shadow-md flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
                            {
                              new Date(session.date + "T00:00:00").toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            }
                          </p>
                          <p className="text-sm font-semibold">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            {session.startTime} - {session.endTime}
                          </p>
                          <p className="text-sm font-semibold text-green-400">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            Reservas: {session.currentReservations}/{session.capacity}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Rutinas y Trainer */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rutinas */}
            <div className="p-4 bg-black text-white rounded-lg">
              <h2 className="text-xl font-bold text-yellow-400">Rutinas</h2>
              <div className="space-y-4 mt-4">
                {routines.map((routine) => (
                    <div
                        key={routine.id}
                        className="p-4 rounded-lg bg-gray-800 text-white shadow-md cursor-pointer hover:bg-gray-700"
                    >
                      <p className="text-sm font-semibold">{routine.name}</p>
                      <p className="text-xs text-gray-400">{routine.description}</p>
                    </div>
                ))}
              </div>
            </div>

            {/* Trainer Info */}
            <div className="p-4 bg-black text-white rounded-lg">
              <h2 className="text-xl font-bold text-yellow-400">Entrenador</h2>
              {loadingTrainer ? (
                  <p>Cargando información del entrenador...</p>
              ) : trainer ? (
                  <div className="space-y-2">
                    <p>
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      <strong>Nombre:</strong> {trainer.name}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                      <strong>Email:</strong> {trainer.email}
                    </p>
                    <p>
                      <strong>Rol:</strong> {trainer.role}
                    </p>
                    <p>
                      <strong>Género:</strong> {trainer.gender}
                    </p>
                    <p>
                      <strong>Registrado:</strong> {trainer.registered ? "Sí" : "No"}
                    </p>
                    <p>
                      <strong>Fecha de registro:</strong>{" "}
                      {new Date(trainer.registrationDate).toLocaleDateString("es-ES")}
                    </p>
                  </div>
              ) : (
                  <p>No se encontró información del entrenador.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default TrainerMainPage;