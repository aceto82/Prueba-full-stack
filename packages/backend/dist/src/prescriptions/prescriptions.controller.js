"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const admin_list_prescriptions_dto_1 = require("./dto/admin-list-prescriptions.dto");
const create_prescription_dto_1 = require("./dto/create-prescription.dto");
const list_prescriptions_dto_1 = require("./dto/list-prescriptions.dto");
const prescriptions_service_1 = require("./prescriptions.service");
let PrescriptionsController = class PrescriptionsController {
    prescriptionsService;
    constructor(prescriptionsService) {
        this.prescriptionsService = prescriptionsService;
    }
    create(user, dto) {
        return this.prescriptionsService.create(user.sub, dto);
    }
    findAll(user, query) {
        return this.prescriptionsService.findAllForDoctor(user.sub, query);
    }
    findOne(id, user) {
        return this.prescriptionsService.findOne(id, user);
    }
    findMyPrescriptions(user, query) {
        return this.prescriptionsService.findAllForPatient(user.sub, query);
    }
    consume(id, user) {
        return this.prescriptionsService.consume(id, user.sub);
    }
    async getPdf(id, user, res) {
        const buffer = await this.prescriptionsService.generatePdf(id, user);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="prescription-${id}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    findAllAdmin(query) {
        return this.prescriptionsService.findAllAdmin(query);
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, roles_decorator_1.Roles)(client_1.Role.doctor),
    (0, swagger_1.ApiOperation)({ summary: 'Crear prescripción', description: 'Solo doctor. Crea una prescripción con uno o más ítems para un paciente.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescripción creada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere doctor)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('prescriptions'),
    (0, roles_decorator_1.Roles)(client_1.Role.doctor),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mis prescripciones (doctor)', description: 'Retorna solo las prescripciones del doctor autenticado. Soporta filtros por estado, fecha y paginación.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de prescripciones' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere doctor)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_prescriptions_dto_1.ListPrescriptionsDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('prescriptions/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.doctor, client_1.Role.patient, client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de prescripción', description: 'Accesible por doctor autor, paciente propietario o admin.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalle de la prescripción con ítems' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos sobre esta prescripción' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescripción no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('me/prescriptions'),
    (0, roles_decorator_1.Roles)(client_1.Role.patient),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mis prescripciones (paciente)', description: 'Retorna solo las prescripciones del paciente autenticado.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de prescripciones' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere patient)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_prescriptions_dto_1.ListPrescriptionsDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findMyPrescriptions", null);
__decorate([
    (0, common_1.Put)('prescriptions/:id/consume'),
    (0, roles_decorator_1.Roles)(client_1.Role.patient),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar prescripción como consumida', description: 'Solo el paciente propietario puede consumir la prescripción.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescripción marcada como consumida' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos o prescripción ajena' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescripción no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La prescripción ya estaba consumida' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "consume", null);
__decorate([
    (0, common_1.Get)('prescriptions/:id/pdf'),
    (0, roles_decorator_1.Roles)(client_1.Role.patient, client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Descargar PDF de prescripción', description: 'Genera y descarga un PDF con los datos completos de la prescripción, incluyendo código QR.' }),
    (0, swagger_1.ApiProduces)('application/pdf'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo PDF binario (application/pdf)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos sobre esta prescripción' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescripción no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "getPdf", null);
__decorate([
    (0, common_1.Get)('admin/prescriptions'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las prescripciones (admin)', description: 'Solo admin. Permite filtrar por estado, doctor, paciente y rango de fechas.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de prescripciones' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_prescriptions_dto_1.AdminListPrescriptionsDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findAllAdmin", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)('prescriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map