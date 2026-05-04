import { AdminService } from './admin.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getMetrics(query: MetricsQueryDto): Promise<{
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
