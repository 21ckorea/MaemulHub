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
  const server = await getServer();
  return server(req, res);
}
