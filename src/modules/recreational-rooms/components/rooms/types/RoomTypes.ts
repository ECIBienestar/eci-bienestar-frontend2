/**
 * Represents a recreational room or hall in the system
 */
export interface Room {
    id: string;
    name: string;
    location: string;
    capacity: number;
    description: string;
    isAvailable: boolean;
    openingHours: string;
    closingHours: string;
    features: string[];
}

/**
 * Represents a hall in the system
 */
export interface HallEntity {
    id?: number;
    name: string;
    location: string;
    status: string;
    description: string;
    capacity: number;
}


export interface BookingRequestDTO {
    date: string;
    startTime: {
        hour: number;
        minute: number;
        second: number;
        nano: number;
    };
    endTime: {
        hour: number;
        minute: number;
        second: number;
        nano: number;
    };
    hallId: number;
    itemsLoans: {
        idItem: number;
        quantity: number;
    }[];
}