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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
let PropertyController = class PropertyController {
    constructor(service) {
        this.service = service;
    }
    list(page, pageSize, q, type, status, sort) {
        return this.service.list({ page: Number(page), pageSize: Number(pageSize), q, type, status, sort });
    }
    get(id) {
        return this.service.get(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('q')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "remove", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map