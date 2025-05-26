import { useAuth } from "@/common/context";
import Layout from "@/modules/appointment-management/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/react";
import {
  Header,
  CurrentAttention,
  ShiftsOnHold,
} from "@modules/appointment-management/components/doctor";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toSpecialityEnum } from "@modules/appointment-management/utils/specialityUtils";

function DoctorView() {
  const { user } = useAuth();
  const [level, setLevel] = useState<number>(0);
  const navigate = useNavigate();
  const speciality = toSpecialityEnum(user?.speciality);

  if (!speciality) {
    return <div>La especialidad no esta soportada</div>;
  }

  return (
    <Layout
      header={
        <div className="w-full flex flex-row items-center justify-between bg-white py-5 px-7">
          <h1 className="font-bold text-2xl">Sistema de turnos</h1>
          <div className="flex flex-row items-center justify-between gap-4">
            <Button
              className="bg-health-primary text-white px-4 py-2"
              type="button"
              onPress={() => navigate(-1)}
            >
              <FontAwesomeIcon
                icon={["fas", "arrow-left"]}
                size="lg"
                color="white"
              />{" "}
              Volver
            </Button>
          </div>
        </div>
      }
      body={
        <div className="w-11/12 m-auto max-w-6xl">
          <Header name={user?.fullName ?? ""} speciality={speciality} />
          <div className="flex flex-row gap-5 my-8 h-[650px] max-md:flex-col max-md:h-auto">
            <CurrentAttention
              className="w-1/2 max-md:w-full"
              speciality={speciality}
              level={level}
              setLevel={setLevel}
            />
            <ShiftsOnHold
              className="w-1/2 max-md:w-full max-md:h-[650px]"
              speciality={speciality}
              setLevel={setLevel}
              level={level}
            />
          </div>
        </div>
      }
    ></Layout>
  );
}

export default DoctorView;
