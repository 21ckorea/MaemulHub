import PublicActions from '../../../components/SharePublicActions';
import PublicInquiryForm from '../../../components/PublicInquiryForm';
import SharePhotosCarousel from '../../../components/SharePhotosCarousel';
import type { Metadata } from 'next';
type PublicShare = {
  token: string;
  property: {
    id: string;
    type: string;
    address: string;
    dealType?: string | null;
    price?: number | null;
    deposit?: number | null;
    rent?: number | null;
    status: string;
    createdAt: string;
    photos?: string[];
  };
  expiresAt?: string | null;
};

async function fetchPublic(token: string): Promise<PublicShare | null> {
  // On the server, call our own proxy '/api' with absolute app origin; on the client, proxy via /api
  const base = (() => {
    if (typeof window === 'undefined') {
      const appOrigin = process.env.NEXT_PUBLIC_APP_BASE
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000');
      return `${appOrigin}/api`;
    }
    const envBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || window.location.origin;
    return envBase.startsWith('http') ? envBase : `${appBase}${envBase}`;
  })();
  const res = await fetch(`${base}/share-links/public/${token}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json() as Promise<PublicShare>;
}

const TYPE_LABEL: Record<string, string> = {
  apartment: '아파트',
  officetel: '오피스텔',
  store: '상가',
  land: '토지',
  multifamily: '다가구',
  villa: '빌라',
};

const DEAL_LABEL: Record<string, string> = {
  sale: '매매',
  jeonse: '전세',
  monthly: '월세',
  lease: '임대',
  rent: '임차',
};

export default async function PublicSharePage({ params }: { params: { token: string } }) {
  const data = await fetchPublic(params.token);
  if (!data) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-2xl border rounded-lg shadow-sm p-6">
          <div className="text-xs text-slate-500">MaemulHub</div>
          <h2 className="text-xl font-semibold mt-1">공유 링크</h2>
          <p className="text-red-700 mt-3">링크가 만료되었거나 존재하지 않습니다.</p>
          <p className="mt-3"><a className="underline" href="/">홈으로</a></p>
        </div>
      </section>
    );
  }
  const p = data.property;
  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl border rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <div className="text-xs text-slate-500">MaemulHub</div>
          <h1 className="text-2xl font-semibold mt-1">매물 정보</h1>
          {data.expiresAt && (
            <p className="text-sm text-slate-500 mt-1">만료: {new Date(data.expiresAt).toLocaleString()}</p>
          )}
        </div>
        <div className="space-y-3">
          {Array.isArray(p.photos) && p.photos.length > 0 && (
            <div>
              <SharePhotosCarousel photos={p.photos} />
            </div>
          )}
          <div>
            <div className="text-slate-500 text-sm">주소</div>
            <div className="text-lg font-medium">{p.address}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="text-slate-500 text-sm">유형</div>
              <div>{TYPE_LABEL[p.type] || p.type}</div>
            </div>
            <div>
              <div className="text-slate-500 text-sm">거래</div>
              <div>{p.dealType ? (DEAL_LABEL[p.dealType] || p.dealType) : '-'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-sm">등록일</div>
              <div>{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">가격</div>
            <div className="text-lg">
              {p.price ?? p.deposit ?? p.rent ? (
                <span>
                  {p.price ? `${p.price.toLocaleString()}만원` : ''}
                  {p.deposit ? ` / 보증금 ${p.deposit.toLocaleString()}만원` : ''}
                  {p.rent ? ` / 월세 ${p.rent.toLocaleString()}만원` : ''}
                </span>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          {/* CTA */}
          <PublicActions token={data.token} address={p.address} phone={process.env.NEXT_PUBLIC_CONTACT_PHONE} />
        </div>
        <div className="mt-6 border-t pt-4">
          <PublicInquiryForm propertyId={p.id} />
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const data = await fetchPublic(params.token);
  if (!data) {
    return {
      title: '공유 매물 | 링크 만료',
      description: '링크가 만료되었거나 존재하지 않습니다.',
      openGraph: {
        title: '공유 매물 | 링크 만료',
        description: '링크가 만료되었거나 존재하지 않습니다.'
      },
    };
  }
  const p = data.property;
  const title = `매물 정보 | ${p.address}`;
  const typeK = TYPE_LABEL[p.type] || p.type;
  const dealK = p.dealType ? (DEAL_LABEL[p.dealType] || p.dealType) : '-';
  const desc = `${typeK} · ${dealK} · ${p.price ? `${p.price.toLocaleString()}만원` : p.deposit || p.rent ? `${p.deposit ? `보증금 ${p.deposit.toLocaleString()}만원` : ''}${p.deposit && p.rent ? ' / ' : ''}${p.rent ? `월세 ${p.rent.toLocaleString()}만원` : ''}` : '-'}`;
  const base = process.env.NEXT_PUBLIC_APP_BASE || '';
  const ogImage = `${base}/share/${data.token}/opengraph-image`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${base}/share/${data.token}`,
      type: 'website',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
  };
}
