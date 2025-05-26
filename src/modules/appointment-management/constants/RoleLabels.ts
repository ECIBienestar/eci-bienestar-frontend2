import { RoleEnum } from "@modules/appointment-management/types/enums";

export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.STUDENT]: "Estudiante",
  [RoleEnum.TEACHER]: "Profesor",
  [RoleEnum.ADMINISTRATOR]: "Administrador",
  [RoleEnum.GENERAL_SERVICES_STAFF]: "Servicios Generales",
  [RoleEnum.MEDICAL_STAFF]: "Personal Médico",
  [RoleEnum.MEDICAL_SECRETARY]: "Secretaria Médica",
};
