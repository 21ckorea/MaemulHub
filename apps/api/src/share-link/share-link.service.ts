import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function tokenGen(len = 24) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let t = '';
  for (let i = 0; i < len; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

@Injectable()
export class ShareLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { propertyId: string; expiresAt?: string | null; password?: string | null }) {
    if (!input.propertyId) throw new BadRequestException('propertyId required');
    // Ensure property exists
    const prop = await this.prisma.property.findUnique({ where: { id: input.propertyId } });
    if (!prop) throw new NotFoundException('property not found');

    // Unique token
    let token = tokenGen();
    // In rare collision, retry few times
    for (let i = 0; i < 3; i++) {
      const exists = await this.prisma.shareLink.findUnique({ where: { token } });
      if (!exists) break;
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

  async listByProperty(propertyId: string) {
    return this.prisma.shareLink.findMany({ where: { propertyId }, orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    await this.prisma.shareLink.delete({ where: { id } });
    return { ok: true };
  }

  async getPublicByToken(token: string) {
    const link = await this.prisma.shareLink.findUnique({ where: { token }, include: { property: true } });
    if (!link) throw new NotFoundException('link not found');
    if (link.expiresAt && link.expiresAt.getTime() < Date.now()) throw new NotFoundException('link expired');
    // password check can be added later
    return {
      token: link.token,
      property: link.property,
      expiresAt: link.expiresAt,
    };
  }
}
