import { Button } from "@heroui/react";
import Layout from "../../../appointment-management/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { GestionShiftPanel } from "../../components/gestionShiftPanel";
import { useNavigate } from "react-router-dom";

const GestionShifts = () => {
  const navigate = useNavigate();

  return (
    <Layout
      header={
        <div className="w-full flex flex-row items-center justify-between bg-white py-5 px-7 max-[500px]:flex-col max-[500px]:gap-4">
          <h1 className="font-bold text-2xl">Sistema de turnos</h1>
          <div className="flex flex-row items-center justify-between gap-4">
            <Button
              className="bg-health-primary text-white px-4 py-2"
              type="button"
              onPress={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" color="white" />{" "}
              Volver
            </Button>
          </div>
        </div>
      }
      body={
        <div className="flex flex-col items-center justify-center w-full h-full p-2">
          <div className="w-11/12 max-w-3xl">
            <GestionShiftPanel />
          </div>
        </div>
      }
    ></Layout>
  );
};

export default GestionShifts;
