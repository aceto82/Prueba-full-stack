import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles(Role.admin)
  getMetrics(@Query() query: MetricsQueryDto) {
    return this.adminService.getMetrics(query.from, query.to);
  }
}
