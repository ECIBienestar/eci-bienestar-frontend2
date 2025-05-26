import { useEffect, useState } from "react";
import { MultimediaResponse } from "../types/dto/response/MultimediaResponse";

const FADE_DURATION = 500;

export const hookCarrosel = (items: MultimediaResponse[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!items.length) return;

    const showMs = items[currentIndex].duration * 1000;

    const fadeOutTimer = setTimeout(() => setVisible(false), showMs);
    const changeTimer = setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % items.length);
      setVisible(true);
    }, showMs + FADE_DURATION);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(changeTimer);
    };
  }, [currentIndex, items]);

  const current = items.length > 0 ? items[currentIndex] : null;

  return {
    currentIndex,
    visible,
    current,
    fadeDuration: FADE_DURATION,
  };
};

export default hookCarrosel;
