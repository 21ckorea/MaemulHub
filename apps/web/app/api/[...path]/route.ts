import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function buildTargetUrl(req: NextRequest) {
  const base = process.env.INTERNAL_API_BASE || 'http://127.0.0.1:4000';
  const pathname = req.nextUrl.pathname.replace(/^\/api\/?/, '');
  const qs = req.nextUrl.search ? `?${req.nextUrl.search.replace(/^\?/, '')}` : '';
  return `${base}/${pathname}${qs}`;
}

function buildHeaders(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');
  return headers;
}

async function forward(method: string, req: NextRequest) {
  const target = buildTargetUrl(req);
  const init: RequestInit = { method, headers: buildHeaders(req) };
  if (method !== 'GET' && method !== 'HEAD') {
    // Read and forward the raw body (supports JSON and multipart/form-data)
    const body = await req.blob();
    init.body = body as any;
  }
  const res = await fetch(target, init);
  // sanitize response headers
  const outHeaders = new Headers(res.headers);
  outHeaders.delete('content-encoding');
  outHeaders.delete('content-length');
  if (!outHeaders.get('content-type')) {
    const p = req.nextUrl.pathname.toLowerCase();
    if (p.endsWith('.jpg') || p.endsWith('.jpeg')) outHeaders.set('content-type', 'image/jpeg');
    else if (p.endsWith('.png')) outHeaders.set('content-type', 'image/png');
    else if (p.endsWith('.webp')) outHeaders.set('content-type', 'image/webp');
  }
  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(req: NextRequest) { return forward('GET', req); }
export async function HEAD(req: NextRequest) { return forward('HEAD', req); }
export async function POST(req: NextRequest) { return forward('POST', req); }
export async function PUT(req: NextRequest) { return forward('PUT', req); }
export async function PATCH(req: NextRequest) { return forward('PATCH', req); }
export async function DELETE(req: NextRequest) { return forward('DELETE', req); }
