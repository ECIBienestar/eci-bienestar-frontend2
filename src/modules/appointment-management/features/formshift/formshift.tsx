import { useState } from "react";
import { Alert, Button } from "@heroui/react";
import Layout from "../../../appointment-management/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Form from "../../components/request/Form"; // Importar el formulario
import { Card } from "../../../appointment-management/components/confirmation"; // Importar la tarjeta de confirmación
import { useNavigate } from "react-router-dom";
import { TurnResponse } from "../../types/dto";
import { useTurnsDisabledBySpeciality, useTurnsEnabled } from "../../hooks";

const FormShift = () => {
  const navigate = useNavigate();
  const [userFound, setUserFound] = useState<boolean>(true);
  const [userHasTurn, setUserHasTurn] = useState<boolean>(false);
  const [turnResponse, setTurnResponse] = useState<TurnResponse | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const { data: turnEnabled } = useTurnsEnabled();
  const { data: turnsDisabledBySpeciality } = useTurnsDisabledBySpeciality();

  const handleFormSubmit = (bool: boolean) => {
    setIsFormSubmitted(bool);
  };

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
        <div className="w-11/12 flex flex-col items-center justify-center p-2 pb-5 m-auto">
          <div className="w-full">
            {!isFormSubmitted ? (
              <div className="flex flex-col gap-5 max-w-4xl m-auto">
                {!turnEnabled?.data && (
                  <Alert
                    icon={<FontAwesomeIcon icon={["fas", "calendar-xmark"]} />}
                    description="Los turnos no se encuentran disponibles por el momento"
                    title="Turnos deshabilitados"
                    color="danger"
                  />
                )}

                {!userFound && (
                  <Alert
                    icon={<FontAwesomeIcon icon={["fas", "user-xmark"]} />}
                    description="El usuario no se encontro en el sistema"
                    title="Usuario no encontrado"
                    color="warning"
                  />
                )}

                {userHasTurn && (
                  <Alert
                    icon={<FontAwesomeIcon icon={["fas", "user-xmark"]} />}
                    description="El usuario ya tiene un turno pendiente"
                    title="Usuario con turno"
                    color="warning"
                  />
                )}

                <Form
                  setUserFound={setUserFound}
                  setUserHasTurn={setUserHasTurn}
                  setTurnResponse={setTurnResponse}
                  turnsEnabled={turnEnabled?.data}
                  turnsDisabledBySpeciality={turnsDisabledBySpeciality?.data}
                  onSubmitAction={handleFormSubmit}
                />
              </div>
            ) : (
              <Card
                turnResponse={turnResponse!}
                setTurnResponse={setTurnResponse}
                onSubmitAction={handleFormSubmit}
              />
            )}
          </div>
        </div>
      }
    ></Layout>
  );
};

export default FormShift;
