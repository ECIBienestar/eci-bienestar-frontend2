import { Speciality, Role } from "@common/types";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  speciality: Speciality | null;
}
