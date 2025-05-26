import { TypeEnum } from "@modules/appointment-management/types/enums";

export interface MultimediaResponse {
  id: number;
  type: TypeEnum;
  name: string;
  url: string;
  duration: number;
}
