import { RoleEnum } from "@modules/appointment-management/types/enums";

export interface CreateUserRequest {
  id: string;
  name: string;
  role: RoleEnum;
}
