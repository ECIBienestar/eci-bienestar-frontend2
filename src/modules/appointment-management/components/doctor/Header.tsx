import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, User } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { SpecialityEnum } from "@modules/appointment-management/types/enums";
import { SpecialityLabels } from "@modules/appointment-management/constants";

type Props = {
  readonly name: string;
  readonly speciality: SpecialityEnum;
};

function Header({ name, speciality }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardBody>
        <div className="flex flex-row items-center justify-between py-5 px-7 max-md:px-2 max-[450px]:flex-col max-[450px]:gap-5 max-[450px]:py-2">
          <User
            description={SpecialityLabels[speciality]}
            name={name}
            classNames={{
              name: "text-lg",
              description: "text-sm",
            }}
          />
          <Button
            className="bg-health-primary text-white"
            type="button"
            onPress={() => navigate("/modules/health/request-shifts")}
          >
            <FontAwesomeIcon icon={faPlus} /> Pedir turno
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default Header;
