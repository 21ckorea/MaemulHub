import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') q?: string,
    @Query('sort') sort?: string,
  ) {
    return this.service.list({ page: Number(page), pageSize: Number(pageSize), q, sort });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() input: CreateCustomerDto) {
    return this.service.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateCustomerDto) {
    return this.service.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
