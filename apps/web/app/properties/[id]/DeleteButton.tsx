"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";

  async function onDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`${apiBase}/properties/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || (res.status === 409 ? '관련 항목(공유 링크/계약 등)이 있어 삭제할 수 없습니다. 먼저 관련 항목을 삭제해 주세요.' : `HTTP ${res.status}`);
      alert(`삭제 실패: ${msg}`);
      return;
    }
    router.push("/properties");
    router.refresh();
  }

  return (
    <button onClick={onDelete} className="border px-3 py-1">삭제</button>
  );
}
