import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BlobController } from './blob.controller';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [BlobController],
})
export class BlobModule {}
