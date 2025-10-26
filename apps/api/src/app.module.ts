import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { CustomerModule } from './customer/customer.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ShareLinkModule } from './share-link/share-link.module';
import { ContractModule } from './contract/contract.module';
import { UploadsModule } from './uploads/uploads.module';
import { BlobModule } from './blob/blob.module';

@Module({
  imports: [PrismaModule, PropertyModule, CustomerModule, InquiryModule, ShareLinkModule, ContractModule, UploadsModule, BlobModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
