import { SpecialityEnum } from "@modules/appointment-management/types/enums/SpecialityEnum";
import { UserResponse } from "@modules/appointment-management/types/dto/response/UserResponse";

export interface TurnResponse {
  id: number;
  code: string;
  user: UserResponse;
  speciality: SpecialityEnum;
  priority: boolean;
}
