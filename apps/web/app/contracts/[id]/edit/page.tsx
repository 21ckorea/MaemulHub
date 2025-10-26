"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyAutocomplete from "../../../../components/PropertyAutocomplete";
import CustomerAutocomplete from "../../../../components/CustomerAutocomplete";
import AssigneeAutocomplete from "../../../../components/AssigneeAutocomplete";
import { useToast } from "../../../../components/ToastProvider";

export default function EditContractPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const { show } = useToast();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState("lease");
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

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${base}/contracts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("load failed");
        const c = await res.json();
        setType(c.type);
        setStatus(c.status);
        setPropertyId(c.property?.id || c.propertyId);
        setCustomerId(c.customer?.id || c.customerId);
        setPrice(c.price != null ? String(c.price) : "");
        setDeposit(c.deposit != null ? String(c.deposit) : "");
        setRent(c.rent != null ? String(c.rent) : "");
        setSignedAt(c.signedAt ? c.signedAt.slice(0, 10) : "");
        setStartAt(c.startAt ? c.startAt.slice(0, 10) : "");
        setEndAt(c.endAt ? c.endAt.slice(0, 10) : "");
        setAssignee(c.assignee || "");
        setNotes(c.notes || "");
      } catch (e: any) {
        setError(e?.message || "load failed");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [base, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!propertyId) { setError("매물을 선택하세요"); return; }
    if (!customerId) { setError("고객을 선택하세요"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${base}/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, status, propertyId, customerId,
          price: price ? Number(price) : null,
          deposit: deposit ? Number(deposit) : null,
          rent: rent ? Number(rent) : null,
          signedAt: signedAt || null,
          startAt: startAt || null,
          endAt: endAt || null,
          assignee: assignee || null,
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error("update failed");
      show("저장되었습니다", "success");
      router.push(`/contracts/${id}`);
      router.refresh();
    } catch (e: any) {
      show("저장 실패", "error");
      setError(e?.message || "update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <section>
      <h2>계약 편집</h2>
      <p>
        <a className="underline" href={`/contracts/${id}`}>상세로</a>
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3 mt-2">
        <label className="flex flex-col gap-1">
          <span>유형</span>
          <select className="border px-2 py-1" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="lease">lease</option>
            <option value="rent">rent</option>
            <option value="sale">sale</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>상태</span>
          <select className="border px-2 py-1" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">draft</option>
            <option value="signed">signed</option>
            <option value="cancelled">cancelled</option>
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
            <input className="border px-2 py-1" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span>보증금</span>
            <input className="border px-2 py-1" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span>월세</span>
            <input className="border px-2 py-1" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1"><span>서명일</span><input type="date" className="border px-2 py-1" value={signedAt} onChange={(e) => setSignedAt(e.target.value)} /></label>
          <label className="flex flex-col gap-1"><span>시작일</span><input type="date" className="border px-2 py-1" value={startAt} onChange={(e) => setStartAt(e.target.value)} /></label>
          <label className="flex flex-col gap-1"><span>종료일</span><input type="date" className="border px-2 py-1" value={endAt} onChange={(e) => setEndAt(e.target.value)} /></label>
        </div>
        <label className="flex flex-col gap-1">
          <span>담당</span>
          <AssigneeAutocomplete value={assignee} onChange={setAssignee} />
        </label>
        <label className="flex flex-col gap-1">
          <span>비고</span>
          <textarea className="border px-2 py-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <div className="flex items-center gap-3 mt-2">
          <button disabled={saving} type="submit" className="border px-3 py-1">{saving ? "저장 중..." : "저장"}</button>
          <a href={`/contracts/${id}`} className="underline">취소</a>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </section>
  );
}
