// src/components/LoginForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, LoginResponse } from "../services/authService";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
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
      const data: LoginResponse = await login(username, password);

      if (!data.token) {
        throw new Error("No se recibió token del servicio de autenticación.");
      }

      // 1) Guardar tokens
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 2) Guardar información mínima del usuario
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          specialty: data.specialty,
        })
      );

      // 3) Redirigir a /home
      navigate("/home");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Credenciales incorrectas o error en el servidor. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#cf3a3a] shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-white font-semibold text-sm sm:text-base"
          >
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="usuario@mail.escuela.edu.co"
            required
            className="w-full px-4 py-2 border border-[#bdc3c7] rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#990000]"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-white font-semibold text-sm sm:text-base"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            className="w-full px-4 py-2 border border-[#bdc3c7] rounded-full text-black focus:outline-none focus:ring-2 focus:ring-[#990000]"
          />
        </div>

        {error && <p className="mb-4 text-red-200 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-[#990000] text-white rounded-full font-medium hover:bg-opacity-90 transition"
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm sm:text-base text-[#7aa6ff]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
