import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly service: InquiryService) {}

  @Get('assignees')
  assignees() {
    return this.service.assignees();
  }

  @Get()
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('assignee') assignee?: string,
    @Query('sort') sort?: string,
  ) {
    return this.service.list({ page: Number(page), pageSize: Number(pageSize), q, status, source, assignee, sort });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() input: CreateInquiryDto) {
    return this.service.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateInquiryDto) {
    return this.service.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
