import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

interface PrescriptionWithRelations {
  id: string;
  code: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  consumedAt: Date | null;
  patient: { user: { name: string; email: string }; birthDate: Date | null };
  author: { user: { name: string }; specialty: string | null };
  items: { name: string; dosage: string | null; quantity: number | null; instructions: string | null }[];
}

@Injectable()
export class PdfService {
  async generate(prescription: PrescriptionWithRelations) {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('PRESCRIPCIÓN MÉDICA', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Código: ${prescription.code}`, { align: 'right' });
      doc.text(`Fecha: ${prescription.createdAt.toLocaleDateString('es-ES')}`, { align: 'right' });
      doc.text(`Estado: ${prescription.status === 'consumed' ? 'CONSUMIDA' : 'PENDIENTE'}`, { align: 'right' });
      doc.moveDown();

      doc.fontSize(12).text('DATOS DEL PACIENTE', { underline: true });
      doc.fontSize(10).text(`Nombre: ${prescription.patient.user.name}`);
      doc.text(`Email: ${prescription.patient.user.email}`);
      if (prescription.patient.birthDate) {
        doc.text(`Fecha de nacimiento: ${prescription.patient.birthDate.toLocaleDateString('es-ES')}`);
      }
      doc.moveDown();

      doc.fontSize(12).text('DATOS DEL MÉDICO', { underline: true });
      doc.fontSize(10).text(`Nombre: ${prescription.author.user.name}`);
      if (prescription.author.specialty) {
        doc.text(`Especialidad: ${prescription.author.specialty}`);
      }
      doc.moveDown();

      doc.fontSize(12).text('MEDICAMENTOS', { underline: true });
      doc.moveDown(0.5);

      prescription.items.forEach((item, index) => {
        doc.fontSize(10).text(`${index + 1}. ${item.name}`);
        if (item.dosage) doc.text(`   Dosis: ${item.dosage}`);
        if (item.quantity) doc.text(`   Cantidad: ${item.quantity}`);
        if (item.instructions) doc.text(`   Instrucciones: ${item.instructions}`);
        doc.moveDown(0.5);
      });

      if (prescription.notes) {
        doc.moveDown();
        doc.fontSize(12).text('OBSERVACIONES', { underline: true });
        doc.fontSize(10).text(prescription.notes);
      }

      doc.moveDown(2);
      QRCode.toDataURL(`http://localhost:3000/patient/prescriptions/${prescription.id}`)
        .then((qrDataUrl: string) => {
          const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '');
          const qrBuffer = Buffer.from(qrBase64, 'base64');
          doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });
        })
        .finally(() => doc.end());
    });
  }
}