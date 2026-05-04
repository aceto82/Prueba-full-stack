import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AdminService } from './admin.service';

const mockPrisma = {
  user: {
    count: jest.fn(),
  },
  prescription: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  doctor: {
    findMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();

    mockPrisma.user.count.mockResolvedValue(5);
    mockPrisma.prescription.count.mockResolvedValue(10);
    mockPrisma.prescription.groupBy.mockResolvedValue([
      { status: 'pending', _count: { id: 3 } },
      { status: 'consumed', _count: { id: 7 } },
    ]);
    mockPrisma.$queryRaw.mockResolvedValue([
      { date: new Date('2025-01-01'), count: BigInt(2) },
    ]);
    mockPrisma.doctor.findMany.mockResolvedValue([
      { id: 'doctor-1', user: { name: 'Dr. Test' } },
    ]);
  });

  describe('getMetrics()', () => {
    it('returns all four top-level keys', async () => {
      const result = await service.getMetrics();

      expect(result).toHaveProperty('totals');
      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('byDay');
      expect(result).toHaveProperty('topDoctors');
    });

    it('totals contains doctors, patients, and prescriptions counts', async () => {
      const result = await service.getMetrics();
      expect(result.totals).toEqual({ doctors: 5, patients: 5, prescriptions: 10 });
    });

    it('byStatus maps status to counts', async () => {
      const result = await service.getMetrics();
      expect(result.byStatus).toEqual({ pending: 3, consumed: 7 });
    });

    it('returns empty arrays when no data', async () => {
      mockPrisma.prescription.groupBy.mockResolvedValue([]);
      mockPrisma.$queryRaw.mockResolvedValue([]);
      mockPrisma.doctor.findMany.mockResolvedValue([]);

      const result = await service.getMetrics();
      expect(result.byDay).toEqual([]);
      expect(result.topDoctors).toEqual([]);
      expect(result.byStatus).toEqual({ pending: 0, consumed: 0 });
    });

    it('converts byDay count from BigInt to number', async () => {
      const result = await service.getMetrics();
      expect(typeof result.byDay[0].count).toBe('number');
    });
  });
});
