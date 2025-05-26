import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DatsStadistic {
  turnAttended: number;
  turnUnAttended: number;
  attendedBySpeciality: number[];
  attendedByRol: number[];
  specialityLabels: string[];
  rolLabels: string[];
}

const DatosStadistics = (datos: DatsStadistic) => {
  return (
    <div className="drop-shadow-xl bg-white w-full border-2 rounded-[12px] p-3 h-80 sm:h-[55vh] flex flex-col">
      <h1>Resumen de atención</h1>

      <section className="flex flex-col sm:flex-row gap-4 pb-3 rounded-[12px]">
        <div className="bg-gray-200 rounded-[10px] flex flex-col sm:w-1/2 p-6">
          <h6 className="text-gray-500">Total atendidos</h6>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} size="xs" color="red" />
            <span>{datos.turnAttended}</span>
          </h2>
        </div>
        <div className="bg-gray-200 rounded-[10px] flex flex-col sm:w-1/2 p-6">
          <h6 className="text-gray-500">Turnos sin asistir</h6>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} size="xs" color="#0078b4" />
            <span>{datos.turnUnAttended}</span>
          </h2>
        </div>
      </section>

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        <div className="bg-gray-200 p-3 rounded-[10px] min-h-50 flex-1 overflow-auto">
          <h5 className="text-gray-500 pb-5">Atendidos por especialidad</h5>
          {datos.specialityLabels.map((esp, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-1"
            >
              <h5>{esp}</h5>
              <h5>{datos.attendedBySpeciality[index]}</h5>
            </div>
          ))}
        </div>

        <div className="bg-gray-200 p-3 rounded-[10px] min-h-45 overflow-auto">
          <h5 className="text-gray-500 pb-5">Atendidos por rol de paciente</h5>
          {datos.rolLabels.map((esp, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-1"
            >
              <h5>{esp}</h5>
              <h5>{datos.attendedByRol[index]}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatosStadistics;
