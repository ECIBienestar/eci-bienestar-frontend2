import { SpecialityEnum } from "@modules/appointment-management/types/enums";

export const SpecialityLabels: Record<SpecialityEnum, string> = {
  [SpecialityEnum.DENTISTRY]: "Odontologia",
  [SpecialityEnum.GENERAL_MEDICINE]: "Medicina general",
  [SpecialityEnum.PSYCHOLOGY]: "Psicologia",
};
