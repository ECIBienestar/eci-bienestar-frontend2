import { Role, Speciality } from "@common/types";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: string;
  fullName: string;
  email: string;
  role: Role;
  specialty: Speciality | null;
}
