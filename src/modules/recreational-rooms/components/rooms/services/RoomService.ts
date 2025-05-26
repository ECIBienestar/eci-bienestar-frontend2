import { axiosInstance } from "@modules/recreational-rooms/conf";
import type { HallEntity } from "../types/RoomTypes";


export const hallsApi = {
    getAllHalls: async () => {
        try {
            const response = await axiosInstance.get("api/halls/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching halls:", error);
            throw error;
        }
    },

    getHallById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`api/halls/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching hall with ID ${id}:`, error);
            throw error;
        }
    },

    addHall: async (hall: HallEntity) => {
        try {
            const response = await axiosInstance.post("api/halls", hall);
            return response.data;
        } catch (error) {
            console.error("Error creating hall:", error);
            throw error;
        }
    },

    deleteHall: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`api/halls/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting hall with ID ${id}:`, error);
            throw error;
        }
    },

    updateHallStatus: async (id: number, status: string) => {
        try {
            const response = await axiosInstance.put(`api/halls/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating hall status with ID ${id}:`, error);
            throw error;
        }
    },
};