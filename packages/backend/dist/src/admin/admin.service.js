"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics(from, to) {
        const prescriptionDateFilter = from || to
            ? {
                createdAt: {
                    ...(from ? { gte: new Date(from) } : {}),
                    ...(to ? { lte: new Date(to) } : {}),
                },
            }
            : undefined;
        const byDayFrom = from
            ? new Date(from)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const byDayTo = to ? new Date(to) : new Date();
        const [doctors, patients, prescriptions, byStatusRows, byDayRaw, topDoctorsGroupBy] = await Promise.all([
            this.prisma.user.count({ where: { role: 'doctor' } }),
            this.prisma.user.count({ where: { role: 'patient' } }),
            this.prisma.prescription.count(),
            this.prisma.prescription.groupBy({
                by: ['status'],
                where: prescriptionDateFilter,
                _count: { id: true },
            }),
            this.prisma.$queryRaw `
          SELECT DATE("createdAt") as date, COUNT(*) as count
          FROM "Prescription"
          WHERE "createdAt" >= ${byDayFrom} AND "createdAt" <= ${byDayTo}
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `,
            this.prisma.prescription.groupBy({
                by: ['authorId'],
                where: prescriptionDateFilter,
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10,
            }),
        ]);
        const byStatus = { pending: 0, consumed: 0 };
        for (const row of byStatusRows) {
            byStatus[row.status] = row._count.id;
        }
        const byDay = byDayRaw.map((row) => ({
            date: String(row.date).substring(0, 10),
            count: Number(row.count),
        }));
        const doctorIds = topDoctorsGroupBy.map((r) => r.authorId);
        const doctorRecords = await this.prisma.doctor.findMany({
            where: { id: { in: doctorIds } },
            include: { user: { select: { name: true } } },
        });
        const doctorMap = new Map(doctorRecords.map((d) => [d.id, d.user.name]));
        const topDoctors = topDoctorsGroupBy.map((r) => ({
            doctorId: r.authorId,
            name: doctorMap.get(r.authorId) ?? 'Unknown',
            count: r._count.id,
        }));
        return {
            totals: { doctors, patients, prescriptions },
            byStatus,
            byDay,
            topDoctors,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map