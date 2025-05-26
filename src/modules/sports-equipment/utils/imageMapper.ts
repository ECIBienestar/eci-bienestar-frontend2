

import futbolImg from "../Images-sport-equipment/balon_futbol.png";
import basketImg from "../Images-sport-equipment/balon_basket.png";
import voleyImg from "../Images-sport-equipment/balon_voley.png";
import raquetasImg from "../Images-sport-equipment/raqueta1.png";
import pelotasImg from "../Images-sport-equipment/pelota_tennis.png";
import equipamientoImg from "../Images-sport-equipment/cono.png";

export const getMockedImageByCategory = (category?: string): string => {
    switch (category) {
        case "futbol":
            return futbolImg;
        case "basket":
            return basketImg;
        case "voley":
            return voleyImg;
        case "raquetas":
            return raquetasImg;
        case "pelotas":
            return pelotasImg;
        case "equipamiento":
            return equipamientoImg;
        default:
            return futbolImg;
    }
};


export const getExpiredImageByName  = (nombre: string): string => {
    const lower = nombre.toLowerCase();
    if (lower.includes("balón") || lower.includes("balon")) return "pelotas";
    if (lower.includes("raqueta")) return "raquetas";
    if (lower.includes("voley")) return "voley";
    if (lower.includes("basket")) return "basket";
    if (lower.includes("futbol")) return "futbol";
    if (lower.includes("implemento") || lower.includes("equipo")) return "equipamiento";
    return "otros";
};


