import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const MEDIA_API_BASE_URL =
  import.meta.env.VITE_MEDIA_API_BASE_URL ??
  "https://diamante-medicalturns-develop-dvb8c2cqfbh4gwbg.canadacentral-01.azurewebsites.net/api";

const healthApiClient: AxiosInstance = axios.create({
  baseURL: MEDIA_API_BASE_URL,
});

healthApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

healthApiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error(
      "Response Error Interceptor:",
      JSON.stringify(error.response?.data ?? error.message, null, 2)
    );

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized, logging out or refreshing token...");
          break;
        case 403:
          console.error("Forbidden access.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 500:
          console.error("Server error.");
          break;
        default:
          console.error(`Unhandled error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default healthApiClient;
