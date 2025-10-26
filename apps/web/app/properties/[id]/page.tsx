import DeleteButton from './DeleteButton';
import ShareLinksPanel from '../../../components/ShareLinksPanel';
type Property = {
  id: string;
  type: string;
  address: string;
  dealType?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  photos?: string[];
};

async function fetchProperty(id: string) {
  const baseEnv = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000';
  const appBase = process.env.NEXT_PUBLIC_APP_BASE || 'http://localhost:3000';
  const base = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  const res = await fetch(`${base}/properties/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return (await res.json()) as Property;
}

export default async function PropertyDetail({ params }: { params: { id: string } }) {
  const p = await fetchProperty(params.id);
  const base = process.env.NEXT_PUBLIC_API_BASE || '/api';
  const photos = Array.isArray(p.photos)
    ? p.photos.map((u) => {
        if (!u) return u;
        u = u.replace(/\\/g, '/');
        if (u.startsWith('http')) return u;
        if (u.startsWith('/api/')) return u;
        if (u.startsWith('/')) return `${base}${u}`;
        return `${base}/${u}`;
      })
    : [];
  const TYPE_LABEL: Record<string, string> = {
    apartment: '아파트', officetel: '오피스텔', store: '상가', land: '토지', multifamily: '다가구', villa: '빌라',
  };
  const DEAL_LABEL: Record<string, string> = {
    sale: '매매', jeonse: '전세', monthly: '월세', lease: '임대', rent: '임차',
  };
  const STATUS_LABEL: Record<string, string> = {
    draft: '임시저장', review: '검토중', published: '공개', in_contract: '계약중', closed: '종료',
  };
  return (
    <section>
      <h2>매물 상세</h2>
      <p>
        <a href={`/properties/${p.id}/edit`}>편집</a> · <a href="/properties">목록</a>
        {' '}· <a className="underline" href={`/contracts/new?propertyId=${p.id}`}>계약 생성</a>
      </p>
      {photos && photos.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ width: '100%', maxWidth: 920 }}>
            <img
              src={photos[0]}
              alt="cover"
              loading="eager"
              decoding="async"
              style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'cover', display: 'block', borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
          </div>
          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {photos.slice(1).map((u) => (
                <img key={u} src={u} alt="photo" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <DeleteButton id={p.id} />
      </div>
      <dl>
        <dt>ID</dt>
        <dd>{p.id}</dd>
        <dt>유형</dt>
        <dd>{TYPE_LABEL[p.type] || p.type}</dd>
        <dt>주소</dt>
        <dd>{p.address}</dd>
        <dt>거래</dt>
        <dd>{p.dealType ? (DEAL_LABEL[p.dealType] || p.dealType) : '-'}</dd>
        <dt>상태</dt>
        <dd>{STATUS_LABEL[p.status] || p.status}</dd>
        <dt>생성</dt>
        <dd>{new Date(p.createdAt).toLocaleString()}</dd>
        <dt>수정</dt>
        <dd>{new Date(p.updatedAt).toLocaleString()}</dd>
      </dl>
      <div className="mt-6">
        <ShareLinksPanel propertyId={p.id} />
      </div>
    </section>
  );
}
