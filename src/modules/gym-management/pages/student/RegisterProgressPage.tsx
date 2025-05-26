import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// ✅ Validación
const schema = yup.object().shape({
  goal: yup.string().required("El objetivo es obligatorio"),
  registrationDate: yup.string().required("La fecha es obligatoria").matches(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  weight: yup.number().typeError("Peso inválido").positive().required(),
  height: yup.number().typeError("Altura inválida").positive().required(),
  waists: yup.number().typeError("Cintura inválida").positive().required(),
  chest: yup.number().typeError("Pecho inválido").positive().required(),
  rightarm: yup.number().typeError("Brazo derecho inválido").positive().required(),
  leftarm: yup.number().typeError("Brazo izquierdo inválido").positive().required(),
  rightleg: yup.number().typeError("Pierna derecha inválida").positive().required(),
  leftleg: yup.number().typeError("Pierna izquierda inválida").positive().required(),
  routineId: yup.string().required("Selecciona una rutina"),
});

// Tipos de datos para las rutinas
interface Routine {
  id: string;
  name: string;
}

// Tipo de datos del formulario
interface FormData {
  goal: string;
  registrationDate: string;
  weight: number;
  height: number;
  waists: number;
  chest: number;
  rightarm: number;
  leftarm: number;
  rightleg: number;
  leftleg: number;
  routineId: string;
}

const RegisterProgressPages = () => {
  const [lastRecord, setLastRecord] = useState<FormData | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      goal: "",
      registrationDate: "",
      weight: 0.0,
      height: 0.0,
      waists: 0.0,
      chest: 0.0,
      rightarm: 0.0,
      leftarm: 0.0,
      rightleg: 0.0,
      leftleg: 0.0,
      routineId: "",
    },
  });

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get("https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/routines");
        setRoutines(response.data?.data || []);
      } catch (error) {
        console.error("Error al cargar las rutinas:", error);
      }
    };

    fetchRoutines();
  }, []);

  useEffect(() => {
    const fechtLastProgress = async () => {
      try{
        const emaiil = sessionStorage.getItem("email");
        if (!emaiil) {
          return;
        }

        const user = await axios.get(`https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${encodeURIComponent(emaiil)}`);
        const userId = user.data?.data?.id;

        const response = await axios.get(`https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/progress/${userId}`);
        const lastProgress = response.data?.data?.slice(-1)[0];

        if(lastProgress){
          const mappedLastProgress: FormData = {
            goal: lastProgress.goal || "",
            registrationDate: lastProgress.registrationDate || "",
            weight: lastProgress.weight || 0.0,
            height: lastProgress.height || 0.0,
            waists: lastProgress.waists || 0.0,
            chest: lastProgress.chest || 0.0,
            rightarm: lastProgress.rightarm || 0.0,
            leftarm: lastProgress.leftarm || 0.0,
            rightleg: lastProgress.rightleg || 0.0,
            leftleg: lastProgress.leftleg || 0.0,
            routineId: lastProgress.routine?.id || "",
          };
          setLastRecord(mappedLastProgress);
          reset(mappedLastProgress);
        }
      } catch (error) {
        console.error("Error al cargar el último registro de progreso:", error);
      }
    };

    fechtLastProgress();
  }, [reset]);

  const onSubmit = async (formData: FormData) => {
  try {
    const email = sessionStorage.getItem("email");
    if (!email) throw new Error("Email no encontrado en sesión.");

    // Obtener datos del usuario
    const userResponse = await axios.get(
      `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${encodeURIComponent(email)}`
    );
    const user = userResponse.data.data;

    if (!user || !user.id) throw new Error("Usuario no encontrado.");

    // Obtener rutina completa
    const routineResponse = await axios.get(
      `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/routines/${formData.routineId}`
    );
    const routine = routineResponse.data.data;

    if (!routine || !routine.id) throw new Error("Rutina no encontrada.");

    // Construir el cuerpo del POST
    const payload = {
      id: "", // El backend generará el ID
      userId: user,
      routine: routine,
      goal: formData.goal,
      registrationDate: formData.registrationDate,
      weight: formData.weight,
      height: formData.height,
      waists: formData.waists,
      chest: formData.chest,
      rightarm: formData.rightarm,
      leftarm: formData.leftarm,
      rightleg: formData.rightleg,
      leftleg: formData.leftleg,
      comments: [],
    };

    // Enviar al backend
    await axios.post(
      "https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/progress",
      payload
    );

    alert("Progreso registrado exitosamente ✅");

    reset();
  } catch (error: any) {
    console.error("Error al registrar el progreso:", error);
    alert("❌ Ocurrió un error al registrar el progreso.");
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold bg-black text-white py-2 px-4 rounded">Registro de Progreso Físico</h1>

      {lastRecord && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="font-semibold mb-2">Último registro</h2>
          <ul className="text-sm space-y-1">
            <li><strong>Objetivo:</strong> {lastRecord.goal}</li>
            <li><strong>Fecha:</strong> {lastRecord.registrationDate}</li>
            <li><strong>Peso:</strong> {lastRecord.weight} kg</li>
            <li><strong>Altura:</strong> {lastRecord.height} cm</li>
            <li><strong>Cintura:</strong> {lastRecord.waists} cm</li>
            <li><strong>Pecho:</strong> {lastRecord.chest} cm</li>
            <li><strong>Brazo Derecho:</strong> {lastRecord.rightarm} cm</li>
            <li><strong>Brazo Izquierdo:</strong> {lastRecord.leftarm} cm</li>
            <li><strong>Pierna Derecha:</strong> {lastRecord.rightleg} cm</li>
            <li><strong>Pierna Izquierda:</strong> {lastRecord.leftleg} cm</li>
            <li><strong>Rutina:</strong> {routines.find(r => r.id === lastRecord.routineId)?.name || "No asignada"}</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rutina */}
        <div>
          <label className="block font-semibold">Rutina <span className="text-red-500">*</span></label>
          <Controller
            name="routineId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border p-2 rounded ${errors.routineId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Selecciona una rutina</option>
                {routines.map((routine) => (
                  <option key={routine.id} value={routine.id}>
                    {routine.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.routineId && <p className="text-red-500 text-sm mt-1">{errors.routineId.message}</p>}
        </div>
        {/* Objetivo */}
        <div>
          <label className="block font-semibold">Objetivo <span className="text-red-500">*</span></label>
          <Controller
            name="goal"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full border p-2 rounded ${errors.goal ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>}
        </div>

        {/* Fecha de registro */}
        <div>
          <label className="block font-semibold">Fecha de registro <span className="text-red-500">*</span></label>
          <Controller
            name="registrationDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className={`w-full border p-2 rounded ${errors.registrationDate ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.registrationDate && <p className="text-red-500 text-sm mt-1">{errors.registrationDate.message}</p>}
        </div>

        {/* Peso */}
        <div>
          <label className="block font-semibold">Peso (kg) <span className="text-red-500">*</span></label>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.weight ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
        </div>

        {/* Altura */}
        <div>
          <label className="block font-semibold">Altura (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.height ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
        </div>

        {/* Cintura */}
        <div>
          <label className="block font-semibold">Cintura (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="waists"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.waists ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.waists && <p className="text-red-500 text-sm mt-1">{errors.waists.message}</p>}
        </div>

        {/* Pecho */}
        <div>
          <label className="block font-semibold">Pecho (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="chest"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.chest ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.chest && <p className="text-red-500 text-sm mt-1">{errors.chest.message}</p>}
        </div>

        {/* Brazo derecho */}
        <div>
          <label className="block font-semibold">Brazo derecho (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="rightarm"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.rightarm ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.rightarm && <p className="text-red-500 text-sm mt-1">{errors.rightarm.message}</p>}
        </div>

        {/* Brazo izquierdo */}
        <div>
          <label className="block font-semibold">Brazo izquierdo (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="leftarm"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.leftarm ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.leftarm && <p className="text-red-500 text-sm mt-1">{errors.leftarm.message}</p>}
        </div>

        {/* Pierna derecha */}
        <div>
          <label className="block font-semibold">Pierna derecha (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="rightleg"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.rightleg ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.rightleg && <p className="text-red-500 text-sm mt-1">{errors.rightleg.message}</p>}
        </div>

        {/* Pierna izquierda */}
        <div>
          <label className="block font-semibold">Pierna izquierda (cm) <span className="text-red-500">*</span></label>
          <Controller
            name="leftleg"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className={`w-full border p-2 rounded ${errors.leftleg ? "border-red-500" : "border-gray-300"}`}
              />
            )}
          />
          {errors.leftleg && <p className="text-red-500 text-sm mt-1">{errors.leftleg.message}</p>}
        </div>

        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">
          Guardar Progreso
        </button>
      </form>
    </div>
  );
};

export default RegisterProgressPages;