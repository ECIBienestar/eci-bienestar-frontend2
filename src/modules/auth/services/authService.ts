import { AuthResponse } from "../../core/types/Auth";

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const fakeUser = {
    email: "admin@eci.com",
    password: "admin",
    token: "fake-jwt-token",
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === fakeUser.email && password === fakeUser.password) {
        resolve({ token: fakeUser.token });
      } else {
        reject(new Error("Credenciales inválidas"));
      }
    }, 1000);
  });
};
