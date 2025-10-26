"use client";

import { useState } from "react";

export default function PublicInquiryForm({ propertyId, address }: { propertyId: string; address?: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setSending(true);
    try {
      const title = `[공유문의] ${address || propertyId} - ${name || '비공개'}`;
      const notes = `이름: ${name}\n연락처: ${contact}\n매물ID: ${propertyId}${address ? `\n주소: ${address}` : ''}\n메시지:\n${message}`;
      const payload = { title, source: 'web' as const, notes };
      const res = await fetch(`${apiBase}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }
      setResult("문의가 접수되었습니다. 빠르게 연락드리겠습니다.");
      setName("");
      setContact("");
      setMessage("");
    } catch (e: any) {
      setResult(`오류: ${e?.message || String(e)}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">문의하기</h3>
      <form onSubmit={onSubmit} className="space-y-2">
        <div>
          <label className="text-sm text-slate-600">이름</label>
          <input className="border rounded px-2 py-1 w-full" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required />
        </div>
        <div>
          <label className="text-sm text-slate-600">연락처</label>
          <input className="border rounded px-2 py-1 w-full" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="010-1234-5678" required />
        </div>
        <div>
          <label className="text-sm text-slate-600">메시지</label>
          <textarea className="border rounded px-2 py-1 w-full" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="관심 있는 이유나 요청사항을 적어주세요." required />
        </div>
        <button type="submit" disabled={sending} className="border px-3 py-1 rounded">{sending ? '보내는 중...' : '보내기'}</button>
      </form>
      {result && <p className="text-sm mt-2">{result}</p>}
    </div>
  );
}
