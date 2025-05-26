import { Speciality } from "@/common/types";
import { SpecialityEnum } from "../types/enums";

/**
 * Check if a value is a valid SpecialityEnum.
 */
const isValidSpecialityEnum = (value: unknown): value is SpecialityEnum => {
  return Object.values(SpecialityEnum).includes(value as SpecialityEnum);
};

/**
 * Convert a Speciality to SpecialityEnum if it's valid, else return undefined.
 */
export const toSpecialityEnum = (
  value: Speciality | null | undefined
): SpecialityEnum | undefined => {
  return isValidSpecialityEnum(value) ? (value as SpecialityEnum) : undefined;
};
