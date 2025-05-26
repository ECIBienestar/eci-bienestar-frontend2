export interface Shift {
    id: string;
    code: string;
    specialty: "Medicina general" | "Psicologia" | "Odontologia";
    priority: number;
    date: string;
    status: string;
    levelAtention: string;
    UserId: string;
}