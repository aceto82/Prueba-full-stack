declare class PrescriptionItemDto {
    name: string;
    dosage?: string;
    quantity?: number;
    instructions?: string;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    notes?: string;
    items: PrescriptionItemDto[];
}
export {};
