import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ShareLinkService } from './share-link.service';

@Controller('share-links')
export class ShareLinkController {
  constructor(private readonly service: ShareLinkService) {}

  @Post()
  create(@Body() body: { propertyId: string; expiresAt?: string | null; password?: string | null }) {
    return this.service.create(body);
  }

  @Get()
  listByQuery(@Query('propertyId') propertyId?: string) {
    if (propertyId) return this.service.listByProperty(propertyId);
    return [];
  }

  @Get('property/:propertyId')
  listByProperty(@Param('propertyId') propertyId: string) {
    return this.service.listByProperty(propertyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Public endpoint to resolve by token
  @Get('public/:token')
  getPublic(@Param('token') token: string) {
    return this.service.getPublicByToken(token);
  }
}
