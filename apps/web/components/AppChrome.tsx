"use client";

import { usePathname } from "next/navigation";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShare = pathname?.startsWith("/share");

  if (isShare) {
    return <div className="p-4 max-w-5xl mx-auto">{children}</div>;
  }

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="rounded-xl p-4 bg-gradient-to-r from-brand to-purple-500 text-white">
            <div className="text-4xl font-extrabold tracking-tight">매물허브</div>
            <h1 className="text-base md:text-lg font-medium mt-1">부동산 매물/고객/계약 관리</h1>
          </div>
          <nav className="mt-3 flex flex-wrap gap-2 md:gap-3">
            <a href="/" className="btn btn-soft">홈</a>
            <a href="/properties" className="btn btn-soft">매물 목록</a>
            <a href="/properties/new" className="btn">새 매물</a>
            <a href="/customers" className="btn btn-soft">고객 목록</a>
            <a href="/customers/new" className="btn">새 고객</a>
            <a href="/inquiries" className="btn btn-soft">의뢰 목록</a>
            <a href="/inquiries/new" className="btn">새 의뢰</a>
            <a href="/contracts" className="btn btn-soft">계약 목록</a>
            <a href="/contracts/new" className="btn">새 계약</a>
            <a href="/api/health" target="_blank" rel="noreferrer" className="btn btn-soft">API Health</a>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

