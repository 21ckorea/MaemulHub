"use client";

import { useRouter } from "next/navigation";
import AssigneeAutocomplete from "./AssigneeAutocomplete";
import { useToast } from "./ToastProvider";

export default function InquiryFiltersClient({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const { show } = useToast();

  const setParam = (key: string, value?: string) => {
    const usp = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || ""])
      ) as Record<string, string>
    );
    if (!value) usp.delete(key);
    else usp.set(key, value);
    usp.delete("page");
    router.push(`/inquiries?${usp.toString()}`);
  };

  const copyLink = async () => {
    const usp = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || ""])
      ) as Record<string, string>
    );
    usp.delete("page");
    const url = `${location.origin}/inquiries?${usp.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      show("링크가 복사되었습니다", "success");
    } catch {
      show("링크 복사 실패", "error");
    }
  };

  const resetFilters = () => {
    router.push("/inquiries");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-600">담당</span>
        <div className="min-w-[200px]">
          <AssigneeAutocomplete
            value={(searchParams.assignee as string) || ""}
            onChange={(v) => setParam("assignee", v || undefined)}
            placeholder="담당자 검색"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" className="border px-2 py-1 text-sm" onClick={resetFilters}>필터 초기화</button>
        <button type="button" className="border px-2 py-1 text-sm" onClick={copyLink}>링크 복사</button>
      </div>
    </div>
  );
}
