import { Shift } from "./shift";

export interface User {
    id: string;
    name: string;
    role: string;
    shifts: Shift[];
}
