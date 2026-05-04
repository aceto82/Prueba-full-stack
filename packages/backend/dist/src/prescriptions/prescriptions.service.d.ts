import { PrismaService } from '../prisma/prisma.service';
import { AdminListPrescriptionsDto } from './dto/admin-list-prescriptions.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsDto } from './dto/list-prescriptions.dto';
interface RequestingUser {
    sub: string;
    role: string;
}
export declare class PrescriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(doctorUserId: string, dto: CreatePrescriptionDto): Promise<{
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
    findAllForDoctor(doctorUserId: string, filters: ListPrescriptionsDto): Promise<{
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
    findOne(id: string, requestingUser: RequestingUser): Promise<{
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
    findAllForPatient(patientUserId: string, filters: ListPrescriptionsDto): Promise<{
        data: ({
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
    consume(id: string, patientUserId: string): Promise<{
        id: string;
        patientId: string;
        createdAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        notes: string | null;
        consumedAt: Date | null;
        authorId: string;
    }>;
    generatePdf(id: string, requestingUser: RequestingUser): Promise<Buffer>;
    findAllAdmin(filters: AdminListPrescriptionsDto): Promise<{
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
    private buildWhere;
}
export {};
