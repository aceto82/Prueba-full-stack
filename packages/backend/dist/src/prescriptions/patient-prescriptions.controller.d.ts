import type { Response } from 'express';
import { PrescriptionsService } from './prescriptions.service';
import { PdfService } from './pdf.service';
export declare class PatientPrescriptionsController {
    private prescriptionsService;
    private pdfService;
    constructor(prescriptionsService: PrescriptionsService, pdfService: PdfService);
    findMyPrescriptions(user: any, status?: string, page?: string, limit?: string): Promise<{
        data: ({
            author: {
                user: {
                    id: string;
                    email: string;
                    doctorId: string | null;
                    patientId: string | null;
                    password: string;
                    name: string;
                    role: import("@prisma/client").$Enums.Role;
                    createdAt: Date;
                };
            } & {
                id: string;
                specialty: string | null;
                userId: string;
            };
            items: {
                id: string;
                name: string;
                dosage: string | null;
                quantity: number | null;
                instructions: string | null;
                prescriptionId: string;
            }[];
        } & {
            id: string;
            patientId: string;
            createdAt: Date;
            code: string;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            notes: string | null;
            consumedAt: Date | null;
            authorId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    consume(id: string, user: any): Promise<{
        id: string;
        patientId: string;
        createdAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        notes: string | null;
        consumedAt: Date | null;
        authorId: string;
    }>;
    getPdf(id: string, user: any, res: Response): Promise<void>;
}
