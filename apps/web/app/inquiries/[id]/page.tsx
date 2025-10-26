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
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/inquiries/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return (await res.json()) as Inquiry;
}

export default async function InquiryDetail({ params }: { params: { id: string } }) {
  const i = await fetchInquiry(params.id);
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
