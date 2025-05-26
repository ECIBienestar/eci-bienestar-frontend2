import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  getTurnCountBySpeciality,
  getTurnCountByRole,
} from "@modules/appointment-management/services/stadistic";
import StadisticsShifts from "../../components/StadisticsShifts/StadisticsShifts";

const Stadistics = () => {
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [rolesPaciente, setRolesPaciente] = useState<string[]>([]);
  const [rangosFecha, setRangosFecha] = useState<string[]>([]);
  const [estadosTurno, setEstadosTurno] = useState<string[]>([]);

  const [selectedEspecialidad, setSelectedEspecialidad] =
    useState<string>("Todos");
  const [selectedRol, setSelectedRol] = useState<string>("Todos");
  const [selectedFecha, setSelectedFecha] = useState<string>("Todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("Todos");

  const [turnAttended, setTurnAttended] = useState<number>(0);
  const [turnUnAttended, setTurnUnAttended] = useState<number>(0);
  const [attendedByRol, setAttendedByRol] = useState<number[]>([]);
  const [attendedBySpeciality, setAttendedBySpeciality] = useState<number[]>(
    []
  );
  const [datosGrafico, setDatosGrafico] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setEspecialidades(await fetchEspecialidades());
      setRolesPaciente(await fetchRoles());
      setRangosFecha(await fetchRangosFecha());
      setEstadosTurno(await fetchEstadosTurno());
    };

    fetchData();
  }, []);

  const fetchEspecialidades = async () => [
    "Todos",
    "Medicina General",
    "Odontologia",
    "Psicologia",
  ];
  const fetchRoles = async () => [
    "Todos",
    "Estudiante",
    "Docente",
    "Administrativo",
    "Servicios generales",
  ];
  const fetchRangosFecha = async () => [
    "Todos",
    "Última semana",
    "Último mes",
    "Último año",
  ];
  const fetchEstadosTurno = async () => [
    "Todos",
    "Pendiente",
    "Completo",
    "Actual",
    "Terminado",
  ];

  const especialidadMap: Record<string, string> = {
  "Medicina General": "GENERAL_MEDICINE",
  "Odontologia": "DENTISTRY",
  "Psicologia": "PSYCHOLOGY",
};

