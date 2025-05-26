import { Role } from "@/common/types";
import { useEffect, useState } from "react";
import { useAuth } from "@common/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function GymRedirect() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const verifyUserRegistration = async () => {
            if (!user) {
                console.warn("No hay usuario autenticado.");
                return;
            }

            console.log("Usuario autenticado:", user);

            try {
                const email = encodeURIComponent(user.email);
                const getUrl = `https://ecibienestar-age6hsb9g4dmegea.canadacentral-01.azurewebsites.net/api/user/users/email?email=${email}`;
                console.log("Consultando usuario en backend:", getUrl);

                const response = await axios.get(getUrl);
                const userData = response.data?.data;

                sessionStorage.setItem("email", userData.email);
                
                console.log("Respuesta del backend:", userData);

                // Redirección por rol
                if (user.role === Role.ADMINISTRATOR) {
                    console.log("Redirigiendo a administrador");
                    navigate("admin/index", { replace: true });
                    return;
                }else if (user.role === Role.TRAINER) {
                    console.log("Redirigiendo a entrenador");
                    navigate("trainer/index", { replace: true });
                    return;
                }else if (user.role === Role.STUDENT) {
                    if(!userData.registered){
                        console.warn("Usuario no registrado, redirigiendo a registro");
                        navigate("student/index", { replace: true });
                    }else{
                        console.log("Redirigiendo a estudiante");
                        navigate("student/home", { replace: true });
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error Axios al verificar el registro:", {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                        url: error.config?.url,
                    });
                } else {
                    console.error("Error inesperado al verificar el registro del usuario:", error);
                }

                navigate("/not-found", { replace: true });
            } finally {
                setChecked(true);
            }
        };

        verifyUserRegistration();
    }, [user, navigate]);

    if (!checked) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg">Verificando tu registro...</p>
            </div>
        );
    }

    return null;
}

export default GymRedirect;
