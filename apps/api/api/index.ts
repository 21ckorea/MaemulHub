import serverlessExpress from '@vendia/serverless-express';
import { createExpressApp } from '../src/app.factory';

let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

async function getServer() {
  if (!cachedServer) {
    const app = await createExpressApp();
    cachedServer = serverlessExpress({ app });
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  // Next.js API routes are mounted at '/api/*'. Our Nest/Express routes
  // are defined without that prefix (e.g., '/blob/upload'). Strip it so
  // the Express router matches correctly.
  if (typeof req?.url === 'string' && req.url.startsWith('/api/')) {
    req.url = req.url.substring(4); // remove leading '/api'
  } else if (req.url === '/api') {
    req.url = '/';
  }
  const server = await getServer();
  return server(req, res);
}
