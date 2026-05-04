"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
console.log('DB URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
async function main() {
    console.log('🌱 Starting seed...');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    const password = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password,
            name: 'Admin User',
            role: client_1.Role.admin,
        },
    });
    console.log('✅ Created admin:', admin.email);
    const doctor = await prisma.user.upsert({
        where: { email: 'dr@test.com' },
        update: {},
        create: {
            email: 'dr@test.com',
            password,
            name: 'Dr. Juan Pérez',
            role: client_1.Role.doctor,
            doctor: {
                create: {
                    specialty: 'Medicina General',
                },
            },
        },
    });
    console.log('✅ Created doctor:', doctor.email);
    const doctorRecord = await prisma.doctor.findUnique({
        where: { userId: doctor.id },
    });
    const patient = await prisma.user.upsert({
        where: { email: 'patient@test.com' },
        update: {},
        create: {
            email: 'patient@test.com',
            password,
            name: 'Carlos López',
            role: client_1.Role.patient,
            patient: {
                create: {
                    birthDate: new Date('1990-05-15'),
                },
            },
        },
    });
    console.log('✅ Created patient:', patient.email);
    const patientRecord = await prisma.patient.findUnique({
        where: { userId: patient.id },
    });
    if (doctorRecord && patientRecord) {
        const prescriptions = [
            {
                code: 'RX-001',
                status: client_1.PrescriptionStatus.pending,
                notes: 'Seguimiento semanal',
                patientId: patientRecord.id,
                authorId: doctorRecord.id,
                items: {
                    create: [
                        { name: 'Amoxicilina 500mg', dosage: '1 caps cada 8h', quantity: 21, instructions: 'Tomar con alimentos' },
                        { name: 'Paracetamol 500mg', dosage: '1 tab cada 6h', quantity: 20, instructions: 'Para el dolor' },
                    ],
                },
            },
            {
                code: 'RX-002',
                status: client_1.PrescriptionStatus.consumed,
                notes: 'Tratamiento completado',
                patientId: patientRecord.id,
                authorId: doctorRecord.id,
                consumedAt: new Date('2025-04-20'),
                items: {
                    create: [
                        { name: 'Ibuprofeno 400mg', dosage: '1 tab cada 12h', quantity: 14, instructions: 'En ayunas' },
                    ],
                },
            },
            {
                code: 'RX-003',
                status: client_1.PrescriptionStatus.pending,
                notes: 'Nueva receta',
                patientId: patientRecord.id,
                authorId: doctorRecord.id,
                items: {
                    create: [
                        { name: 'Vitamina C 1000mg', dosage: '1 tab diaria', quantity: 30, instructions: 'En la mañana' },
                        { name: 'Omeprazol 20mg', dosage: '1 cap antes del desayuno', quantity: 14, instructions: 'En ayunas' },
                    ],
                },
            },
            {
                code: 'RX-004',
                status: client_1.PrescriptionStatus.consumed,
                notes: 'Tratamiento anterior',
                patientId: patientRecord.id,
                authorId: doctorRecord.id,
                consumedAt: new Date('2025-04-10'),
                items: {
                    create: [
                        { name: 'Dipirona 500mg', dosage: '20-40 gotas cada 6h', quantity: 1, instructions: 'Para fiebre' },
                    ],
                },
            },
            {
                code: 'RX-005',
                status: client_1.PrescriptionStatus.pending,
                notes: 'Revisión de laboratorios',
                patientId: patientRecord.id,
                authorId: doctorRecord.id,
                items: {
                    create: [
                        { name: 'Loratadina 10mg', dosage: '1 tab diaria', quantity: 10, instructions: 'Para alergia' },
                    ],
                },
            },
        ];
        for (const pres of prescriptions) {
            const created = await prisma.prescription.upsert({
                where: { code: pres.code },
                update: {},
                create: pres,
            });
            console.log('✅ Created prescription:', created.code);
        }
    }
    console.log('🎉 Seed completed!');
    await prisma.$disconnect();
    await pool.end();
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map