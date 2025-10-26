import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize(c: any) {
    if (!c) return c;
    const toNum = (v: any) => (v === null || v === undefined ? null : Number(v));
    return {
      ...c,
      price: toNum(c.price),
      deposit: toNum(c.deposit),
      rent: toNum(c.rent),
    };
  }

  async list(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    status?: string;
    type?: string;
    assignee?: string;
    startFrom?: string;
    startTo?: string;
    sort?: string;
  }) {
    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));

    const where: any = {};
    if (params.q) where.notes = { contains: params.q };
    if (params.status) where.status = params.status as any;
    if (params.type) where.type = params.type as any;
    if (params.assignee) where.assignee = params.assignee;
    if (params.startFrom || params.startTo) {
      where.startAt = {};
      if (params.startFrom) where.startAt.gte = new Date(params.startFrom);
      if (params.startTo) where.startAt.lte = new Date(params.startTo);
    }

    let orderBy: any = { createdAt: 'desc' };
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

    return { items: items.map((i: any) => this.serialize(i)), total, page, pageSize };
  }

  async get(id: string) {
    const item = await this.prisma.contract.findUnique({ where: { id }, include: { property: true, customer: true } });
    if (!item) throw new NotFoundException('contract not found');
    return this.serialize(item);
  }

  async create(input: any) {
    if (!input.propertyId) throw new BadRequestException('propertyId required');
    if (!input.customerId) throw new BadRequestException('customerId required');
    const data: any = {
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

  async update(id: string, input: any) {
    const data: any = {};
    for (const k of ['type', 'status', 'propertyId', 'customerId', 'price', 'deposit', 'rent', 'assignee', 'notes']) {
      if (k in input) data[k] = input[k];
    }
    for (const k of ['signedAt', 'startAt', 'endAt']) {
      if (k in input) data[k] = input[k] ? new Date(input[k]) : null;
    }
    const updated = await this.prisma.contract.update({ where: { id }, data });
    return this.serialize(updated);
  }

  async remove(id: string) {
    await this.prisma.contract.delete({ where: { id } });
    return { ok: true };
  }
}
