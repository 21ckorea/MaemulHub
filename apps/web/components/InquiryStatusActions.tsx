"use client";

import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

export default function InquiryStatusActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_BASE || "/api";
  const { show } = useToast();

  const setStatus = async (next: string) => {
    if (next === status) return;
    try {
      const res = await fetch(`${base}/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("update failed");
      show("상태가 변경되었습니다", "success");
      router.refresh();
    } catch (e) {
      show("상태 변경 실패", "error");
    }
  };

  const btn = (value: string, label: string) => (
    <button
      type="button"
      onClick={() => setStatus(value)}
      className={`border px-2 py-0.5 text-xs rounded ${status === value ? "bg-black text-white" : "bg-white"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-1">
      {btn("new", "new")}
      {btn("in_progress", "in_progress")}
      {btn("closed", "closed")}
    </div>
  );
}

