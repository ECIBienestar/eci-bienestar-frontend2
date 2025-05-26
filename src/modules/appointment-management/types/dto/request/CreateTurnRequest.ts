import {
  PriorityEnum,
  SpecialityEnum,
} from "@modules/appointment-management/types/enums";
import { CreateUserRequest } from "./CreateUserRequest";

export interface CreateTurnRequest {
  user: CreateUserRequest;
  speciality: SpecialityEnum;
  priority?: PriorityEnum;
}
