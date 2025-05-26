import axios from "axios";
import { API_BASE_URL_RECREATIONAL_ROOMS } from "./api";


/**
 * Axios instance configuration for recreational rooms API
 * 
 * Creates an axios instance with:
 * - Base URL pointing to recreational rooms API endpoint
 * - 10 second timeout
 * - JSON content type header
 * - Credentials included in requests
 * 
 * Used for making HTTP requests to the recreational rooms backend services
 */
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL_RECREATIONAL_ROOMS,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});