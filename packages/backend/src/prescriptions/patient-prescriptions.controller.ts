import { Controller, Get, Put, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PdfService } from './pdf.service';

@Controller('me/prescriptions')
@UseGuards(JwtAuthGuard)
export class PatientPrescriptionsController {
  constructor(
    private prescriptionsService: PrescriptionsService,
    private pdfService: PdfService,
  ) {}

  @Get()
  async findMyPrescriptions(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptionsService.findForPatient(user.userId, {
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Put(':id/consume')
  async consume(@Param('id') id: string, @CurrentUser() user: any) {
    return this.prescriptionsService.consume(id, user.userId);
  }

  @Get(':id/pdf')
  async getPdf(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const prescription = await this.prescriptionsService.getPdfData(id, user.userId, user.role);
    const pdfBuffer = await this.pdfService.generate(prescription);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription.code}.pdf`);
    res.send(pdfBuffer);
  }
}