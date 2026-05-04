import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateRefreshTokenHash(id: string, hash: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshTokenHash: hash },
    });
  }

  async findAll({ role, query, page = 1, limit = 10, order = 'desc' }: {
    role?: Role;
    query?: string;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
  }) {
    const where: { role?: Role; OR?: { name?: object; email?: object }[] } = {};
    if (role) where.role = role;
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } as object },
        { email: { contains: query, mode: 'insensitive' } as object },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findAllPatients(page = 1, limit = 10, order: 'asc' | 'desc' = 'desc') {
    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { user: { createdAt: order } },
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
      }),
      this.prisma.patient.count(),
    ]);
    return { data, total, page, limit };
  }

  async findAllDoctors(page = 1, limit = 10, order: 'asc' | 'desc' = 'desc') {
    const [data, total] = await Promise.all([
      this.prisma.doctor.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { user: { createdAt: order } },
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
      }),
      this.prisma.doctor.count(),
    ]);
    return { data, total, page, limit };
  }
}
