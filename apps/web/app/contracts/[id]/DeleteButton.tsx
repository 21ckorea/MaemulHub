"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";

  async function onDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`${apiBase}/contracts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`삭제 실패: ${err?.error?.message || res.status}`);
      return;
    }
    router.push("/contracts");
    router.refresh();
  }

  return (
    <button onClick={onDelete} className="border px-3 py-1">삭제</button>
  );
}
