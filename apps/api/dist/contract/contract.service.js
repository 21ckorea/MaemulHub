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
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContractService = class ContractService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    serialize(c) {
        if (!c)
            return c;
        const toNum = (v) => (v === null || v === undefined ? null : Number(v));
        return {
            ...c,
            price: toNum(c.price),
            deposit: toNum(c.deposit),
            rent: toNum(c.rent),
        };
    }
    async list(params) {
        const page = Math.max(1, Number(params.page || 1));
        const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));
        const where = {};
        if (params.q)
            where.notes = { contains: params.q };
        if (params.status)
            where.status = params.status;
        if (params.type)
            where.type = params.type;
        if (params.assignee)
            where.assignee = params.assignee;
        if (params.startFrom || params.startTo) {
            where.startAt = {};
            if (params.startFrom)
                where.startAt.gte = new Date(params.startFrom);
            if (params.startTo)
                where.startAt.lte = new Date(params.startTo);
        }
        let orderBy = { createdAt: 'desc' };
        switch (params.sort) {
            case 'startAt_asc':
                orderBy = { startAt: 'asc' };
                break;
            case 'startAt_desc':
                orderBy = { startAt: 'desc' };
                break;
            case 'createdAt_asc':
                orderBy = { createdAt: 'asc' };
                break;
            case 'createdAt_desc':
                orderBy = { createdAt: 'desc' };
                break;
        }
        const [items, total] = await Promise.all([
            this.prisma.contract.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, include: { property: true, customer: true } }),
            this.prisma.contract.count({ where }),
        ]);
        return { items: items.map((i) => this.serialize(i)), total, page, pageSize };
    }
    async get(id) {
        const item = await this.prisma.contract.findUnique({ where: { id }, include: { property: true, customer: true } });
        if (!item)
            throw new common_1.NotFoundException('contract not found');
        return this.serialize(item);
    }
    async create(input) {
        if (!input.propertyId)
            throw new common_1.BadRequestException('propertyId required');
        if (!input.customerId)
            throw new common_1.BadRequestException('customerId required');
        const data = {
            type: input.type,
            status: input.status ?? 'draft',
            propertyId: input.propertyId,
            customerId: input.customerId,
            price: input.price ?? null,
            deposit: input.deposit ?? null,
            rent: input.rent ?? null,
            signedAt: input.signedAt ? new Date(input.signedAt) : null,
            startAt: input.startAt ? new Date(input.startAt) : null,
            endAt: input.endAt ? new Date(input.endAt) : null,
            assignee: input.assignee ?? null,
            notes: input.notes ?? null,
        };
        const created = await this.prisma.contract.create({ data });
        return this.serialize(created);
    }
    async update(id, input) {
        const data = {};
        for (const k of ['type', 'status', 'propertyId', 'customerId', 'price', 'deposit', 'rent', 'assignee', 'notes']) {
            if (k in input)
                data[k] = input[k];
        }
        for (const k of ['signedAt', 'startAt', 'endAt']) {
            if (k in input)
                data[k] = input[k] ? new Date(input[k]) : null;
        }
        const updated = await this.prisma.contract.update({ where: { id }, data });
        return this.serialize(updated);
    }
    async remove(id) {
        await this.prisma.contract.delete({ where: { id } });
        return { ok: true };
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractService);
//# sourceMappingURL=contract.service.js.map