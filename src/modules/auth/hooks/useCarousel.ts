// src/hooks/useCarousel.ts
import { useState, useEffect } from "react";

export function useCarousel(
  imageCount: number,
  intervalMs: number = 5000
) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  useEffect(() => {
    const handle = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % imageCount);
    }, intervalMs);

    return () => {
      clearInterval(handle);
    };
  }, [imageCount, intervalMs]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % imageCount);
  };

  return { currentIdx, prevSlide, nextSlide, setCurrentIdx };
}
