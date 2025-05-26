import DatosStadistics from "./DatosStadistics";
import FilterSelect from "./FilterSelect";
import GraphicShift from "./GraphicShift";

type Props = {
  especialidades: string[];
  rolesPaciente: string[];
  rangosFecha: string[];
  estadosTurno: string[];
  selectedEspecialidad: string;
  setSelectedEspecialidad: (value: string) => void;
  selectedRol: string;
  setSelectedRol: (value: string) => void;
  selectedFecha: string;
  setSelectedFecha: (value: string) => void;
  selectedEstado: string;
  setSelectedEstado: (value: string) => void;
  turnAttended: number;
  turnUnAttended: number;
  attendedBySpeciality: number[];
  attendedByRol: number[];
  datosGrafico: { name: string; value: number }[];
};

const StadisticsShifts = ({
  especialidades,
  rolesPaciente,
  rangosFecha,
  estadosTurno,
  selectedEspecialidad,
  setSelectedEspecialidad,
  selectedRol,
  setSelectedRol,
  selectedFecha,
  setSelectedFecha,
  selectedEstado,
  setSelectedEstado,
  turnAttended,
  turnUnAttended,
  attendedBySpeciality,
  attendedByRol,
  datosGrafico,
}: Props) => {
  return (
    <div className="drop-shadow-xl bg-white min-h-[80vh] flex flex-col justify-between p-4">
      <div>
        <h2 className="text-2xl font-bold">Reportes de atención</h2>
        <p>Genere informes detallados sobre el nivel de atención brindado</p>
      </div>

      <section className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full mt-4">
        <FilterSelect
          label="Especialidad"
          options={especialidades}
          value={selectedEspecialidad}
          onChange={setSelectedEspecialidad}
        />
        <FilterSelect
          label="Rol paciente"
          options={rolesPaciente}
          value={selectedRol}
          onChange={setSelectedRol}
        />
        <FilterSelect
          label="Rango fechas"
          options={rangosFecha}
          value={selectedFecha}
          onChange={setSelectedFecha}
        />
        <FilterSelect
          label="Estado turnos"
          options={estadosTurno}
          value={selectedEstado}
          onChange={setSelectedEstado}
        />
      </section>

      <section className="flex flex-col lg:flex-row justify-between gap-6 h-full mt-6">
        {/* Aquí el cambio está en usar flex-col en base a <1024px (lg) */}
        <div className="flex-1 w-full lg:max-w-[48%]">
          <DatosStadistics
            turnAttended={turnAttended}
            turnUnAttended={turnUnAttended}
            attendedBySpeciality={attendedBySpeciality}
            attendedByRol={attendedByRol}
            specialityLabels={especialidades.filter((e) => e !== "Todos")}
            rolLabels={rolesPaciente.filter((r) => r !== "Todos")}
          />
        </div>
        <div className="flex-1 w-full lg:max-w-[48%] mt-6 lg:mt-0">
          <GraphicShift data={datosGrafico} title="Turnos" />
        </div>
      </section>
    </div>
  );
};

export default StadisticsShifts;
