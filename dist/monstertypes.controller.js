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
exports.MonstertypesController = void 0;
const common_1 = require("@nestjs/common");
const monstertypes_service_1 = require("./monstertypes.service");
let MonstertypesController = class MonstertypesController {
    constructor(service) {
        this.service = service;
    }
    async health(res) {
        return res.status(common_1.HttpStatus.OK).json({ ok: true });
    }
    async getMonstertypes(res) {
        try {
            const monstertypes = await this.service.getAll();
            return res.status(common_1.HttpStatus.OK).json({ monstertypes });
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.code) === 'DB_CONNECT_ERROR') {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    errorText: 'Ошибка подключения к базе данных'
                });
            }
            console.error('Unexpected error:', e);
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ errorText: 'Внутренняя ошибка сервера' });
        }
    }
};
exports.MonstertypesController = MonstertypesController;
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonstertypesController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('monstertypes'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonstertypesController.prototype, "getMonstertypes", null);
exports.MonstertypesController = MonstertypesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [monstertypes_service_1.MonstertypesService])
], MonstertypesController);
//# sourceMappingURL=monstertypes.controller.js.map