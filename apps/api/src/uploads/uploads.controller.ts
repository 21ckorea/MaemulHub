import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = (files || []).map((f) => ({
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      path: `/uploads/${f.filename}`,
      url: `/uploads/${f.filename}`,
    }));
    return { files: urls };
  }
}
