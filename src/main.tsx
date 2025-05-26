import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import "@modules/appointment-management/utils/icon.ts";
import { AuthProvider } from "@common/context";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
