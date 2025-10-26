import ExportCsvButton from "../../components/ExportCsvButton";
type Search = { q?: string; sort?: string; page?: string; pageSize?: string };

async function fetchCustomers(params: Search) {
  const baseEnv = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:4000';
  const appBase = process.env.NEXT_PUBLIC_APP_BASE || 'http://localhost:3000';
  const base = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  const usp = new URLSearchParams();
  usp.set('page', (params.page ?? '1') as string);
  usp.set('pageSize', (params.pageSize ?? '20') as string);
  if (params.q) usp.set('q', params.q);
  if (params.sort) usp.set('sort', params.sort);
  const res = await fetch(`${base}/customers?${usp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load customers');
  return res.json();
}

export default async function CustomersPage({ searchParams }: { searchParams: Search }) {
  const data = await fetchCustomers(searchParams || {});
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
    return `/customers?${usp.toString()}`;
  };

  return (
    <section>
      <h2>고객 목록</h2>
      <form method="GET" action="/customers" className="mb-4">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="q"
            placeholder="이름/전화/이메일"
            defaultValue={searchParams?.q || ''}
            className="border px-2 py-1 bg-white text-black"
          />
          <select name="sort" defaultValue={searchParams?.sort || 'createdAt_desc'} className="border px-2 py-1 bg-white text-black">
            <option value="createdAt_desc">최신순</option>
            <option value="createdAt_asc">오래된순</option>
            <option value="name_asc">이름 오름차순</option>
            <option value="name_desc">이름 내림차순</option>
          </select>
          <select name="pageSize" defaultValue={searchParams?.pageSize || '20'} className="border px-2 py-1 bg-white text-black">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <button type="submit" className="border px-3 py-1 bg-white text-black">검색</button>
          <a href="/customers" className="underline">초기화</a>
          <a href="/customers/new" className="underline">새 고객</a>
          <ExportCsvButton kind="customers" searchParams={searchParams as any} filename="customers.csv" />
        </div>
      </form>
      <p>총 {data.total}건</p>
      <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse' }} className="hidden md:table w-full">
        <thead>
          <tr>
            <th>
              <a className="underline" href={buildSortHref(currentSort === 'name_desc' ? 'name_asc' : 'name_desc')}>
                이름 {currentSort === 'name_desc' ? '↓' : currentSort === 'name_asc' ? '↑' : ''}
              </a>
            </th>
            <th>전화</th>
            <th>이메일</th>
            <th>
              <a className="underline" href={buildSortHref(currentSort === 'createdAt_desc' ? 'createdAt_asc' : 'createdAt_desc')}>
                생성 {currentSort === 'createdAt_desc' ? '↓' : currentSort === 'createdAt_asc' ? '↑' : ''}
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4}>검색 결과가 없습니다.</td>
            </tr>
          ) : items.map((c) => (
            <tr key={c.id}>
              <td><a href={`/customers/${c.id}`}>{c.name}</a></td>
              <td>{c.phone || '-'}</td>
              <td>{c.email || '-'}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile list (cards) */}
      <div className="md:hidden flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="text-slate-500">검색 결과가 없습니다.</div>
        ) : (
          items.map((c) => (
            <div key={c.id} className="border rounded p-3">
              <div className="flex justify-between items-start gap-3">
                <div className="font-semibold break-words">
                  <a className="underline" href={`/customers/${c.id}`}>{c.name}</a>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 flex flex-col gap-1">
                <span>전화: {c.phone || '-'}</span>
                <span>이메일: {c.email || '-'}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 break-all">ID: {c.id}</div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/customers?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: '1',
            pageSize: String(pageSize),
          }).toString()}`}
        >처음</a>
        <a
          aria-disabled={page <= 1}
          style={{ pointerEvents: page <= 1 ? 'none' : 'auto', opacity: page <= 1 ? 0.5 : 1 }}
          href={`/customers?${new URLSearchParams({
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
          href={`/customers?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(Math.min(totalPages, page + 1)),
            pageSize: String(pageSize),
          }).toString()}`}
        >다음</a>
        <a
          aria-disabled={page >= totalPages}
          style={{ pointerEvents: page >= totalPages ? 'none' : 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
          href={`/customers?${new URLSearchParams({
            ...Object.fromEntries(Object.entries(searchParams || {}).filter(([k]) => k !== 'page')),
            page: String(totalPages),
            pageSize: String(pageSize),
          }).toString()}`}
        >끝</a>
      </div>
    </section>
  );
}