const rolMap: Record<string, string> = {
  "Estudiante": "STUDENT",
  "Docente": "TEACHER",
  "Administrativo": "ADMINISTRATOR",
  "Servicios generales": "GENERAL_SERVICES",
};

  const getDateRange = (label: string): { start: string; end: string } => {
    const now = new Date();
    let start: Date;

    switch (label) {
      case "Última semana":
        start = new Date();
        start.setDate(now.getDate() - 7);
        break;
      case "Último mes":
        start = new Date();
        start.setMonth(now.getMonth() - 1);
        break;
      case "Último año":
        start = new Date();
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start = new Date(2000, 0, 1);
    }

    return {
      start: start.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    if (especialidades.length === 0 || rolesPaciente.length === 0) return;
    const fetchEstadisticas = async () => {
      const { start, end } = getDateRange(selectedFecha);

      try {
        // Traduce filtros
        const apiEspecialidad =
          selectedEspecialidad !== "Todos"
            ? especialidadMap[selectedEspecialidad]
            : undefined;
        const apiRol =
          selectedRol !== "Todos" ? rolMap[selectedRol] : undefined;
        const apiEstado =
          selectedEstado !== "Todos" ? selectedEstado.toUpperCase() : undefined;

        // Por especialidad
        const specialityData = await getTurnCountBySpeciality(
          start,
          end,
          apiEspecialidad,
          apiEstado
        );

        const especialidadArray = especialidades
          .filter((esp) => esp !== "Todos")
          .map((esp) => {
            const apiValue = especialidadMap[esp];
            const found = specialityData.data.find(
              (d) => d.speciality === apiValue
            );
            return found?.count || 0;
          });
        setAttendedBySpeciality(especialidadArray);

        // Por rol
        const rolData = await getTurnCountByRole(start, end, apiRol, apiEstado);
        const rolesArray = rolesPaciente
          .filter((rol) => rol !== "Todos")
          .map((rol) => {
            const apiValue = rolMap[rol];
            const found = rolData.data.find((d) => d.role === apiValue);
            return found?.count || 0;
          });
        setAttendedByRol(rolesArray);

        // Turnos atendidos (COMPLETED)
        const attendedData = await getTurnCountByRole(
          start,
          end,
          undefined,
          "COMPLETED"
        );
        const attendedTotal = attendedData.data.reduce(
          (acc, curr) => acc + curr.count,
          0
        );
        setTurnAttended(attendedTotal);

        // Turnos no atendidos (otros estados)
        const unAttendedStatuses = ["PENDING", "CURRENT", "FINISHED"];
        let unAttendedTotal = 0;
        for (const status of unAttendedStatuses) {
          const response = await getTurnCountByRole(
            start,
            end,
            undefined,
            status
          );
          unAttendedTotal += response.data.reduce(
            (acc, curr) => acc + curr.count,
            0
          );
        }
        setTurnUnAttended(unAttendedTotal);

        // Datos para gráfico
        const datosGraficoTemp: { name: string; value: number }[] = [];

        const isEstadoFilterOnly =
          selectedEstado !== "Todos" &&
          selectedEspecialidad === "Todos" &&
          selectedRol === "Todos";

        if (isEstadoFilterOnly) {
          const statusLabels = {
            PENDING: "Pendiente",
            COMPLETED: "Completado",
            CURRENT: "Actual",
            FINISHED: "Terminado",
          } as const;

          type StatusKey = keyof typeof statusLabels;
          const statuses: StatusKey[] = [
            "PENDING",
            "COMPLETED",
            "CURRENT",
            "FINISHED",
          ];
          for (const status of statuses) {
            const response = await getTurnCountByRole(
              start,
              end,
              undefined,
              status
            );
            const total = response.data.reduce(
              (acc, curr) => acc + curr.count,
              0
            );
            datosGraficoTemp.push({ name: statusLabels[status], value: total });
          }
        } else if (selectedEspecialidad === "Todos") {
          specialityData.data.forEach(({ speciality, count }) => {
            datosGraficoTemp.push({ name: speciality, value: count });
          });
        } else if (selectedRol === "Todos") {
          rolData.data.forEach(({ role, count }) => {
            datosGraficoTemp.push({ name: role, value: count });
          });
        }

        setDatosGrafico(datosGraficoTemp);
      } catch (error) {
        console.error("Error obteniendo estadísticas reales:", error);
      }
    };

    fetchEstadisticas();
  }, [
    selectedEspecialidad,
    selectedRol,
    selectedFecha,
    selectedEstado,
    especialidades,
    rolesPaciente,
  ]);

  return (
    <div className="ml-8 mr-8">
      <div className="mb-7 mt-7 flex justify-between">
        <h1 className="text-4xl font-bold">Reportes</h1>
        <Button
          className="bg-health-primary text-white px-4 py-2"
          type="button"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" /> Volver
        </Button>
      </div>

      <StadisticsShifts
        especialidades={especialidades}
        rolesPaciente={rolesPaciente}
        rangosFecha={rangosFecha}
        estadosTurno={estadosTurno}
        selectedEspecialidad={selectedEspecialidad}
        setSelectedEspecialidad={setSelectedEspecialidad}
        selectedRol={selectedRol}
        setSelectedRol={setSelectedRol}
        selectedFecha={selectedFecha}
        setSelectedFecha={setSelectedFecha}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        turnAttended={turnAttended}
        turnUnAttended={turnUnAttended}
        attendedBySpeciality={attendedBySpeciality}
        attendedByRol={attendedByRol}
        datosGrafico={datosGrafico}
      />
    </div>
  );
};

export default Stadistics;
