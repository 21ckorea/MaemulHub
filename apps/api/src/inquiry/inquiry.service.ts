import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto, InquirySourceDto, InquiryStatusDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { page?: number; pageSize?: number; q?: string; status?: string; source?: string; assignee?: string; sort?: string }) {
    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));

    const where: any = {};
    if (params.q) where.title = { contains: params.q };
    if (params.status) where.status = params.status;
    if (params.source) where.source = params.source;
    if (params.assignee) where.assignee = params.assignee;

    let orderBy: any = { createdAt: 'desc' };
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
      .map((r: { assignee: string | null }) => r.assignee)
      .filter((v: string | null | undefined): v is string => !!v);
  }

  async get(id: string) {
    const item = await this.prisma.inquiry.findUnique({ where: { id }, include: { customer: true } });
    if (!item) throw new NotFoundException({ error: { code: 'I404-001', message: 'NotFound' } });
    return item;
  }

  async create(input: CreateInquiryDto) {
    if (!input.title || input.title.trim() === '') throw new BadRequestException('title required');
    const data: any = {
      title: input.title,
      source: input.source as InquirySourceDto,
      status: input.status ?? InquiryStatusDto.new,
      assignee: input.assignee,
      notes: input.notes,
      customerId: input.customerId,
    };
    return this.prisma.inquiry.create({ data });
  }

  async update(id: string, input: UpdateInquiryDto) {
    await this.get(id);
    const data: any = {
      title: input.title,
      source: input.source,
      status: input.status,
      assignee: input.assignee,
      notes: input.notes,
      customerId: input.customerId,
    };
    return this.prisma.inquiry.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.inquiry.delete({ where: { id } });
    return { ok: true };
  }
}
