// src/pages/LoginPage.tsx
import React from "react";
import LoginForm from "../components/LoginForm";
import Carousel from "../components/Carousel";
import { useCarousel } from "../hooks/useCarousel";

// Rutas relativas a la carpeta “src” para imágenes
import logo from "../assets/images/logo/ECIBienestarTransparent.png";
import carousel1 from "../assets/images/carousel/img1.jpg";
import carousel2 from "../assets/images/carousel/img2.jpg";
import carousel3 from "../assets/images/carousel/img3.jpg";

const LoginPage: React.FC = () => {
  const carouselImages = [carousel1, carousel2, carousel3];
  const { currentIdx, prevSlide, nextSlide, setCurrentIdx } = useCarousel(
    carouselImages.length,
    5000
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen font-sans">
      {/* ──────── Lado carrusel (solo en desktop) ──────── */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#990000] items-center justify-center overflow-hidden">
        <Carousel
          images={carouselImages}
          currentIdx={currentIdx}
          onDotClick={setCurrentIdx}
          overlayOpacity={true}
        />
      </div>

      {/* ──────── Lado formulario ──────── */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="Logo" className="mx-auto h-24 sm:h-32 md:h-40" />
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#cf3a3a]">
            Inicio de Sesión
          </h2>
        </div>

        <LoginForm />

        {/* ──────── Carrusel en móvil ──────── */}
        <div className="md:hidden w-full h-40 mt-6 relative overflow-hidden rounded-xl shadow-inner bg-[#990000]">
          <Carousel
            images={carouselImages}
            currentIdx={currentIdx}
            onDotClick={setCurrentIdx}
            overlayOpacity={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
