import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { put } from '@vercel/blob';

@Controller('blob')
export class BlobController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    const uploaded = [] as Array<{ url: string; pathname: string; size: number; contentType: string | undefined }>;
    for (const f of files || []) {
      const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}-${f.originalname}`;
      const res = await put(key, f.buffer, {
        access: 'public',
        contentType: f.mimetype,
      });
      uploaded.push({ url: res.url, pathname: res.pathname, size: f.size, contentType: f.mimetype });
    }
    return { files: uploaded };
  }
}
