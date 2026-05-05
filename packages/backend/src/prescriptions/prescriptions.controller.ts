import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminListPrescriptionsDto } from './dto/admin-list-prescriptions.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsDto } from './dto/list-prescriptions.dto';
import { PrescriptionsService } from './prescriptions.service';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@ApiTags('prescriptions')
@ApiBearerAuth()
@Controller()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('prescriptions')
  @Roles(Role.doctor)
  @ApiOperation({ summary: 'Crear prescripción', description: 'Solo doctor. Crea una prescripción con uno o más ítems para un paciente.' })
  @ApiResponse({ status: 201, description: 'Prescripción creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere doctor)' })
  create(@CurrentUser() user: JwtUser, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(user.sub, dto);
  }

  @Get('prescriptions')
  @Roles(Role.doctor)
  @ApiOperation({ summary: 'Listar mis prescripciones (doctor)', description: 'Retorna solo las prescripciones del doctor autenticado. Soporta filtros por estado, fecha y paginación.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de prescripciones' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere doctor)' })
  findAll(@CurrentUser() user: JwtUser, @Query() query: ListPrescriptionsDto) {
    return this.prescriptionsService.findAllForDoctor(user.sub, query);
  }

  @Get('prescriptions/:id')
  @Roles(Role.doctor, Role.patient, Role.admin)
  @ApiOperation({ summary: 'Detalle de prescripción', description: 'Accesible por doctor autor, paciente propietario o admin.' })
  @ApiResponse({ status: 200, description: 'Detalle de la prescripción con ítems' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos sobre esta prescripción' })
  @ApiResponse({ status: 404, description: 'Prescripción no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.prescriptionsService.findOne(id, user);
  }

  @Get('me/prescriptions')
  @Roles(Role.patient)
  @ApiOperation({ summary: 'Listar mis prescripciones (paciente)', description: 'Retorna solo las prescripciones del paciente autenticado.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de prescripciones' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere patient)' })
  findMyPrescriptions(@CurrentUser() user: JwtUser, @Query() query: ListPrescriptionsDto) {
    return this.prescriptionsService.findAllForPatient(user.sub, query);
  }

  @Put('prescriptions/:id/consume')
  @Roles(Role.patient)
  @ApiOperation({ summary: 'Marcar prescripción como consumida', description: 'Solo el paciente propietario puede consumir la prescripción.' })
  @ApiResponse({ status: 200, description: 'Prescripción marcada como consumida' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos o prescripción ajena' })
  @ApiResponse({ status: 404, description: 'Prescripción no encontrada' })
  @ApiResponse({ status: 409, description: 'La prescripción ya estaba consumida' })
  consume(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.prescriptionsService.consume(id, user.sub);
  }

  @Get('prescriptions/:id/pdf')
  @Roles(Role.patient, Role.admin)
  @ApiOperation({ summary: 'Descargar PDF de prescripción', description: 'Genera y descarga un PDF con los datos completos de la prescripción, incluyendo código QR.' })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 200, description: 'Archivo PDF binario (application/pdf)' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos sobre esta prescripción' })
  @ApiResponse({ status: 404, description: 'Prescripción no encontrada' })
  async getPdf(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Res() res: Response,
  ) {
    const buffer = await this.prescriptionsService.generatePdf(id, user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="prescription-${id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('admin/prescriptions')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Listar todas las prescripciones (admin)', description: 'Solo admin. Permite filtrar por estado, doctor, paciente y rango de fechas.' })
  @ApiResponse({ status: 200, description: 'Lista paginada de prescripciones' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere admin)' })
  findAllAdmin(@Query() query: AdminListPrescriptionsDto) {
    return this.prescriptionsService.findAllAdmin(query);
  }
}
