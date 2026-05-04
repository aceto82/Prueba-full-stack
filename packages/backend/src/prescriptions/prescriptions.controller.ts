import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PdfService } from './pdf.service';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(
    private prescriptionsService: PrescriptionsService,
    private pdfService: PdfService,
  ) {}

  @Post()
  async create(@Body() dto: CreatePrescriptionDto, @CurrentUser() user: any) {
    return this.prescriptionsService.createPrescription(user.userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('mine') mine: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptionsService.findForDoctor(user.userId, {
      status,
      from,
      to,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.prescriptionsService.findById(id, user.userId, user.role);
  }

  @Put(':id/consume')
  async consume(@Param('id') id: string, @CurrentUser() user: any) {
    return this.prescriptionsService.consume(id, user.userId);
  }

  @Get(':id/pdf')
  async getPdf(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const prescription = await this.prescriptionsService.getPdfData(id, user.userId, user.role);
    const pdfBuffer = await this.pdfService.generate(prescription);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription.code}.pdf`);
    res.send(pdfBuffer);
  }
}