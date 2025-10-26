import InquiryStatusChip from '../../../components/InquiryStatusChip';
import InquiryStatusActions from '../../../components/InquiryStatusActions';
type Inquiry = {
  id: string;
  title: string;
  source: string;
  status: string;
  assignee?: string | null;
  notes?: string | null;
  customer?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchInquiry(id: string) {
  const base = (() => {
    if (typeof window === 'undefined') {
      const api = process.env.INTERNAL_API_BASE || process.env.NEXT_PUBLIC_API_BASE || (process.env.VERCEL ? 'https://maemul-hub-api.vercel.app/api' : 'http://127.0.0.1:4000');
      return api;
    }
    const envBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || window.location.origin;
    return envBase.startsWith('http') ? envBase : `${appBase}${envBase}`;
  })();
  const url = `${base}/inquiries/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (res.status === 404) return null as any;
  if (!res.ok) {
    try {
      const body = await res.clone().text();
      // eslint-disable-next-line no-console
      console.error('inquiry detail fetch failed', { url, status: res.status, snippet: body?.slice(0, 256) });
    } catch {
      // eslint-disable-next-line no-console
      console.error('inquiry detail fetch failed', { url, status: res.status });
    }
    return null as any;
  }
  return (await res.json()) as Inquiry;
}

export default async function InquiryDetail({ params }: { params: { id: string } }) {
  const i = await fetchInquiry(params.id);
  if (!i) {
    return (
      <section>
        <h2>의뢰 상세</h2>
        <p className="text-red-600">해당 의뢰를 찾을 수 없습니다.</p>
        <p><a href="/inquiries" className="underline">목록으로</a></p>
      </section>
    );
  }
  return (
    <section>
      <h2>의뢰 상세</h2>
      <p>
        <a href="/inquiries">목록</a>
      </p>
      <div style={{ marginBottom: 12 }}>
        <dl>
          <dt>ID</dt>
          <dd>{i.id}</dd>
          <dt>제목</dt>
          <dd>{i.title}</dd>
          <dt>유입</dt>
          <dd>{i.source}</dd>
          <dt>상태</dt>
          <dd className="flex items-center gap-2">
            <InquiryStatusChip status={i.status} />
            <InquiryStatusActions id={i.id} status={i.status} />
          </dd>
          <dt>담당</dt>
          <dd>{i.assignee || '-'}</dd>
          <dt>비고</dt>
          <dd>{i.notes || '-'}</dd>
          <dt>고객</dt>
          <dd>
            {i.customer?.name ? (
              <a className="underline" href={`/customers/${i.customer.id}`}>{i.customer.name} ({i.customer.id})</a>
            ) : (
              '-'
            )}
          </dd>
          <dt>생성</dt>
          <dd>{new Date(i.createdAt).toLocaleString()}</dd>
        </dl>
      </div>
    </section>
  );
}
