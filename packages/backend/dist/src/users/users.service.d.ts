import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        doctorId: string | null;
        patientId: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        refreshTokenHash: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        doctorId: string | null;
        patientId: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        refreshTokenHash: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateRefreshTokenHash(id: string, hash: string | null): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        doctorId: string | null;
        patientId: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        refreshTokenHash: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll({ role, query, page, limit, order }: {
        role?: Role;
        query?: string;
        page?: number;
        limit?: number;
        order?: 'asc' | 'desc';
    }): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAllPatients(page?: number, limit?: number, order?: 'asc' | 'desc'): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
            };
        } & {
            id: string;
            userId: string;
            birthDate: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAllDoctors(page?: number, limit?: number, order?: 'asc' | 'desc'): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
            };
        } & {
            id: string;
            specialty: string | null;
            userId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
