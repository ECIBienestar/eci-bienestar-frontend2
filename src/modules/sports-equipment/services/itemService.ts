import axios from "axios";

const BASE_URL = "https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0";


export const getItemsByCategory = async (equipmentType: string) => {
    const response = await fetch(`${BASE_URL}/equipment/availablesType`, {
        headers: {
            "accept": "*/*",
            "equipment-type": equipmentType,
        },
    });

    if (!response.ok) {
        throw new Error("No se pudieron obtener los artículos.");
    }

    const data = await response.json();

    return data.map((item: any) => ({
        id: item.id,
        nombre: item.name,
        descripcion: item.description,
        estado: item.status as "bueno" | "regular" | "malo",
        disponible: item.available,
        categoria: item.type,
    }));
};

export const createLoan = async (loanData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/loans`, loanData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error al realizar la reserva");
    }
};