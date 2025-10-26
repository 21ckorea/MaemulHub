type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

async function fetchCustomer(id: string) {
  const base = (() => {
    if (typeof window === 'undefined') {
      const api = process.env.INTERNAL_API_BASE || process.env.NEXT_PUBLIC_API_BASE || (process.env.VERCEL ? 'https://maemul-hub-api.vercel.app/api' : 'http://127.0.0.1:4000');
      return api;
    }
    const envBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || window.location.origin;
    return envBase.startsWith('http') ? envBase : `${appBase}${envBase}`;
  })();
  const url = `${base}/customers/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (res.status === 404) return null as any;
  if (!res.ok) {
    try {
      const body = await res.clone().text();
      // eslint-disable-next-line no-console
      console.error('customer detail fetch failed', { url, status: res.status, snippet: body?.slice(0, 256) });
    } catch {
      // eslint-disable-next-line no-console
      console.error('customer detail fetch failed', { url, status: res.status });
    }
    return null as any;
  }
  return (await res.json()) as Customer;
}

export default async function CustomerDetail({ params }: { params: { id: string } }) {
  const c = await fetchCustomer(params.id);
  if (!c) {
    return (
      <section>
        <h2>고객 상세</h2>
        <p className="text-red-600">해당 고객을 찾을 수 없습니다.</p>
        <p><a href="/customers" className="underline">목록으로</a></p>
      </section>
    );
  }
  return (
    <section>
      <h2>고객 상세</h2>
      <p>
        <a href="/customers">목록</a>
        {' '}· <a className="underline" href={`/contracts/new?customerId=${c.id}`}>계약 생성</a>
      </p>
      <div style={{ marginBottom: 12 }}>
        <dl>
          <dt>ID</dt>
          <dd>{c.id}</dd>
          <dt>이름</dt>
          <dd>{c.name}</dd>
          <dt>전화</dt>
          <dd>{c.phone || '-'}</dd>
          <dt>이메일</dt>
          <dd>{c.email || '-'}</dd>
          <dt>태그</dt>
          <dd>{c.tags?.join(', ') || '-'}</dd>
          <dt>생성</dt>
          <dd>{new Date(c.createdAt).toLocaleString()}</dd>
        </dl>
      </div>
    </section>
  );
}

