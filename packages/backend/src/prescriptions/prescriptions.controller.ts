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

@Controller()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('prescriptions')
  @Roles(Role.doctor)
  create(@CurrentUser() user: JwtUser, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(user.sub, dto);
  }

  @Get('prescriptions')
  @Roles(Role.doctor)
  findAll(@CurrentUser() user: JwtUser, @Query() query: ListPrescriptionsDto) {
    return this.prescriptionsService.findAllForDoctor(user.sub, query);
  }

  @Get('prescriptions/:id')
  @Roles(Role.doctor, Role.patient, Role.admin)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.prescriptionsService.findOne(id, user);
  }

  @Get('me/prescriptions')
  @Roles(Role.patient)
  findMyPrescriptions(@CurrentUser() user: JwtUser, @Query() query: ListPrescriptionsDto) {
    return this.prescriptionsService.findAllForPatient(user.sub, query);
  }

  @Put('prescriptions/:id/consume')
  @Roles(Role.patient)
  consume(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.prescriptionsService.consume(id, user.sub);
  }

  @Get('prescriptions/:id/pdf')
  @Roles(Role.patient, Role.admin)
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
  findAllAdmin(@Query() query: AdminListPrescriptionsDto) {
    return this.prescriptionsService.findAllAdmin(query);
  }
}
