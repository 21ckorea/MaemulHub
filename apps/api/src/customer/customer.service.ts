import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { page?: number; pageSize?: number; q?: string; sort?: string }) {
    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));

    const where: any = {};
    if (params.q) {
      const q = params.q;
      where.OR = [
        { name: { contains: q } },
        { phone: { contains: q } },
        { email: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
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

  async get(id: string) {
    const c = await this.prisma.customer.findUnique({ where: { id } });
    if (!c) throw new NotFoundException({ error: { code: 'C404-001', message: 'NotFound' } });
    return c;
  }

  async create(input: CreateCustomerDto) {
    if (!input.name || input.name.trim() === '') throw new BadRequestException('name required');
    const data: any = {
      name: input.name,
      phone: input.phone,
      email: input.email,
      tags: input.tags ?? [],
    };
    return this.prisma.customer.create({ data });
  }

  async update(id: string, input: UpdateCustomerDto) {
    await this.get(id);
    const data: any = {
      name: input.name,
      phone: input.phone,
      email: input.email,
      tags: input.tags,
    };
    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.customer.delete({ where: { id } });
    return { ok: true };
  }
}
