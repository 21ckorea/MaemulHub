import { createExpressApp } from '../src/app.factory';

let cachedApp: any = null;

async function getApp() {
  if (!cachedApp) {
    cachedApp = await createExpressApp();
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  // Next.js API routes are mounted at '/api/*'. Our Nest/Express routes
  // are defined without that prefix (e.g., '/blob/upload'). Strip it so
  // the Express router matches correctly.
  if (typeof req?.url === 'string' && req.url.startsWith('/api/')) {
    // remove leading '/api' but keep the leading slash so Express matches '/...'
    const stripped = req.url.substring(4);
    req.url = stripped.startsWith('/') ? stripped : `/${stripped}`;
  } else if (req.url === '/api') {
    req.url = '/';
  }
  const app = await getApp();
  return app(req, res);
}
