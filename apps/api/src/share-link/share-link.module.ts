import { Module } from '@nestjs/common';
import { ShareLinkService } from './share-link.service';
import { ShareLinkController } from './share-link.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShareLinkController],
  providers: [ShareLinkService],
  exports: [ShareLinkService],
})
export class ShareLinkModule {}
