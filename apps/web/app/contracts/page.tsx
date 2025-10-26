import ExportCsvButton from "../../components/ExportCsvButton";
type Search = { q?: string; status?: string; type?: string; assignee?: string; page?: string; pageSize?: string; sort?: string };

async function fetchContracts(params: Search) {
  const apiEnv = process.env.NEXT_PUBLIC_API_BASE;
  const prodDefault = 'https://maemul-hub-api.vercel.app/api';
  const base = (() => {
    if (process.env.VERCEL) {
      if (!apiEnv) return prodDefault;
      if (apiEnv.startsWith('http')) return apiEnv;
      return prodDefault;
    }
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || 'http://localhost:3000';
    const baseEnv = apiEnv && apiEnv.length > 0 ? apiEnv : 'http://127.0.0.1:4000';
    return baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  })();
  const usp = new URLSearchParams();
  usp.set('page', (params.page ?? '1') as string);
  usp.set('pageSize', (params.pageSize ?? '20') as string);
  if (params.q) usp.set('q', params.q);
  if (params.status) usp.set('status', params.status);
  if (params.type) usp.set('type', params.type);
  if (params.assignee) usp.set('assignee', params.assignee);
  if (params.sort) usp.set('sort', params.sort);
  const res = await fetch(`${base}/contracts?${usp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load contracts');
  return res.json();
}

export default async function ContractsPage({ searchParams }: { searchParams: Search }) {
  const data = await fetchContracts(searchParams || {});
  const items = data.items as Array<any>;
  const page = Number(searchParams?.page || '1');
  const pageSize = Number(searchParams?.pageSize || '20');
  const currentSort = searchParams?.sort || 'createdAt_desc';

  const buildSortHref = (nextSort: string) => {
    const usp = new URLSearchParams({
      ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page' && k !== 'sort')),
      sort: nextSort,
      page: '1',
      pageSize: String(pageSize),
    });
    return `/contracts?${usp.toString()}`;
  };

  const TYPE_LABEL: Record<string, string> = { lease: '임대', rent: '임차', sale: '매매' };
  const STATUS_LABEL: Record<string, string> = { draft: '임시저장', signed: '서명완료', cancelled: '취소' };

  return (
    <section>
      <h2>계약 목록</h2>
      <form method="GET" action="/contracts" className="mb-4">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" name="q" placeholder="비고 검색" defaultValue={searchParams?.q || ''} className="border px-2 py-1 bg-white text-black" />
          <select name="status" defaultValue={searchParams?.status || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">상태 전체</option>
            <option value="draft">임시저장</option>
            <option value="signed">서명완료</option>
            <option value="cancelled">취소</option>
          </select>
          <select name="type" defaultValue={searchParams?.type || ''} className="border px-2 py-1 bg-white text-black">
            <option value="">유형 전체</option>
            <option value="lease">임대</option>
            <option value="rent">임차</option>
            <option value="sale">매매</option>
          </select>
          <select name="sort" defaultValue={currentSort} className="border px-2 py-1 bg-white text-black">
            <option value="createdAt_desc">생성 최신</option>
            <option value="createdAt_asc">생성 오래된</option>
            <option value="startAt_desc">시작 최신</option>
            <option value="startAt_asc">시작 오래된</option>
          </select>
          <select name="pageSize" defaultValue={String(pageSize)} className="border px-2 py-1 bg-white text-black">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <button type="submit" className="border px-3 py-1 bg-white text-black">검색</button>
          <a href="/contracts" className="underline">초기화</a>
          <a href="/contracts/new" className="underline">새 계약</a>
          <ExportCsvButton kind="contracts" searchParams={searchParams as any} filename="contracts.csv" />
        </div>
      </form>
      <p>총 {data.total}건</p>
      <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse' }} className="w-full">
        <thead>
          <tr>
            <th><a className="underline" href={buildSortHref(currentSort === 'createdAt_desc' ? 'createdAt_asc' : 'createdAt_desc')}>생성 {currentSort === 'createdAt_desc' ? '↓' : currentSort === 'createdAt_asc' ? '↑' : ''}</a></th>
            <th>유형</th>
            <th>상태</th>
            <th>담당</th>
            <th>매물</th>
            <th>고객</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6}>검색 결과가 없습니다.</td></tr>
          ) : items.map((c: any) => (
            <tr key={c.id}>
              <td><a href={`/contracts/${c.id}`}>{new Date(c.createdAt).toLocaleString()}</a></td>
              <td>{TYPE_LABEL[c.type] || c.type}</td>
              <td>{STATUS_LABEL[c.status] || c.status}</td>
              <td>{c.assignee || '-'}</td>
              <td>{c.property ? <a className="underline" href={`/properties/${c.property.id}`}>{c.property.address}</a> : '-'}</td>
              <td>{c.customer ? <a className="underline" href={`/customers/${c.customer.id}`}>{c.customer.name}</a> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <a aria-disabled={page <= 1} style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }} href={`/contracts?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')), page: String(page - 1), pageSize: String(pageSize) }).toString()}`}>이전</a>
        <a aria-disabled={items.length < pageSize} style={{ pointerEvents: items.length < pageSize ? 'none' : 'auto', opacity: items.length < pageSize ? 0.5 : 1 }} href={`/contracts?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')), page: String(page + 1), pageSize: String(pageSize) }).toString()}`}>다음</a>
      </div>
    </section>
  );
}
