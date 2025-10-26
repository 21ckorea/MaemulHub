import DeleteButton from './DeleteButton';
import ContractStatusChip from '../../../components/ContractStatusChip';
import ContractStatusActions from '../../../components/ContractStatusActions';

type Contract = {
  id: string;
  type: string;
  status: string;
  assignee?: string | null;
  price?: number | null;
  deposit?: number | null;
  rent?: number | null;
  signedAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  property?: { id: string; address: string } | null;
  customer?: { id: string; name: string } | null;
};

async function fetchContract(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000';
  const res = await fetch(`${base}/contracts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return (await res.json()) as Contract;
}

export default async function ContractDetail({ params }: { params: { id: string } }) {
  const c = await fetchContract(params.id);
  return (
    <section>
      <h2>계약 상세</h2>
      <p>
        <a href={`/contracts/${c.id}/edit`}>편집</a> · <a href="/contracts">목록</a>
      </p>
      <div style={{ marginBottom: 12 }}>
        <DeleteButton id={c.id} />
      </div>
      <dl>
        <dt>ID</dt>
        <dd>{c.id}</dd>
        <dt>유형</dt>
        <dd>{c.type}</dd>
        <dt>상태</dt>
        <dd className="flex items-center gap-2"><ContractStatusChip status={c.status} /> <ContractStatusActions id={c.id} status={c.status} /></dd>
        <dt>담당</dt>
        <dd>{c.assignee || '-'}</dd>
        <dt>매물</dt>
        <dd>{c.property ? <a className="underline" href={`/properties/${c.property.id}`}>{c.property.address}</a> : '-'}</dd>
        <dt>고객</dt>
        <dd>{c.customer ? <a className="underline" href={`/customers/${c.customer.id}`}>{c.customer.name}</a> : '-'}</dd>
        <dt>금액</dt>
        <dd>
          {(c.price ?? c.deposit ?? c.rent) != null ? (
            <span>
              {c.price ? `${c.price.toLocaleString()}만원` : ''}
              {c.deposit ? ` / 보증금 ${c.deposit.toLocaleString()}만원` : ''}
              {c.rent ? ` / 월세 ${c.rent.toLocaleString()}만원` : ''}
            </span>
          ) : (
            '-'
          )}
        </dd>
        <dt>서명일</dt>
        <dd>{c.signedAt ? new Date(c.signedAt).toLocaleDateString() : '-'}</dd>
        <dt>시작일</dt>
        <dd>{c.startAt ? new Date(c.startAt).toLocaleDateString() : '-'}</dd>
        <dt>종료일</dt>
        <dd>{c.endAt ? new Date(c.endAt).toLocaleDateString() : '-'}</dd>
        <dt>비고</dt>
        <dd>{c.notes || '-'}</dd>
        <dt>생성</dt>
        <dd>{new Date(c.createdAt).toLocaleString()}</dd>
        <dt>수정</dt>
        <dd>{new Date(c.updatedAt).toLocaleString()}</dd>
      </dl>
    </section>
  );
}
