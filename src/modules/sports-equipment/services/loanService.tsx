import axios from "axios";

const BASE_URL = "https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0";

export const getActiveLoansByUser = async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/loans/active-by-user`, {
        headers: {
            "user-id": userId,
        },
    });
    return response.data;
};


export const getReturnedLoansByUser = async (userId: string) => {
    const response = await fetch(
        "https://sport-loan-service-hvaxcffmfkh6asdn.canadacentral-01.azurewebsites.net/api/v1.0/loans/returned-by-user",
        {
            headers: {
                "accept": "*/*",
                "user-id": userId,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Error al obtener artículos vencidos");
    }

    return response.json();
};
