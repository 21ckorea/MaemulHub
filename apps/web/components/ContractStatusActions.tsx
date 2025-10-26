"use client";

import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

export default function ContractStatusActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const { show } = useToast();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";

  const setStatus = async (next: string) => {
    if (next === status) return;
    try {
      const res = await fetch(`${base}/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("update failed");
      show("상태가 변경되었습니다", "success");
      router.refresh();
    } catch {
      show("상태 변경 실패", "error");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={`border px-2 py-1 text-sm ${status==='draft'?'bg-black text-white':''}`} onClick={() => setStatus('draft')}>draft</button>
      <button type="button" className={`border px-2 py-1 text-sm ${status==='signed'?'bg-black text-white':''}`} onClick={() => setStatus('signed')}>signed</button>
      <button type="button" className={`border px-2 py-1 text-sm ${status==='cancelled'?'bg-black text-white':''}`} onClick={() => setStatus('cancelled')}>cancelled</button>
    </div>
  );
}
