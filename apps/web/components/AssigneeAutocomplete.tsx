"use client";

import { useEffect, useState } from "react";

export default function AssigneeAutocomplete({
  value,
  onChange,
  placeholder = "담당자 입력 또는 선택",
}: {
  value?: string;
  onChange: (v: string) => void;
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
  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      try {
        const res = await fetch(`${base}/inquiries/assignees`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {}
    };
    run();
    return () => ctrl.abort();
  }, []);

  const select = (v: string) => {
    setQ(v);
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="border px-2 py-1 w-full bg-white text-black"
      />
      {open && items.length > 0 && (
        <div className="absolute z-10 mt-1 w-full border bg-white text-black max-h-60 overflow-auto shadow-sm">
          {items
            .filter((s) => (q ? s.toLowerCase().includes(q.toLowerCase()) : true))
            .slice(0, 10)
            .map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => select(s)}
                className="block w-full text-left px-2 py-1 hover:bg-slate-50"
              >
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
