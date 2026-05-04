import type { Response } from 'express';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/prescription.dto';
import { PdfService } from './pdf.service';
export declare class PrescriptionsController {
    private prescriptionsService;
    private pdfService;
    constructor(prescriptionsService: PrescriptionsService, pdfService: PdfService);
    create(dto: CreatePrescriptionDto, user: any): Promise<{
        patient: {
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
            userId: string;
            birthDate: Date | null;
        };
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
    }>;
    findAll(user: any, mine: string, status?: string, from?: string, to?: string, page?: string, limit?: string): Promise<{
        data: ({
            patient: {
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
                userId: string;
                birthDate: Date | null;
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
    findOne(id: string, user: any): Promise<{
        patient: {
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
            userId: string;
            birthDate: Date | null;
        };
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
    getPdf(id: string, user: any, req: any, res: Response): Promise<void>;
}
