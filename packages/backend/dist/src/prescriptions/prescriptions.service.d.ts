import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/prescription.dto';
export declare class PrescriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPrescription(doctorId: string, data: CreatePrescriptionDto): Promise<{
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
    findForDoctor(doctorId: string, filters: {
        status?: string;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
    findForPatient(userId: string, filters: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
    findById(id: string, userId: string, role: string): Promise<{
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
    consume(id: string, userId: string): Promise<{
        id: string;
        patientId: string;
        createdAt: Date;
        code: string;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        notes: string | null;
        consumedAt: Date | null;
        authorId: string;
    }>;
    getPdfData(id: string, userId: string, role: string): Promise<{
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
}
