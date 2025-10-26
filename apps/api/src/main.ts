import 'dotenv/config';
import 'reflect-metadata';
import { createNestApp } from './app.factory';
import { join } from 'path';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await createNestApp();
  // ensure uploads dir exists and serve statically
  const uploadsDir = join(process.cwd(), 'uploads');
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
  app.use('/uploads', express.static(uploadsDir));
  const port = process.env.PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
