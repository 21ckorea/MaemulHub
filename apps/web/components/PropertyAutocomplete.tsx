"use client";

import { useEffect, useState } from "react";

export type PropertyOption = { id: string; address: string; type: string };

export default function PropertyAutocomplete({
  value,
  onChange,
  placeholder = "매물 검색 (주소)",
}: {
  value?: string;
  onChange: (id: string | undefined) => void;
  placeholder?: string;
}) {
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
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      if (!q || q.trim().length < 1) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const usp = new URLSearchParams({ q, page: "1", pageSize: "5" });
        const res = await fetch(`${base}/properties?${usp.toString()}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        // optionally log other errors
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const select = (id?: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="border px-2 py-1 w-full bg-white text-black"
      />
      {open && (
        <div className="absolute z-10 mt-1 w-full border bg-white text-black max-h-60 overflow-auto shadow-sm">
          {loading ? (
            <div className="px-2 py-2 text-sm text-slate-500">검색 중...</div>
          ) : items.length === 0 ? (
            <div className="px-2 py-2 text-sm text-slate-500">검색 결과 없음</div>
          ) : (
            items.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => select(p.id)}
                className="block w-full text-left px-2 py-1 hover:bg-slate-50"
              >
                <div className="font-medium">{p.address}</div>
                <div className="text-xs text-slate-500">{p.type} · {p.id}</div>
              </button>
            ))
          )}
          {value && (
            <button type="button" onClick={() => select(undefined)} className="block w-full text-left px-2 py-1 text-xs text-red-600">
              선택 해제
            </button>
          )}
        </div>
      )}
    </div>
  );
}
