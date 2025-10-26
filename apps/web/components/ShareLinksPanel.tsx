"use client";

import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider";

export type ShareLink = {
  id: string;
  token: string;
  propertyId: string;
  expiresAt?: string | null;
  createdAt: string;
};

export default function ShareLinksPanel({ propertyId }: { propertyId: string }) {
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
  const base = resolveApiBase();
  const { show } = useToast();
  const [items, setItems] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [expires, setExpires] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/share-links/property/${propertyId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("load error");
      const data = await res.json();
      setItems(data);
    } catch {
      show("공유 링크 조회 실패", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const createLink = async () => {
    try {
      const body: any = { propertyId };
      if (expires) body.expiresAt = expires;
      const res = await fetch(`${base}/share-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("create failed");
      show("공유 링크가 생성되었습니다", "success");
      setExpires("");
      load();
    } catch {
      show("공유 링크 생성 실패", "error");
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${base}/share-links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      show("삭제되었습니다", "success");
      load();
    } catch {
      show("삭제 실패", "error");
    }
  };

  const copy = async (token: string) => {
    const url = `${location.origin}/share/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      show("링크가 복사되었습니다", "success");
    } catch {
      show("복사 실패", "error");
    }
  };

  return (
    <div className="border rounded p-3">
      <h3 className="font-semibold mb-2">공유 링크</h3>
      <div className="flex flex-wrap gap-2 items-end mb-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-600">만료일(선택)</span>
          <input type="datetime-local" value={expires} onChange={(e) => setExpires(e.target.value)} className="border px-2 py-1" />
        </label>
        <button className="border px-3 py-1" onClick={createLink}>새 링크 생성</button>
        <button className="border px-3 py-1" onClick={load} disabled={loading}>{loading ? "새로고침 중..." : "새로고침"}</button>
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-slate-500">생성된 공유 링크가 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-2 border rounded px-2 py-1">
              <div className="text-sm">
                <div>
                  <span className="font-mono">{l.token}</span>
                  {l.expiresAt ? <span className="ml-2 text-slate-500">만료: {new Date(l.expiresAt).toLocaleString()}</span> : <span className="ml-2 text-slate-500">만료 없음</span>}
                </div>
                <a className="underline" href={`/share/${l.token}`} target="_blank" rel="noreferrer">공개 페이지 열기</a>
              </div>
              <div className="flex gap-2">
                <button className="border px-2 py-1 text-sm" onClick={() => copy(l.token)}>링크 복사</button>
                <button className="border px-2 py-1 text-sm" onClick={() => remove(l.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
