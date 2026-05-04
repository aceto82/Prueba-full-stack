import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(from?: string, to?: string) {
    const dateFilter: any = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.gte = new Date(from);
      if (to) dateFilter.createdAt.lte = new Date(to);
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
      this.prisma.$queryRaw`
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

    const byDay = Array.isArray(byDayRaw) ? byDayRaw.map((row: any) => ({
      date: row.date instanceof Date ? row.date.toISOString() : row.date,
      count: Number(row.count),
    })) : [];

    const byStatusMap = { pending: 0, consumed: 0 };
    byStatus.forEach((s: any) => {
      const key = s.status?.toLowerCase() || s.status;
      if (key === 'pending' || key === 'consumed') {
        byStatusMap[key as keyof typeof byStatusMap] = Number(s._count);
      }
    });

    const topDoctorsWithNames = await Promise.all(
      topDoctors.map(async (t: any) => {
        const author = await this.prisma.doctor.findUnique({ where: { id: t.authorId }, include: { user: true } });
        return { doctorId: t.authorId, name: author?.user.name || 'Unknown', count: Number(t._count) };
      }),
    );

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
}