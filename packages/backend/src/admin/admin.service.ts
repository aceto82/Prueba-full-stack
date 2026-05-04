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

    const [totalDoctors, totalPatients, totalPrescriptions, byStatus, byDay, topDoctors] = await Promise.all([
      this.prisma.user.count({ where: { role: 'doctor' } }),
      this.prisma.user.count({ where: { role: 'patient' } }),
      this.prisma.prescription.count({ where: dateFilter }),
      this.prisma.prescription.groupBy({
        by: ['status'],
        _count: true,
        where: dateFilter,
      }),
      this.prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Prescription"
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `,
      this.prisma.prescription.groupBy({
        by: ['authorId'],
        _count: true,
        where: dateFilter,
      }),
    ]);

    const byStatusMap = { pending: 0, consumed: 0 };
    byStatus.forEach((s: any) => {
      const key = s.status?.toLowerCase() || s.status;
      if (key === 'pending' || key === 'consumed') {
        byStatusMap[key as keyof typeof byStatusMap] = s._count;
      }
    });

    const topDoctorsWithNames = await Promise.all(
      topDoctors.map(async (t: any) => {
        const author = await this.prisma.doctor.findUnique({ where: { id: t.authorId }, include: { user: true } });
        return { doctorId: t.authorId, doctorName: author?.user.name || 'Unknown', count: t._count };
      }),
    );

    return {
      totals: { doctors: totalDoctors, patients: totalPatients, prescriptions: totalPrescriptions },
      byStatus: byStatusMap,
      byDay: byDay,
      topDoctors: topDoctorsWithNames,
    };
  }
}