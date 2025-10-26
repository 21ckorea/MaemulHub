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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerService = class CustomerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const page = Math.max(1, Number(params.page || 1));
        const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));
        const where = {};
        if (params.q) {
            const q = params.q;
            where.OR = [
                { name: { contains: q } },
                { phone: { contains: q } },
                { email: { contains: q } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        switch (params.sort) {
            case 'name_asc':
                orderBy = { name: 'asc' };
                break;
            case 'name_desc':
                orderBy = { name: 'desc' };
                break;
            case 'createdAt_asc':
                orderBy = { createdAt: 'asc' };
                break;
            case 'createdAt_desc':
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [items, total] = await Promise.all([
            this.prisma.customer.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
            this.prisma.customer.count({ where }),
        ]);
        return { items, total, page, pageSize };
    }
    async get(id) {
        const c = await this.prisma.customer.findUnique({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException({ error: { code: 'C404-001', message: 'NotFound' } });
        return c;
    }
    async create(input) {
        if (!input.name || input.name.trim() === '')
            throw new common_1.BadRequestException('name required');
        const data = {
            name: input.name,
            phone: input.phone,
            email: input.email,
            tags: input.tags ?? [],
        };
        return this.prisma.customer.create({ data });
    }
    async update(id, input) {
        await this.get(id);
        const data = {
            name: input.name,
            phone: input.phone,
            email: input.email,
            tags: input.tags,
        };
        return this.prisma.customer.update({ where: { id }, data });
    }
    async remove(id) {
        await this.get(id);
        await this.prisma.customer.delete({ where: { id } });
        return { ok: true };
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map