import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';

@Module({
  imports: [PrismaModule],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
