import ExportCsvButton from "../../components/ExportCsvButton";
import { formatManwon, formatPriceByDeal, formatShortDate } from "../../lib/format";
type Search = { q?: string; type?: string; status?: string; sort?: string; page?: string; pageSize?: string };

async function fetchProperties(params: Search) {
  const baseEnv = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000';
  const appBase = process.env.NEXT_PUBLIC_APP_BASE || 'http://localhost:3000';
  const base = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  const usp = new URLSearchParams();
  usp.set('page', (params.page ?? '1') as string);
  usp.set('pageSize', (params.pageSize ?? '20') as string);
  if (params.q) usp.set('q', params.q);
  if (params.type) usp.set('type', params.type);
  if (params.status) usp.set('status', params.status);
  if (params.sort) usp.set('sort', params.sort);
  const res = await fetch(`${base}/properties?${usp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load properties');
  return res.json();
}

export default async function PropertiesPage({ searchParams }: { searchParams: Search }) {
  const data = await fetchProperties(searchParams || {});
  const items = data.items as Array<any>;
  const page = Number(searchParams?.page || '1');
  const pageSize = Number(searchParams?.pageSize || '20');
  const totalPages = Math.max(1, Math.ceil((data.total || 0) / pageSize));
  const currentSort = searchParams?.sort || 'createdAt_desc';

  const buildSortHref = (nextSort: string) => {
    const usp = new URLSearchParams({
      ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page' && k !== 'sort')),
      sort: nextSort,
      page: '1',
      pageSize: String(pageSize),
    });
    return `/properties?${usp.toString()}`;
  };

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
  const STATUS_LABEL: Record<string, string> = {
    draft: '임시저장',
    review: '검토중',
    published: '공개',
    in_contract: '계약중',
    closed: '종료',
  };

  return (
    <section>
      <h2>매물 목록</h2>
      <form method="GET" action="/properties" className="mb-4">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="q"
            placeholder="주소 검색"
            defaultValue={searchParams?.q || ''}
            className="border px-2 py-1 bg-white text-black"
          />
          <select name="type" defaultValue={searchParams?.type || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">유형 전체</option>
            <option value="apartment">아파트</option>
            <option value="officetel">오피스텔</option>
            <option value="store">상가</option>
            <option value="land">토지</option>
            <option value="multifamily">다가구</option>
            <option value="villa">빌라</option>
          </select>
          <select name="status" defaultValue={searchParams?.status || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">상태 전체</option>
            <option value="draft">임시저장</option>
            <option value="review">검토중</option>
            <option value="published">공개</option>
            <option value="in_contract">계약중</option>
            <option value="closed">종료</option>
          </select>
          <select name="sort" defaultValue={searchParams?.sort || 'createdAt_desc'} className="border px-2 py-1 bg-white text-black">
            <option value="createdAt_desc">최신순</option>
            <option value="createdAt_asc">오래된순</option>
            <option value="price_desc">가격 높은순</option>
            <option value="price_asc">가격 낮은순</option>
          </select>
          <select name="pageSize" defaultValue={searchParams?.pageSize || '20'} className="border px-2 py-1 bg-white text-black">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <button type="submit" className="border px-3 py-1 bg-white text-black">검색</button>
          <a href="/properties" className="underline">초기화</a>
          <a href="/properties/new" className="underline">새 매물 등록</a>
          <ExportCsvButton kind="properties" searchParams={searchParams as any} filename="properties.csv" />
        </div>
      </form>
      <p>총 {data.total}건</p>
      <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse' }} className="hidden md:table w-full">
        <thead>
          <tr>
            <th>
              <a
                className="underline"
                href={buildSortHref(currentSort === 'type_desc' ? 'type_asc' : 'type_desc')}
                title={currentSort === 'type_desc' ? '유형 오름차순으로' : '유형 내림차순으로'}
              >
                유형 {currentSort === 'type_desc' ? '↓' : currentSort === 'type_asc' ? '↑' : ''}
              </a>
            </th>
            <th>단지명</th>
            <th>
              <a
                className="underline"
                href={buildSortHref(currentSort === 'address_desc' ? 'address_asc' : 'address_desc')}
                title={currentSort === 'address_desc' ? '주소 오름차순으로' : '주소 내림차순으로'}
              >
                주소 {currentSort === 'address_desc' ? '↓' : currentSort === 'address_asc' ? '↑' : ''}
              </a>
            </th>
            <th>거래</th>
            <th>
              <a
                className="underline"
                href={buildSortHref(currentSort === 'price_desc' ? 'price_asc' : 'price_desc')}
                title={currentSort === 'price_desc' ? '가격 낮은순으로' : '가격 높은순으로'}
              >
                가격 {currentSort === 'price_desc' ? '↓' : currentSort === 'price_asc' ? '↑' : ''}
              </a>
            </th>
            <th>등록자</th>
            <th>
              <a
                className="underline"
                href={buildSortHref(currentSort === 'status_desc' ? 'status_asc' : 'status_desc')}
                title={currentSort === 'status_desc' ? '상태 오름차순으로' : '상태 내림차순으로'}
              >
                상태 {currentSort === 'status_desc' ? '↓' : currentSort === 'status_asc' ? '↑' : ''}
              </a>
            </th>
            <th>
              <a
                className="underline"
                href={buildSortHref(currentSort === 'createdAt_desc' ? 'createdAt_asc' : 'createdAt_desc')}
                title={currentSort === 'createdAt_desc' ? '오래된순으로' : '최신순으로'}
              >
                생성 {currentSort === 'createdAt_desc' ? '↓' : currentSort === 'createdAt_asc' ? '↑' : ''}
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7}>검색 결과가 없습니다.</td>
            </tr>
          ) : items.map((p) => (
            <tr key={p.id}>
              <td>{TYPE_LABEL[p.type] || p.type}</td>
              <td>{p.complexName ?? p.complex_name ?? ''}</td>
              <td><a className="underline" href={`/properties/${p.id}`}>{p.address}</a></td>
              <td>{p.dealType ? (DEAL_LABEL[p.dealType] || p.dealType) : '-'}</td>
              <td>{formatPriceByDeal(p.dealType, p.price, p.deposit, p.rent)}</td>
              <td>{p.assignee || '-'}</td>
              <td>{STATUS_LABEL[p.status] || p.status}</td>
              <td>{formatShortDate(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile list (cards) */}
      <div className="md:hidden flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="text-slate-500">검색 결과가 없습니다.</div>
        ) : (
          items.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <div className="flex justify-between items-start gap-3">
                <div className="font-semibold break-words">
                  <a className="underline" href={`/properties/${p.id}`}>{p.address}</a>
                  {p.complexName || p.complex_name ? (
                    <div className="text-xs text-slate-500 mt-0.5">{p.complexName ?? p.complex_name}</div>
                  ) : null}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{formatShortDate(p.createdAt)}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 flex flex-wrap gap-x-3 gap-y-1">
                <span>유형: {TYPE_LABEL[p.type] || p.type}</span>
                <span>상태: {STATUS_LABEL[p.status] || p.status}</span>
                <span>거래: {p.dealType ? (DEAL_LABEL[p.dealType] || p.dealType) : '-'}</span>
                <span>가격: {formatPriceByDeal(p.dealType, p.price, p.deposit, p.rent)}</span>
                <span>등록자: {p.assignee || '-'}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/properties?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: '1',
            pageSize: String(pageSize),
          }).toString()}`}
        >처음</a>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/properties?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(Math.max(1, page - 1)),
            pageSize: String(pageSize),
          }).toString()}`}
        >이전</a>
        <span>
          {page} / {totalPages}
        </span>
        <a
          aria-disabled={page >= totalPages}
          style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
          href={`/properties?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(Math.min(totalPages, page + 1)),
            pageSize: String(pageSize),
          }).toString()}`}
        >다음</a>
        <a
          aria-disabled={page >= totalPages}
          style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
          href={`/properties?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(totalPages),
            pageSize: String(pageSize),
          }).toString()}`}
        >끝</a>
      </div>
    </section>
  );
}
