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
exports.ShareLinkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function tokenGen(len = 24) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let t = '';
    for (let i = 0; i < len; i++)
        t += chars[Math.floor(Math.random() * chars.length)];
    return t;
}
let ShareLinkService = class ShareLinkService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input) {
        if (!input.propertyId)
            throw new common_1.BadRequestException('propertyId required');
        // Ensure property exists
        const prop = await this.prisma.property.findUnique({ where: { id: input.propertyId } });
        if (!prop)
            throw new common_1.NotFoundException('property not found');
        // Unique token
        let token = tokenGen();
        // In rare collision, retry few times
        for (let i = 0; i < 3; i++) {
            const exists = await this.prisma.shareLink.findUnique({ where: { token } });
            if (!exists)
                break;
            token = tokenGen();
        }
        const link = await this.prisma.shareLink.create({
            data: {
                token,
                propertyId: input.propertyId,
                expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
                password: input.password || null,
            },
        });
        return link;
    }
    async listByProperty(propertyId) {
        return this.prisma.shareLink.findMany({ where: { propertyId }, orderBy: { createdAt: 'desc' } });
    }
    async remove(id) {
        await this.prisma.shareLink.delete({ where: { id } });
        return { ok: true };
    }
    async getPublicByToken(token) {
        const link = await this.prisma.shareLink.findUnique({ where: { token }, include: { property: true } });
        if (!link)
            throw new common_1.NotFoundException('link not found');
        if (link.expiresAt && link.expiresAt.getTime() < Date.now())
            throw new common_1.NotFoundException('link expired');
        // password check can be added later
        return {
            token: link.token,
            property: link.property,
            expiresAt: link.expiresAt,
        };
    }
};
exports.ShareLinkService = ShareLinkService;
exports.ShareLinkService = ShareLinkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShareLinkService);
//# sourceMappingURL=share-link.service.js.map