import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMetrics(from?: string, to?: string): Promise<{
        totals: {
            doctors: number;
            patients: number;
            prescriptions: number;
        };
        byStatus: {
            pending: number;
            consumed: number;
        };
        byDay: {
            date: string;
            count: number;
        }[];
        topDoctors: {
            doctorId: string;
            name: string;
            count: number;
        }[];
    }>;
}
