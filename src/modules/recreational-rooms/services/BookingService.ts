import axios from "axios";

const API_BASE_URL = "https://ecibienestar-booking-hnbeerf3caafcacs.canadacentral-01.azurewebsites.net";

const AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface BookingRequestDTO {
    date: string;
    startTime: {
        hour: number;
        minute: number;
        second: number;
        nano: number;
    };
    endTime: {
        hour: number;
        minute: number;
        second: number;
        nano: number;
    };
    hallId: number;
    itemsLoans: {
        idItem: number;
        quantity: number;
    }[];
}

export interface BookingResponse {
    id: number;
    nameUser: string;
    idUser: string;
    date: string;
    timeStartBooking: string;
    timeEndBooking: string;
    hallId: {
        id: number;
        name: string;
        location: string;
        status: string;
        description: string;
        capacity: number;
    };
    status: string;
    itemsLoans: {
        id: number;
        itemId: {
            id: number;
            name: string;
            description: string;
            status: string;
            category: string;
            quantity: number;
            quantityAvailable: number;
            available: boolean;
            hall: {
                id: number;
                name: string;
                location: string;
                status: string;
                description: string;
                capacity: number;
            };
        };
        quantity: number;
        loanDate: string;
        returnDate: string;
        returnStatus: string;
    }[];
}

export const bookingApi = {
    getAllBookings: async (): Promise<BookingResponse[]> => {
        try {
            const response = await AxiosInstance.get(`/api/bookings`);
            
            console.log("Hola");

            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw error;
        }
    },

    getBookingById: async (id: number): Promise<BookingResponse> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching booking with ID ${id}:`, error);
            throw error;
        }
    },

    createBooking: async (booking: BookingRequestDTO): Promise<BookingResponse> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/bookings`, booking);
            return response.data;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    },

    returnBooking: async (id: number): Promise<void> => {
        try {
            await axios.post(`${API_BASE_URL}/api/bookings/${id}/return`);
        } catch (error) {
            console.error(`Error returning booking with ID ${id}:`, error);
            throw error;
        }
    },

    cancelBooking: async (id: number): Promise<void> => {
        try {
            await axios.post(`${API_BASE_URL}/api/bookings/${id}/cancel`);
        } catch (error) {
            console.error(`Error canceling booking with ID ${id}:`, error);
            throw error;
        }
    },

    getBookingsByUserId: async (userId: string): Promise<BookingResponse[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/bookings/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching bookings for user ${userId}:`, error);
            throw error;
        }
    },

    getLoansByBookingId: async (bookingId: number): Promise<any> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}/loans`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching loans for booking ${bookingId}:`, error);
            throw error;
        }
    }
}; 