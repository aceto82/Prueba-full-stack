import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
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
