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
        const dateFilter = {};
        if (from || to) {
            dateFilter.createdAt = {};
            if (from)
                dateFilter.createdAt.gte = new Date(from);
            if (to)
                dateFilter.createdAt.lte = new Date(to);
        }
        const [totalDoctors, totalPatients, totalPrescriptions, byStatus, byDayRaw, topDoctors] = await Promise.all([
            this.prisma.user.count({ where: { role: 'doctor' } }),
            this.prisma.user.count({ where: { role: 'patient' } }),
            this.prisma.prescription.count({ where: dateFilter }),
            this.prisma.prescription.groupBy({
                by: ['status'],
                _count: true,
                where: dateFilter,
            }),
            this.prisma.$queryRaw `
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "Prescription"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `,
            this.prisma.prescription.groupBy({
                by: ['authorId'],
                _count: true,
                where: dateFilter,
            }),
        ]);
        const byDay = Array.isArray(byDayRaw) ? byDayRaw.map((row) => ({
            date: row.date instanceof Date ? row.date.toISOString() : row.date,
            count: Number(row.count),
        })) : [];
        const byStatusMap = { pending: 0, consumed: 0 };
        byStatus.forEach((s) => {
            const key = s.status?.toLowerCase() || s.status;
            if (key === 'pending' || key === 'consumed') {
                byStatusMap[key] = Number(s._count);
            }
        });
        const topDoctorsWithNames = await Promise.all(topDoctors.map(async (t) => {
            const author = await this.prisma.doctor.findUnique({ where: { id: t.authorId }, include: { user: true } });
            return { doctorId: t.authorId, name: author?.user.name || 'Unknown', count: Number(t._count) };
        }));
        return {
            totals: {
                doctors: Number(totalDoctors),
                patients: Number(totalPatients),
                prescriptions: Number(totalPrescriptions)
            },
            byStatus: byStatusMap,
            byDay,
            topDoctors: topDoctorsWithNames,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map