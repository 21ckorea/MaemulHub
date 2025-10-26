import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req: any, file: Express.Multer.File, cb: (error: any, destination: string) => void) => cb(null, 'uploads'),
        filename: (req: any, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, name + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req: any, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) cb(null, true);
        else cb(null, false);
      },
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
