import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Form as FormHero,
  SelectItem,
  Button,
  RadioGroup,
  Radio,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  useCheckUserExists,
  useCreateTurn,
} from "@modules/appointment-management/hooks";
import {
  CreateTurnRequest,
  TurnResponse,
  UserExternalResponse,
} from "@modules/appointment-management/types/dto";
import {
  PriorityEnum,
  RoleEnum,
  SpecialityEnum,
} from "@modules/appointment-management/types/enums";
import { SpecialityLabels } from "../../constants";

interface FormProps {
  setUserFound: (bool: boolean) => void;
  setUserHasTurn: (bool: boolean) => void;
  setTurnResponse: (turnResponse: TurnResponse) => void;
  turnsEnabled?: boolean;
  turnsDisabledBySpeciality?: SpecialityEnum[];
  onSubmitAction: (bool: boolean) => void;
}

const Form: React.FC<FormProps> = ({
  setUserFound,
  setUserHasTurn,
  setTurnResponse,
  turnsEnabled = true,
  turnsDisabledBySpeciality,
  onSubmitAction,
}) => {
  const [id, setId] = useState<string>("");
  const [formData, setFormData] = useState<{
    name: string;
    role: RoleEnum | null;
  }>({
    name: "",
    role: null,
  });
  const [speciality, setSpeciality] = useState<SpecialityEnum | null>(null);
  const [priority, setPriority] = useState<PriorityEnum | null>(null);
  const { data, isLoading } = useCheckUserExists(id.length === 9 ? id : "");
  const { mutate: createTurn, isPending } = useCreateTurn();

  const user: UserExternalResponse | null | undefined = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !speciality) return;

    const request: CreateTurnRequest = {
      user: {
        id,
        name: formData.name,
        role: formData.role,
      },
      speciality,
      ...(priority && { priority }),
    };

    createTurn(request, {
      onSuccess: (res) => {
        setTurnResponse(res.data);
        setUserHasTurn(false);
        onSubmitAction(true);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;
        if (message === "User have already a turn") {
          setUserHasTurn(true);
        } else {
          setUserFound(false);
        }
      },
    });
  };

  useEffect(() => {
    if (id.length === 9) {
      if (user) {
        setFormData({
          name: user.fullName,
          role: user.role,
        });
        setUserFound(true);
      } else {
        setFormData({
          name: "",
          role: null,
        });
        setUserFound(false);
      }
    }
  }, [user]);

  return (
    <Card className=" w-full p-5">
      <CardHeader className="flex flex-col items-start gap-2 z-0">
        <h1 className="text-3xl font-bold max-sm:text-2xl">
          Registro de usuario
        </h1>
        <p className="text-xs font-normal">
          Ingrese sus datos para obtener un turno de atencion
        </p>
      </CardHeader>
      <CardBody>
        <FormHero className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Nombre completo"
            labelPlacement="outside"
            placeholder="Ingrese su nombre"
            type="text"
            value={formData.name}
            validate={(value) => {
              if (value.length === 0) {
                return "Ingrese su nombre completo";
              }
            }}
            isDisabled
          />
          <Input
            isRequired
            label="Documento de identidad"
            labelPlacement="outside"
            placeholder="Ingrese su numero de documento"
            type="text"
            maxLength={9}
            inputMode="numeric"
            pattern="[0-9]*"
            value={id}
            onValueChange={(value) => {
              const numericValue = value.replace(/\D/g, "").slice(0, 9);
              setId(numericValue);
            }}
            validate={(value) => {
              if (value.length !== 9) {
                return "El numero de documento debe contener 10 digitos";
              }
            }}
            isDisabled={isLoading || !turnsEnabled}
          />
          {isLoading && (
            <div className="flex flex-row gap-5">
              <Spinner size="sm" />
              <p className="text-sm text-gray-400">Buscando usuario ...</p>
            </div>
          )}
          <RadioGroup
            isRequired
            value={formData.role ?? ""}
            label="Rol del usuario"
            description="Selecciona un rol"
            classNames={{
              wrapper: "flex flex-row gap-8 max-md:!flex-col max-md:!gap-4",
            }}
            isDisabled
          >
            <Radio value={RoleEnum.STUDENT}>Estudiante</Radio>
            <Radio value={RoleEnum.TEACHER}>Docente</Radio>
            <Radio value={RoleEnum.ADMINISTRATOR}>Administrativo</Radio>
            <Radio value={RoleEnum.GENERAL_SERVICES_STAFF}>
              Servicios generales
            </Radio>
          </RadioGroup>
          <Select
            isRequired
            errorMessage="Seleccione una especialidad"
            label="Especialidad"
            labelPlacement="outside"
            placeholder="Seleccione una especialidad"
            selectedKeys={speciality ? [speciality] : []}
            onSelectionChange={(keys) =>
              setSpeciality(Array.from(keys)[0] as SpecialityEnum)
            }
            isDisabled={!turnsEnabled}
            disabledKeys={turnsDisabledBySpeciality}
          >
            {Object.values(SpecialityEnum).map((speciality) => (
              <SelectItem key={speciality}>
                {SpecialityLabels[speciality]}
              </SelectItem>
            ))}
          </Select>
          <RadioGroup
            label="Prioridad especial"
            description="Seleccione si aplica alguna condicion especial"
            value={priority ?? ""}
            onValueChange={(value) =>
              setPriority(value ? (value as PriorityEnum) : null)
            }
            classNames={{
              wrapper: "flex flex-row gap-8 max-sm:!flex-col max-sm:!gap-4",
            }}
            isDisabled={!turnsEnabled}
          >
            <Radio value={PriorityEnum.DISCAPACIDAD}>Discapacidad</Radio>
            <Radio value={PriorityEnum.EMBARAZO}>Embarazo</Radio>
          </RadioGroup>
          <Button
            className="bg-health-primary text-white w-full"
            type="submit"
            isLoading={isPending}
            isDisabled={!turnsEnabled}
          >
            Solicitar turno
          </Button>
        </FormHero>
      </CardBody>
    </Card>
  );
};

export default Form;
