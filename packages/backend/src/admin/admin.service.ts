import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(from?: string, to?: string) {
    const prescriptionDateFilter =
      from || to
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

    const [doctors, patients, prescriptions, byStatusRows, byDayRaw, topDoctorsGroupBy] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'doctor' } }),
        this.prisma.user.count({ where: { role: 'patient' } }),
        this.prisma.prescription.count(),
        this.prisma.prescription.groupBy({
          by: ['status'],
          where: prescriptionDateFilter,
          _count: { id: true },
        }),
        this.prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
          SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date, COUNT(*) as count
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
      byStatus[row.status as 'pending' | 'consumed'] = row._count.id;
    }

    const byDay = byDayRaw.map((row) => ({
      date: row.date,
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
}
