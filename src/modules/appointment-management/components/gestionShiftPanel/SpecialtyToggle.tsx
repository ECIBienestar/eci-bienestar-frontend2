import { Switch } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { SpecialityEnum } from "../../types/enums";
import { SpecialityLabels } from "../../constants";

type Props = {
  specialty: SpecialityEnum;
  isAvailable: boolean;
  isGlobalEnabled: boolean;
  isLoading: boolean;
  onToggle: () => void;
};

const SpecialtyToggle = ({
  specialty,
  isAvailable,
  isGlobalEnabled,
  isLoading,
  onToggle,
}: Props) => {
  const active = isGlobalEnabled && isAvailable;

  return (
    <div
      className="w-full flex justify-between items-center max-[500px]:flex-col max-[500px]:gap-2"
      key={specialty}
    >
      <div className="flex items-center gap-2 px-2">
        <FontAwesomeIcon
          icon={active ? faCheckCircle : faTimesCircle}
          className={active ? "text-green-500" : "text-red-500"}
        />
        <span>{SpecialityLabels[specialty]}</span>
      </div>
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm text-gray-500">
          {active ? "Disponible" : "No disponible"}
        </span>
        <Switch
          isSelected={active}
          aria-label={SpecialityLabels[specialty]}
          checked={isAvailable}
          onChange={onToggle}
          isDisabled={isLoading}
          classNames={{
            wrapper: active ? "bg-health-primary" : "bg-gray-300",
          }}
        />
        {/* <p>hola</p> */}
        {isLoading && <p>cargando..</p>}
      </div>
    </div>
  );
};

export default SpecialtyToggle;
