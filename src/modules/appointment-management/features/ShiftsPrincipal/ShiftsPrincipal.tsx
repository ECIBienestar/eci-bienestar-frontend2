import { Button } from "@heroui/react";
import Layout from "../../layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faGear,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import ShiftsUser from "../../components/shiftsUser/shiftsUser";
import { useNavigate } from "react-router-dom";

const ShiftsPrincipal = () => {
  const navigate = useNavigate();

  return (
    <Layout
      header={
        <div className="w-full flex flex-row items-center justify-between bg-white py-5 px-7 max-lg:flex-col max-lg:gap-5">
          <h1 className="font-bold text-2xl">Sistema de turnos</h1>
          <div className="flex flex-row items-center justify-between gap-4">
            <Button
              className="bg-health-primary text-white px-4 py-2"
              type="button"
              onPress={() => navigate("/modules/health/statistics")}
            >
              <FontAwesomeIcon icon={faChartSimple} size="lg" color="white" />
              Estadísticas
            </Button>
            <Button
              className="bg-health-primary text-white px-4 py-2"
              type="button"
              onPress={() => navigate("/modules/health/manage-shifts")}
            >
              <FontAwesomeIcon icon={faGear} size="lg" color="white" />
              Gestionar turnos
            </Button>
            <Button
              className="bg-health-primary text-white px-4 py-2"
              type="button"
              onPress={() => navigate("/modules/health/request-shifts")}
            >
              <FontAwesomeIcon icon={faPlus} /> Pedir turno
            </Button>
          </div>
        </div>
      }
      body={<ShiftsUser />}
    />
  );
};

export default ShiftsPrincipal;
