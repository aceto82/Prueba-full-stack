import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findDoctors(page?: number, limit?: number, specialty?: string): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            specialty: string | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findPatients(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            birthDate: Date | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByRole(role: 'doctor' | 'patient', page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            specialty: string | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    } | {
        data: {
            id: string;
            email: string;
            name: string;
            birthDate: Date | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
