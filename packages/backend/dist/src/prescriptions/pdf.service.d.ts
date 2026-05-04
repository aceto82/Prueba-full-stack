interface PrescriptionWithRelations {
    id: string;
    code: string;
    notes: string | null;
    status: string;
    createdAt: Date;
    consumedAt: Date | null;
    patient: {
        user: {
            name: string;
            email: string;
        };
        birthDate: Date | null;
    };
    author: {
        user: {
            name: string;
        };
        specialty: string | null;
    };
    items: {
        name: string;
        dosage: string | null;
        quantity: number | null;
        instructions: string | null;
    }[];
}
export declare class PdfService {
    generate(prescription: PrescriptionWithRelations): Promise<Buffer<ArrayBufferLike>>;
}
export {};
