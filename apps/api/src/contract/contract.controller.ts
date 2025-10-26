import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @Get()
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('assignee') assignee?: string,
    @Query('startFrom') startFrom?: string,
    @Query('startTo') startTo?: string,
    @Query('sort') sort?: string,
  ) {
    return this.service.list({ page: Number(page), pageSize: Number(pageSize), q, status, type, assignee, startFrom, startTo, sort });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
