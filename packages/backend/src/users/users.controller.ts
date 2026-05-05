import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Listar usuarios', description: 'Solo admin. Soporta filtros por rol y búsqueda por nombre/email.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuarios' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere admin)' })
  findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('patients')
  @Roles(Role.admin, Role.doctor)
  @ApiOperation({ summary: 'Listar pacientes', description: 'Admin y doctor pueden listar pacientes.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de pacientes' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  findPatients(@Query() query: PaginationDto) {
    return this.usersService.findAllPatients(query.page, query.limit, query.order);
  }

  @Get('doctors')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Listar médicos', description: 'Solo admin.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de médicos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere admin)' })
  findDoctors(@Query() query: PaginationDto) {
    return this.usersService.findAllDoctors(query.page, query.limit, query.order);
  }
}
