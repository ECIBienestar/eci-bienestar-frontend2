import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import image1 from "/src/modules/gym-management/assets/images/gim1.jpg";
import image2 from "/src/modules/gym-management/assets/images/gim2.jpg";
import image3 from "/src/modules/gym-management/assets/images/gim3.jpg";
import image4 from "/src/modules/gym-management/assets/images/coliseo.jpg";

const images = [image1, image2, image3, image4];

const StudentMainPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto text-gray-800 text-base sm:text-lg">
      {/* Carrusel */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden rounded-lg shadow-md">
        {images.length > 0 && (
          <img
            src={images[currentIndex]}
            alt={`Gimnasio ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-1000"
          />
        )}

        {/* Flechas */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-sm sm:text-base"
        >
          ◀
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-sm sm:text-base"
        >
          ▶
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                index === currentIndex ? "bg-yellow-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido reglamento */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6">Aspectos generales</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Plan de entrenamiento:</strong> asignado según evaluación inicial.
          </li>
          <li>
            <strong>Seguimiento:</strong> monitoreo por parte de profesionales.
          </li>
          <li>
            <strong>Horario del gimnasio:</strong> estudiantes: lunes a viernes de 8:00 a.m. a 5:00 p.m.
          </li>
          <li>
            <strong>Práctica de actividad física:</strong> hasta tres veces por semana, máximo una hora diaria.
          </li>
          <li>
            <strong>Edad mínima:</strong> 16 años cumplidos al momento de la inscripción.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6">Implementos</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Ropa deportiva cómoda (sudadera, pantaloneta, tenis).</li>
          <li>Toalla personal para limpieza después de uso.</li>
          <li>Usar atomizadores y toallas para limpiar máquinas.</li>
          <li>Usar papeleras para mantener el área limpia.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6">Manejo de equipos</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Regresar mancuernas, discos y barras a su lugar.</li>
          <li>No descansar sobre las máquinas.</li>
          <li>Cuidar equipos e instalaciones, compartir el uso.</li>
          <li>Consultar dudas al profesor.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6">Horario</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Turnos de 60 minutos, hasta 3 veces por semana.</li>
          <li>Horario para estudiantes: 8:00 a.m. a 5:00 p.m.</li>
        </ul>
      </section>

      <div className="pt-6 text-center">
        <button
          onClick={() => navigate("../student/first-register")}
          className="bg-black text-white font-semibold px-6 py-3 rounded hover:bg-black-500 transition w-full sm:w-auto"
        >
          Inscribirte ahora
        </button>
      </div>
    </div>
  );
};

export default StudentMainPage;