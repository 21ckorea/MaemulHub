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
exports.InquiryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_inquiry_dto_1 = require("./dto/create-inquiry.dto");
let InquiryService = class InquiryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const page = Math.max(1, Number(params.page || 1));
        const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));
        const where = {};
        if (params.q)
            where.title = { contains: params.q };
        if (params.status)
            where.status = params.status;
        if (params.source)
            where.source = params.source;
        if (params.assignee)
            where.assignee = params.assignee;
        let orderBy = { createdAt: 'desc' };
        switch (params.sort) {
            case 'title_asc':
                orderBy = { title: 'asc' };
                break;
            case 'title_desc':
                orderBy = { title: 'desc' };
                break;
            case 'createdAt_asc':
                orderBy = { createdAt: 'asc' };
                break;
            case 'createdAt_desc':
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [items, total] = await Promise.all([
            this.prisma.inquiry.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, include: { customer: true } }),
            this.prisma.inquiry.count({ where }),
        ]);
        return { items, total, page, pageSize };
    }
    async assignees() {
        const rows = await this.prisma.inquiry.findMany({
            where: { assignee: { not: null } },
            distinct: ['assignee'],
            select: { assignee: true },
            orderBy: { assignee: 'asc' },
            take: 1000,
        });
        return rows
            .map((r) => r.assignee)
            .filter((v) => !!v);
    }
    async get(id) {
        const item = await this.prisma.inquiry.findUnique({ where: { id }, include: { customer: true } });
        if (!item)
            throw new common_1.NotFoundException({ error: { code: 'I404-001', message: 'NotFound' } });
        return item;
    }
    async create(input) {
        if (!input.title || input.title.trim() === '')
            throw new common_1.BadRequestException('title required');
        const data = {
            title: input.title,
            source: input.source,
            status: input.status ?? create_inquiry_dto_1.InquiryStatusDto.new,
            assignee: input.assignee,
            notes: input.notes,
            customerId: input.customerId,
        };
        return this.prisma.inquiry.create({ data });
    }
    async update(id, input) {
        await this.get(id);
        const data = {
            title: input.title,
            source: input.source,
            status: input.status,
            assignee: input.assignee,
            notes: input.notes,
            customerId: input.customerId,
        };
        return this.prisma.inquiry.update({ where: { id }, data });
    }
    async remove(id) {
        await this.get(id);
        await this.prisma.inquiry.delete({ where: { id } });
        return { ok: true };
    }
};
exports.InquiryService = InquiryService;
exports.InquiryService = InquiryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InquiryService);
//# sourceMappingURL=inquiry.service.js.map