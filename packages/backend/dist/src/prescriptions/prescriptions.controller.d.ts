import type { Response } from 'express';
import { AdminListPrescriptionsDto } from './dto/admin-list-prescriptions.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsDto } from './dto/list-prescriptions.dto';
import { PrescriptionsService } from './prescriptions.service';
interface JwtUser {
    sub: string;
    email: string;
    role: string;
}
export declare class PrescriptionsController {
    private readonly prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(user: JwtUser, dto: CreatePrescriptionDto): Promise<{
        patient: {
            user: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            userId: string;
            birthDate: Date | null;
        };
        author: {
            user: {
                email: string;
                name: string;
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
    findAll(user: JwtUser, query: ListPrescriptionsDto): Promise<{
        data: ({
            patient: {
                user: {
                    email: string;
                    name: string;
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
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, user: JwtUser): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                name: string;
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
                name: string;
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
    findMyPrescriptions(user: JwtUser, query: ListPrescriptionsDto): Promise<{
        data: ({
            author: {
                user: {
                    name: string;
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
        total: number;
        page: number;
        limit: number;
    }>;
    consume(id: string, user: JwtUser): Promise<{
        id: string;
        patientId: string;
        createdAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        notes: string | null;
        consumedAt: Date | null;
        authorId: string;
    }>;
    getPdf(id: string, user: JwtUser, res: Response): Promise<void>;
    findAllAdmin(query: AdminListPrescriptionsDto): Promise<{
        data: ({
            patient: {
                user: {
                    email: string;
                    name: string;
                };
            } & {
                id: string;
                userId: string;
                birthDate: Date | null;
            };
            author: {
                user: {
                    email: string;
                    name: string;
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
        total: number;
        page: number;
        limit: number;
    }>;
}
export {};
