"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  function resolveApiBase() {
    const envBase = process.env.NEXT_PUBLIC_API_BASE;
    const prodDefault = "https://maemul-hub-api.vercel.app/api";
    if (typeof window === "undefined") {
      return envBase && envBase.length > 0 ? envBase : (process.env.VERCEL ? prodDefault : "/api");
    }
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || window.location.origin;
    const baseEnv = envBase && envBase.length > 0 ? envBase : (process.env.VERCEL ? prodDefault : "/api");
    return baseEnv.startsWith("http") ? baseEnv : `${appBase}${baseEnv}`;
  }
  const apiBase = resolveApiBase();

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
