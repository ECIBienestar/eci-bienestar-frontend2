import { TypeEnum } from "@modules/appointment-management/types/enums";

export interface CreateMultimediaRequest {
  name: string;
  file: File;
  duration: number;
  type: TypeEnum;
}
