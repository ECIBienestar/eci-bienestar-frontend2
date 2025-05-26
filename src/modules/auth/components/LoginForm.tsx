import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/ECIBienestarTransparent.png";
import apiClient from "../../../common/services/apiClient";
import { useAuth } from "@/common/context";
import { User, LoginResponse } from "@/common/types";

const Login: React.FC = () => {
  const [username, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      console.log("Login exitoso:", response.data);

      const { token, refreshToken, id, email, fullName, role, specialty } =
        response.data;
      const user: User = {
        id,
        email,
        fullName,
        role,
        speciality: specialty,
      };

      login(user, token, refreshToken);
      navigate("/home");
    } catch (err: any) {
      console.error("Error en login:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Credenciales incorrectas o error en el servidor. Inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans w-screen">
      <div className="flex-1 bg-[#990000] flex items-center justify-center">
        {/* falta el carrusel */}
        <p>Imágenes de la escuela</p>
      </div>

      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="mx-auto w-auto h-[10rem]" />
          <h2 className="text-[35px] font-bold text-[#cf3a3a]">
            Inicio de Sesión
          </h2>
        </div>

        <div className="w-full max-w-[400px] min-w-[200px] p-8 rounded-[30px] bg-[#cf3a3a] shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-61">
              <label
                htmlFor="email"
                className="block mb-2 text-[#ffffff] font-bold text-[15px]"
              >
                Correo
              </label>
              <input
                className="w-full p-3 border border-[#bdc3c7] text-base text-[#000000] rounded-[30px] mb-5"
                type="email"
                id="email"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@mail.escuela.edu.co"
                required
              />
            </div>

            <div className="block mb-2 text-[#ffffff] font-bold">
              <label
                htmlFor="password"
                className="block mb-2 text-[#ffffff] font-bold text-[15px]"
              >
                Contraseña
              </label>
              <input
                className="w-full p-3 border border-[#bdc3c7] rounded-[30px] text-base text-[#000000] mb-5"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-[#990000] text-white border-none rounded-[30px] text-base cursor-pointer mb-4"
              >
                {isLoading ? "Cargando..." : "Iniciar Sesión"}
              </button>
              <Link
                to="/forgot-password"
                className="text-[#7aa6ff] no-underline text-[1.2rem]"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
