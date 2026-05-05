import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Métricas del sistema', description: 'Solo admin. Retorna totales, prescripciones por estado, por día y top doctores. Soporta filtrado por rango de fechas.' })
  @ApiResponse({ status: 200, description: 'Objeto con totals, byStatus, byDay y topDoctors' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere admin)' })
  getMetrics(@Query() query: MetricsQueryDto) {
    return this.adminService.getMetrics(query.from, query.to);
  }
}
