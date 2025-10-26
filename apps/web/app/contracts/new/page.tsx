"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CustomerAutocomplete from "../../../components/CustomerAutocomplete";
import PropertyAutocomplete from "../../../components/PropertyAutocomplete";
import AssigneeAutocomplete from "../../../components/AssigneeAutocomplete";
import { useToast } from "../../../components/ToastProvider";

export default function NewContractPage() {
  const router = useRouter();
  const { show } = useToast();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";
  const search = useSearchParams();

  const [type, setType] = useState("sale");
  const [status, setStatus] = useState("draft");
  const [propertyId, setPropertyId] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [price, setPrice] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [rent, setRent] = useState<string>("");
  const [signedAt, setSignedAt] = useState<string>("");
  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from query params
  useEffect(() => {
    const pid = search.get("propertyId");
    const cid = search.get("customerId");
    if (pid) setPropertyId(pid);
    if (cid) setCustomerId(cid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!propertyId) { setError("매물을 선택하세요"); return; }
    if (!customerId) { setError("고객을 선택하세요"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${base}/contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, status, propertyId, customerId,
          price: price ? Number(price) : undefined,
          deposit: deposit ? Number(deposit) : undefined,
          rent: rent ? Number(rent) : undefined,
          signedAt: signedAt || undefined,
          startAt: startAt || undefined,
          endAt: endAt || undefined,
          assignee: assignee || undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("create failed");
      const data = await res.json();
      show("계약이 생성되었습니다", "success");
      router.push(`/contracts/${data.id}`);
    } catch (e: any) {
      show("생성 실패", "error");
      setError(e?.message || "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<section><h2>새 계약</h2><p>로딩 중...</p></section>}>
    <section>
      <h2>새 계약</h2>
      <p>
        <a href="/contracts" className="underline">목록</a>
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3 mt-2">
        <label className="flex flex-col gap-1">
          <span>유형</span>
          <select className="border px-2 py-1 bg-white text-black" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="sale">매매</option>
            <option value="jeonse">전세</option>
            <option value="monthly">월세</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>상태</span>
          <select className="border px-2 py-1 bg-white text-black" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">임시저장</option>
            <option value="signed">서명완료</option>
            <option value="cancelled">취소</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>매물</span>
          <PropertyAutocomplete value={propertyId} onChange={setPropertyId} />
          <span className="text-xs text-slate-500">검색 결과에서 항목을 클릭하여 선택하세요.</span>
        </label>
        <label className="flex flex-col gap-1">
          <span>고객</span>
          <CustomerAutocomplete value={customerId} onChange={setCustomerId} />
          <span className="text-xs text-slate-500">검색 결과에서 항목을 클릭하여 선택하세요.</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span>매매가</span>
            <input className="border px-2 py-1 bg-white text-black" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span>보증금</span>
            <input className="border px-2 py-1 bg-white text-black" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span>월세</span>
            <input className="border px-2 py-1 bg-white text-black" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1"><span>서명일</span><input type="date" className="border px-2 py-1 bg-white text-black" value={signedAt} onChange={(e) => setSignedAt(e.target.value)} /></label>
          <label className="flex flex-col gap-1"><span>시작일</span><input type="date" className="border px-2 py-1 bg-white text-black" value={startAt} onChange={(e) => setStartAt(e.target.value)} /></label>
          <label className="flex flex-col gap-1"><span>종료일</span><input type="date" className="border px-2 py-1 bg-white text-black" value={endAt} onChange={(e) => setEndAt(e.target.value)} /></label>
        </div>
        <label className="flex flex-col gap-1">
          <span>담당</span>
          <AssigneeAutocomplete value={assignee} onChange={setAssignee} />
        </label>
        <label className="flex flex-col gap-1">
          <span>비고</span>
          <textarea className="border px-2 py-1 bg-white text-black" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <div className="flex items-center gap-3 mt-2">
          <button disabled={loading} type="submit" className="border px-3 py-1 bg-white text-black">{loading ? "저장 중..." : "저장"}</button>
          <a href="/contracts" className="underline">목록</a>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </section>
    </Suspense>
  );
}
