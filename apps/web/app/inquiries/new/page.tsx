"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomerAutocomplete from "../../../components/CustomerAutocomplete";

export default function NewInquiryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("web");
  const [status, setStatus] = useState("new");
  const [assignee, setAssignee] = useState("");
  const [notes, setNotes] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";
      const payload: any = {
        title: title.trim(),
        source,
        status,
        assignee: assignee.trim() || undefined,
        notes: notes.trim() || undefined,
        customerId: customerId.trim() || undefined,
      };
      const res = await fetch(`${base}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      router.push(`/inquiries/${created.id}`);
    } catch (err: any) {
      setError(err?.message || "에러가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>새 의뢰</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-md">
        <label className="flex flex-col gap-1">
          <span>제목 *</span>
          <input className="border px-2 py-1 bg-white text-black" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span>유입 *</span>
          <select className="border px-2 py-1 bg-white text-black" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="web">웹</option>
            <option value="phone">전화</option>
            <option value="referral">지인추천</option>
            <option value="kakao">카카오</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>상태</span>
          <select className="border px-2 py-1 bg-white text-black" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="new">새 요청</option>
            <option value="in_progress">진행중</option>
            <option value="closed">종료</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>담당</span>
          <input className="border px-2 py-1 bg-white text-black" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>비고</span>
          <textarea className="border px-2 py-1 bg-white text-black" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>고객 선택 (선택)</span>
          <CustomerAutocomplete
            value={customerId}
            onChange={(id) => setCustomerId(id || "")}
            placeholder="고객 검색 (이름/전화/이메일)"
          />
        </label>
        <div className="flex items-center gap-3 mt-2">
          <button disabled={loading} type="submit" className="border px-3 py-1 bg-white text-black">
            {loading ? "저장 중..." : "저장"}
          </button>
          <a href="/inquiries" className="underline">목록</a>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </section>
  );
}
