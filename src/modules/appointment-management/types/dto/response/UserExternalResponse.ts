import { RoleEnum } from "../../enums";

export interface UserExternalResponse {
  id: string;
  idType: string;
  fullName: string;
  phone: string;
  email: string;
  role: RoleEnum;
  active: boolean;
}
