import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/ECIBienestarTransparent.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();
  const handlePassword = () => {};

  return (
    <div className="flex h-screen font-sans w-screen">
      <div className="flex-1 bg-[#990000] flex items-center justify-center">
        {/* falta el carrusel */}
        <p>Imágenes de la escuela</p>
      </div>

      <div className="w-1/2 bg-white relative flex flex-col items-center justify-center p-8">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 w-11 h-11 rounded-full border-3 border-[#cf3a3a] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-[#cf3a3a]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="mx-auto w-auto h-[10rem]" />
          <h2 className="text-[35px] font-bold text-[#cf3a3a]">
            Recupera tu contraseña
          </h2>
          <p className="text-[#CF3A3A] text-[16px] text-left">
            Verifica tu dirección de email. Una vez que lo hayas hecho, te
            enviaremos instrucciones para restablecer tu contraseña
          </p>
        </div>

        <div className="w-full max-w-[400px] min-w-[200px] p-8 rounded-[30px] bg-[#cf3a3a] shadow-md">
          <form onSubmit={handlePassword}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@mail.escuela.edu.co"
                required
              />
            </div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="w-full p-3 bg-[#990000] text-white border-none rounded-[30px] text-base cursor-pointer mb-4"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
