// src/components/ForgotPasswordForm.tsx
import React, { useState } from "react";
import { requestPasswordReset } from "../services/authService";
import { Link } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error en el servidor. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#cf3a3a] shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">
        Recuperar contraseña
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-white font-semibold text-sm sm:text-base"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@mail.escuelaing.edu.co"
            required
            className="w-full px-4 py-2 border border-[#bdc3c7] rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#990000]"
          />
        </div>

        {error && <p className="mb-4 text-red-200 text-sm">{error}</p>}
        {message && <p className="mb-4 text-green-200 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-[#990000] text-white rounded-full font-medium hover:bg-opacity-90 transition"
        >
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      {/* —— Aquí añadimos el enlace para volver al login —— */}
      <div className="mt-4 text-center">
        <Link to="/" className="text-sm sm:text-base text-[#7aa6ff] hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;



