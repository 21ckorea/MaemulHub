import ExportCsvButton from "../../components/ExportCsvButton";
import InquiryStatusChip from '../../components/InquiryStatusChip';
import InquiryFiltersClient from '../../components/InquiryFiltersClient';
type Search = { q?: string; status?: string; source?: string; sort?: string; page?: string; pageSize?: string };

async function fetchInquiries(params: Search) {
  const baseEnv = process.env.NEXT_PUBLIC_API_BASE || '/api';
  const appBase = process.env.NEXT_PUBLIC_APP_BASE || '';
  const base = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  const usp = new URLSearchParams();
  usp.set('page', (params.page ?? '1') as string);
  usp.set('pageSize', (params.pageSize ?? '20') as string);
  if (params.q) usp.set('q', params.q);
  if (params.status) usp.set('status', params.status);
  if (params.source) usp.set('source', params.source);
  if ((params as any).assignee) usp.set('assignee', (params as any).assignee as string);
  if (params.sort) usp.set('sort', params.sort);
  const res = await fetch(`${base}/inquiries?${usp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load inquiries');
  return res.json();
}

export default async function InquiriesPage({ searchParams }: { searchParams: Search }) {
  const data = await fetchInquiries(searchParams || {});
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
    return `/inquiries?${usp.toString()}`;
  };

  const STATUS_LABEL: Record<string, string> = { new: '새 요청', in_progress: '진행중', closed: '종료' };
  const SOURCE_LABEL: Record<string, string> = { web: '웹', phone: '전화', referral: '지인추천', kakao: '카카오' };

  const buildFilterHref = (key: string, value?: string) => {
    const init = Object.fromEntries(Object.entries(searchParams || {}).map(([k, v]) => [k, v ?? '']));
    const usp = new URLSearchParams(init as Record<string, string>);
    if (!value) usp.delete(key); else usp.set(key, value);
    usp.delete('page');
    return `/inquiries?${usp.toString()}`;
  };

  return (
    <section>
      <h2>의뢰 목록</h2>
      <form method="GET" action="/inquiries" className="mb-4">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" name="q" placeholder="제목 검색" defaultValue={searchParams?.q || ''} className="border px-2 py-1 bg-white text-black" />
          <select name="status" defaultValue={searchParams?.status || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">상태 전체</option>
            <option value="new">새 요청</option>
            <option value="in_progress">진행중</option>
            <option value="closed">종료</option>
          </select>
          <select name="source" defaultValue={searchParams?.source || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">유입 전체</option>
            <option value="web">웹</option>
            <option value="phone">전화</option>
            <option value="referral">지인추천</option>
            <option value="kakao">카카오</option>
          </select>
          <select name="sort" defaultValue={searchParams?.sort || 'createdAt_desc'} className="border px-2 py-1 bg-white text-black">
            <option value="createdAt_desc">최신순</option>
            <option value="createdAt_asc">오래된순</option>
            <option value="title_asc">제목 오름차순</option>
            <option value="title_desc">제목 내림차순</option>
          </select>
          <select name="pageSize" defaultValue={searchParams?.pageSize || '20'} className="border px-2 py-1 bg-white text-black">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <button type="submit" className="border px-3 py-1 bg-white text-black">검색</button>
          <a href="/inquiries" className="underline">초기화</a>
          <a href="/inquiries/new" className="underline">새 의뢰</a>
          <ExportCsvButton kind="inquiries" searchParams={searchParams as any} filename="inquiries.csv" />
        </div>
      </form>
      <p>총 {data.total}건</p>
      <div className="mb-3 flex flex-col gap-2 sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 py-2 border-b">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-600">상태</span>
          {['', 'new', 'in_progress', 'closed'].map((v) => (
            <a
              key={v || 'all'}
              href={buildFilterHref('status', v || undefined)}
              className={`px-2 py-0.5 text-xs rounded border ${(!searchParams?.status && v==='') || searchParams?.status===v ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {v ? (STATUS_LABEL[v] || v) : '전체'}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-600">유입</span>
          {['', 'web', 'phone', 'referral', 'kakao'].map((v) => (
            <a
              key={v || 'all'}
              href={buildFilterHref('source', v || undefined)}
              className={`px-2 py-0.5 text-xs rounded border ${(!searchParams?.source && v==='') || searchParams?.source===v ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {v ? (SOURCE_LABEL[v] || v) : '전체'}
            </a>
          ))}
        </div>
        <InquiryFiltersClient searchParams={searchParams as any} />
      </div>
      <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse' }} className="hidden md:table w-full">
        <thead>
          <tr>
            <th>
              <a className="underline" href={buildSortHref(currentSort === 'title_desc' ? 'title_asc' : 'title_desc')}>
                제목 {currentSort === 'title_desc' ? '↓' : currentSort === 'title_asc' ? '↑' : ''}
              </a>
            </th>
            <th>유입</th>
            <th>
              <a className="underline" href={buildSortHref(currentSort === 'createdAt_desc' ? 'createdAt_asc' : 'createdAt_desc')}>
                생성 {currentSort === 'createdAt_desc' ? '↓' : currentSort === 'createdAt_asc' ? '↑' : ''}
              </a>
            </th>
            <th>상태</th>
            <th>담당</th>
            <th>고객</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6}>검색 결과가 없습니다.</td>
            </tr>
          ) : items.map((i) => (
            <tr key={i.id}>
              <td><a href={`/inquiries/${i.id}`}>{i.title}</a></td>
              <td>{SOURCE_LABEL[i.source] || i.source}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td><InquiryStatusChip status={i.status} /></td>
              <td>{i.assignee || '-'}</td>
              <td>{i.customer ? <a className="underline" href={`/customers/${i.customer.id}`}>{i.customer.name}</a> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile list (cards) */}
      <div className="md:hidden flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="text-slate-500">검색 결과가 없습니다.</div>
        ) : (
          items.map((i) => (
            <div key={i.id} className="border rounded p-3">
              <div className="flex justify-between items-start gap-3">
                <div className="font-semibold break-words">
                  <a className="underline" href={`/inquiries/${i.id}`}>{i.title}</a>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(i.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 flex flex-wrap gap-x-3 gap-y-1 items-center">
                <span>유입: {SOURCE_LABEL[i.source] || i.source}</span>
                <span>상태: <InquiryStatusChip status={i.status} /></span>
                <span>담당: {i.assignee || '-'}</span>
                <span>고객: {i.customer ? <a className="underline" href={`/customers/${i.customer.id}`}>{i.customer.name}</a> : '-'}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 break-all">&nbsp;</div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/inquiries?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: '1',
            pageSize: String(pageSize),
          }).toString()}`}
        >처음</a>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/inquiries?${new URLSearchParams({
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
          href={`/inquiries?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(Math.min(totalPages, page + 1)),
            pageSize: String(pageSize),
          }).toString()}`}
        >다음</a>
        <a
          aria-disabled={page >= totalPages}
          style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
          href={`/inquiries?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(totalPages),
            pageSize: String(pageSize),
          }).toString()}`}
        >끝</a>
      </div>
    </section>
  );
}
