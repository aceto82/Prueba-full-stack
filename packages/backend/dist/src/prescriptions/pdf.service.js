"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const qrcode_1 = __importDefault(require("qrcode"));
let PdfService = class PdfService {
    async generate(prescription) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
            const chunks = [];
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
                if (item.dosage)
                    doc.text(`   Dosis: ${item.dosage}`);
                if (item.quantity)
                    doc.text(`   Cantidad: ${item.quantity}`);
                if (item.instructions)
                    doc.text(`   Instrucciones: ${item.instructions}`);
                doc.moveDown(0.5);
            });
            if (prescription.notes) {
                doc.moveDown();
                doc.fontSize(12).text('OBSERVACIONES', { underline: true });
                doc.fontSize(10).text(prescription.notes);
            }
            doc.moveDown(2);
            qrcode_1.default.toDataURL(`http://localhost:3000/patient/prescriptions/${prescription.id}`)
                .then((qrDataUrl) => {
                const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '');
                const qrBuffer = Buffer.from(qrBase64, 'base64');
                doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });
            })
                .finally(() => doc.end());
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map