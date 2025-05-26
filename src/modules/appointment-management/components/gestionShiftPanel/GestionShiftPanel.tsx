import {
  Card,
  CardBody,
  CardHeader,
  Form as FormHero,
  Tab,
  Tabs,
  Alert,
} from "@heroui/react";
import SpecialtyToggle from "./SpecialtyToggle";
import ShiftsStatus from "./ShiftsStatus";
import useGestionShiftPanel from "../../hooks/useGestionShiftPanel";
import { SpecialityEnum } from "../../types/enums";
import { ShowLoading } from "../common";

const GestionShiftPanel = () => {
  const {
    availability,
    availabilityShifts,
    isLoading,
    toggleShiftAvailability,
    toggleSpeciality,
  } = useGestionShiftPanel();

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col items-start gap-2 z-0">
        <h1 className="text-3xl font-bold max-sm:text-2xl">
          Panel de administrador
        </h1>
        <p className="text-xs font-normal text-zinc-500">
          Gestión de disponibilidad de turnos
        </p>
      </CardHeader>

      <Tabs aria-label="Options" fullWidth>
        <Tab key="speciality" title="Especialidad">
          <Card>
            <CardHeader className="flex flex-col items-start gap-2 px-5">
              <p className="text-l">
                Gestión de disponibilidad por especialidad
              </p>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {isLoading && <ShowLoading />}

              {!isLoading && (
                <FormHero
                  className="flex flex-col gap-8"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {Object.values(SpecialityEnum).map((speciality) => (
                    <SpecialtyToggle
                      key={speciality}
                      specialty={speciality}
                      isAvailable={availability[speciality]}
                      isGlobalEnabled={availabilityShifts}
                      isLoading={isLoading}
                      onToggle={() => toggleSpeciality(speciality)}
                    />
                  ))}

                  {!availabilityShifts && (
                    <Alert
                      color="warning"
                      className="w-full"
                      description="La gestión de disponibilidad está deshabilitada. Habilite los turnos para poder gestionar la disponibilidad."
                    />
                  )}
                </FormHero>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="shifts" title="Turnos">
          <Card>
            <CardHeader className="flex flex-col items-start gap-2">
              <ShiftsStatus
                isEnabled={availabilityShifts}
                onToggle={toggleShiftAvailability}
              />
            </CardHeader>
          </Card>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default GestionShiftPanel;
