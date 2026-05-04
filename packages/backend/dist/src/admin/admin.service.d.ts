import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
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
            date: any;
            count: number;
        }[];
        topDoctors: {
            doctorId: any;
            name: string;
            count: number;
        }[];
    }>;
}
