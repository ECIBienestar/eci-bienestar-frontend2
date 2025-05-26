import { RoleEnum } from "@modules/appointment-management/types/enums/RoleEnum";

export interface UserResponse {
  name: string;
  id: string;
  role: RoleEnum;
}
