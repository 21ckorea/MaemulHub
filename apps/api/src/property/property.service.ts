import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, DealTypeDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    type?: string;
    status?: string;
    sort?: string; // e.g., createdAt_desc | createdAt_asc | price_desc | price_asc
  }) {
    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));

    const where: any = {};
    if (params.q) where.address = { contains: params.q };
    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;

    let orderBy: any = { createdAt: 'desc' };
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

  async get(id: string) {
    let prop = await this.prisma.property.findUnique({ where: { id } }).catch(() => null);
    if (!prop) prop = await this.prisma.property.findFirst({ where: { id: { equals: id } } }).catch(() => null);
    if (!prop) prop = await this.prisma.property.findFirst({ where: { id: { equals: id.trim() } } }).catch(() => null);
    if (!prop) throw new NotFoundException({ error: { code: 'C404-001', message: 'NotFound' } });
    return prop;
  }

  private businessValidate(input: Partial<CreatePropertyDto | UpdatePropertyDto>) {
    if (input.deal_type === DealTypeDto.monthly) {
      if (input.deposit == null || input.rent == null)
        throw new BadRequestException({ error: { code: 'P400-002', message: 'DealAmountMismatch' } });
    }
  }

  async create(input: CreatePropertyDto) {
    this.businessValidate(input);
    const data: any = {
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
      // Store as Decimal (schema updated)
      price: input.price,
      deposit: input.deposit,
      rent: input.rent,
      availableFrom: input.available_from ? new Date(input.available_from) : undefined,
      maintenanceFee: input.maintenance_fee,
      status: input.status,
      assignee: input.assignee,
      tags: input.tags,
      photos: (input as any).photos,
    };
    return this.prisma.property.create({ data });
  }

  async update(id: string, input: UpdatePropertyDto) {
    await this.get(id);
    this.businessValidate(input);
    const data: any = {
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
      photos: (input as any).photos,
    };
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.$transaction([
      this.prisma.contract.deleteMany({ where: { propertyId: id } }),
      this.prisma.shareLink.deleteMany({ where: { propertyId: id } }),
      this.prisma.property.delete({ where: { id } }),
    ]);
    return { ok: true };
  }

  async recentIds() {
    return this.prisma.property.findMany({ select: { id: true }, orderBy: { createdAt: 'desc' }, take: 20 });
  }

  async diagnostics(id: string) {
    const buf = Buffer.from(id);
    const hex = Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join(' ');
    const unique = await this.prisma.property.findUnique({ where: { id } }).catch(() => null);
    const first = await this.prisma.property.findFirst({ where: { id: { equals: id } } }).catch(() => null);
    const trimmed = await this.prisma.property
      .findFirst({ where: { id: { equals: id.trim() } } })
      .catch(() => null);
    const recent = await this.prisma.property.findMany({ select: { id: true }, orderBy: { createdAt: 'desc' }, take: 10 });
    return {
      received: id,
      length: id.length,
      hex,
      foundByUnique: !!unique,
      foundByFirst: !!first,
      foundByTrimmed: !!trimmed,
      recent,
    };
  }
}
