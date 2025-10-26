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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_property_dto_1 = require("./dto/create-property.dto");
let PropertyService = class PropertyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const page = Math.max(1, Number(params.page || 1));
        const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));
        const where = {};
        if (params.q)
            where.address = { contains: params.q };
        if (params.type)
            where.type = params.type;
        if (params.status)
            where.status = params.status;
        let orderBy = { createdAt: 'desc' };
        switch (params.sort) {
            case 'id_asc':
                orderBy = { id: 'asc' };
                break;
            case 'id_desc':
                orderBy = { id: 'desc' };
                break;
            case 'type_asc':
                orderBy = { type: 'asc' };
                break;
            case 'type_desc':
                orderBy = { type: 'desc' };
                break;
            case 'address_asc':
                orderBy = { address: 'asc' };
                break;
            case 'address_desc':
                orderBy = { address: 'desc' };
                break;
            case 'status_asc':
                orderBy = { status: 'asc' };
                break;
            case 'status_desc':
                orderBy = { status: 'desc' };
                break;
            case 'createdAt_asc':
                orderBy = { createdAt: 'asc' };
                break;
            case 'price_desc':
                orderBy = { price: 'desc' };
                break;
            case 'price_asc':
                orderBy = { price: 'asc' };
                break;
            case 'createdAt_desc':
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [items, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                orderBy,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.property.count({ where }),
        ]);
        return { items, total, page, pageSize };
    }
    async get(id) {
        const prop = await this.prisma.property.findUnique({ where: { id } });
        if (!prop)
            throw new common_1.NotFoundException({ error: { code: 'C404-001', message: 'NotFound' } });
        return prop;
    }
    businessValidate(input) {
        if (input.deal_type === create_property_dto_1.DealTypeDto.monthly) {
            if (input.deposit == null || input.rent == null)
                throw new common_1.BadRequestException({ error: { code: 'P400-002', message: 'DealAmountMismatch' } });
        }
    }
    async create(input) {
        this.businessValidate(input);
        const data = {
            type: input.type,
            address: input.address,
            complexName: input.complex_name,
            lat: input.lat,
            lng: input.lng,
            areaSupply: input.area_supply,
            areaExclusive: input.area_exclusive,
            floor: input.floor,
            rooms: input.rooms,
            baths: input.baths,
            builtYear: input.built_year,
            parking: input.parking,
            dealType: input.deal_type,
            price: input.price,
            deposit: input.deposit,
            rent: input.rent,
            availableFrom: input.available_from ? new Date(input.available_from) : undefined,
            maintenanceFee: input.maintenance_fee,
            status: input.status,
            assignee: input.assignee,
            tags: input.tags,
            photos: input.photos,
        };
        return this.prisma.property.create({ data });
    }
    async update(id, input) {
        await this.get(id);
        this.businessValidate(input);
        const data = {
            type: input.type,
            address: input.address,
            complexName: input.complex_name,
            lat: input.lat,
            lng: input.lng,
            areaSupply: input.area_supply,
            areaExclusive: input.area_exclusive,
            floor: input.floor,
            rooms: input.rooms,
            baths: input.baths,
            builtYear: input.built_year,
            parking: input.parking,
            dealType: input.deal_type,
            price: input.price,
            deposit: input.deposit,
            rent: input.rent,
            availableFrom: input.available_from ? new Date(input.available_from) : undefined,
            maintenanceFee: input.maintenance_fee,
            status: input.status,
            assignee: input.assignee,
            tags: input.tags,
            photos: input.photos,
        };
        return this.prisma.property.update({ where: { id }, data });
    }
    async remove(id) {
        await this.get(id);
        await this.prisma.$transaction([
            this.prisma.contract.deleteMany({ where: { propertyId: id } }),
            this.prisma.shareLink.deleteMany({ where: { propertyId: id } }),
            this.prisma.property.delete({ where: { id } }),
        ]);
        return { ok: true };
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyService);
//# sourceMappingURL=property.service.js.map