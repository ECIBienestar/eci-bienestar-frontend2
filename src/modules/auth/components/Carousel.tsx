// src/components/Carousel.tsx
import React from "react";

export interface CarouselProps {
  images: string[];
  currentIdx: number;
  onDotClick: (idx: number) => void;
  prevSlide?: () => void;
  nextSlide?: () => void;
  /**
   * Si true, dibuja una capa semitransparente (“overlay”) sobre la imagen (para móviles).
   */
  overlayOpacity?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  currentIdx,
  onDotClick,
  prevSlide,
  nextSlide,
  overlayOpacity = false,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIdx
              ? overlayOpacity
                ? "opacity-50"
                : "opacity-100"
              : "opacity-0"
          }`}
        />
      ))}

      {/* Puntos de navegación */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
              idx === currentIdx ? "bg-white opacity-100" : "bg-white opacity-50"
            }`}
          />
        ))}
      </div>

      {/* Flechas opcionales */}
      {prevSlide && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
          aria-label="Anterior"
        >
          ‹
        </button>
      )}
      {nextSlide && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10"
          aria-label="Siguiente"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Carousel;
