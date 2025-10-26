"use client";

import { useEffect, useMemo, useState } from "react";

export type CustomerOption = { id: string; name: string; phone?: string | null; email?: string | null };

export default function CustomerAutocomplete({
  value,
  onChange,
  placeholder = "고객 검색 (이름/전화/이메일)",
}: {
  value?: string;
  onChange: (id: string | undefined) => void;
  placeholder?: string;
}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CustomerOption[]>([]);
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
        const res = await fetch(`${base}/customers?${usp.toString()}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
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

  // Ensure selected value is known/displayable even if it's not in current items
  useEffect(() => {
    const run = async () => {
      if (!value) return;
      if (items.some((c) => c.id === value)) return;
      try {
        const res = await fetch(`${base}/customers/${value}`, { cache: "no-store" });
        if (!res.ok) return;
        const c = await res.json();
        setItems((prev) => [{ id: c.id, name: c.name, phone: c.phone, email: c.email }, ...prev]);
      } catch {
        /* noop */
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const select = (id?: string) => {
    onChange(id);
    setOpen(false);
    setQ("");
  };

  const selected = useMemo(() => items.find((c) => c.id === value), [items, value]);

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
            items.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => select(c.id)}
                className="block w-full text-left px-2 py-1 hover:bg-slate-50"
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">{c.phone || "-"} · {c.email || "-"}</div>
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
      {selected && (
        <div className="mt-1 text-xs text-slate-600">선택됨: {selected.name} ({selected.id})</div>
      )}
    </div>
  );
}
