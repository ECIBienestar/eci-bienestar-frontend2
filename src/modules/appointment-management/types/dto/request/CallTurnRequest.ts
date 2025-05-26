import { SpecialityEnum } from "../../enums";

export interface CallTurnRequest {
  turnId?: number;
  speciality: SpecialityEnum;
  levelAttention: number;
}
