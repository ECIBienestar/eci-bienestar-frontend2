import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://suoeltmtp2.execute-api.us-east-1.amazonaws.com";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
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

export default apiClient;
