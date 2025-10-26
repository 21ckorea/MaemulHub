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
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000';
  const res = await fetch(`${base}/customers/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return (await res.json()) as Customer;
}

export default async function CustomerDetail({ params }: { params: { id: string } }) {
  const c = await fetchCustomer(params.id);
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
