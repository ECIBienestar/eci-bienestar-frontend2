import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Validación del formulario con Yup
const schema = yup.object().shape({
  gender: yup
    .string()
    .oneOf(["HOMBRE", "MUJER", "OTRO"], "Selecciona una opción válida")
    .required("El género es obligatorio"),
  height: yup
    .number()
    .typeError("Debes ingresar una altura válida")
    .required("La altura es obligatoria")
    .min(100, "Altura mínima: 100 cm")
    .max(250, "Altura máxima: 250 cm"),
  age: yup
    .number()
    .typeError("Debes ingresar una edad válida")
    .required("La edad es obligatoria")
    .min(16, "Edad mínima: 16 años")
    .max(80, "Edad máxima: 80 años"),
  weight: yup
    .number()
    .typeError("Debes ingresar un peso válido")
    .required("El peso es obligatorio")
    .min(35, "Peso mínimo: 35 kg")
    .max(200, "Peso máximo: 200 kg"),
});

// Tipado para los datos del formulario
interface FormData {
  gender: "HOMBRE" | "MUJER" | "OTRO";
  height: number;
  age: number;
  weight: number;
}

// Componente principal
const RegisterMeasurements = () => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: "OTRO", // Set a valid default value
      height: 160,
      age: 20,
      weight: 60,
    },
  });

  const onSubmit = async (data: any) => {
    const email = sessionStorage.getItem("email");
    
    const getUrl = `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${email}`;
    console.log("Consultando usuario en backend:", getUrl);

    const response = await axios.get(getUrl);
    const userData = response.data?.data;

    sessionStorage.setItem("height", data.height);
    sessionStorage.setItem("weight", data.weight);

    console.log("Respuesta del backend:", userData);
    console.log("id del usuario:", userData.id);
    const putUrl = `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/users/${userData.id}`;
    console.log("Actualizando usuario en backend:", putUrl);
    await axios.put(putUrl, {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      gender: data.gender,
      registered: true,
      registrationDate: new Date().toISOString().split("T")[0]
    });
    console.log("Usuario actualizado correctamente");

    alert("Datos registrados correctamente");
    console.log(data);
    navigate("../student/body-measurements");
  };

  const gender = watch("gender");

  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold bg-black text-white py-2 px-4 rounded">
        Registro Medidas Iniciales
      </h1>
      <h2 className="text-2xl font-bold">¡Ingresa tus medidas!</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">
            Género<span className="text-red-500">*</span>
          </label>
          <div className="flex justify-center gap-12">
            <button
              type="button"
              onClick={() => setValue("gender", "HOMBRE")}
              className={`w-24 h-24 cursor-pointer border-4 ${
                gender === "HOMBRE" ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img src="/src/modules/gym-management/assets/images/hombre.png" alt="Hombre" />
            </button>
            <button
              type="button"
              onClick={() => setValue("gender", "MUJER")}
              className={`w-24 h-24 cursor-pointer border-4 ${
                gender === "MUJER" ? "border-pink-500" : "border-transparent"
              }`}
            >
              <img src="/src/modules/gym-management/assets/images/mujer.png" alt="Mujer" />
            </button>
            <button
              type="button"
              onClick={() => setValue("gender", "OTRO")}
              className={`w-24 h-24 flex items-center justify-center cursor-pointer border-4 rounded ${
                gender === "OTRO" ? "border-gray-500" : "border-transparent"
              } bg-gray-200 font-semibold`}
            >
              No especificar
            </button>
          </div>
          {gender && (() => {
            let genderLabel = "";
            if (gender === "HOMBRE") {
              genderLabel = "Hombre";
            } else if (gender === "MUJER") {
              genderLabel = "Mujer";
            } else {
              genderLabel = "No especificar";
            }
            return (
              <div className="text-center font-semibold mt-2">
                Seleccionaste: {genderLabel}
              </div>
            );
          })()}
        </div>

        {/* Altura */}
        <div>
          <label className="block font-semibold">Altura (cm)</label>
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="range"
                  min={100}
                  max={250}
                  {...field}
                  className={`w-full ${errors.height ? "border-red-500" : ""}`}
                />
                <div className="text-center">{field.value} cm</div>
              </>
            )}
          />
          {errors.height && (
            <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <label className="block font-semibold">Edad</label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="range"
                  min={16}
                  max={80}
                  {...field}
                  className={`w-full ${errors.age ? "border-red-500" : ""}`}
                />
                <div className="text-center">{field.value} años</div>
              </>
            )}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Peso */}
        <div>
          <label className="block font-semibold">Peso (kg)</label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="range"
                  min={35}
                  max={200}
                  {...field}
                  className={`w-full ${errors.weight ? "border-red-500" : ""}`}
                />
                <div className="text-center">{field.value} kg</div>
              </>
            )}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
          )}
        </div>

        <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
            >
              Siguiente
            </button>
      </form>
    </div>
  );
};

export default RegisterMeasurements;