"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
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
      const res = await fetch(`${base}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      router.push(`/customers/${created.id}`);
    } catch (err: any) {
      setError(err?.message || "에러가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>새 고객</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-md">
        <label className="flex flex-col gap-1">
          <span>이름 *</span>
          <input className="border px-2 py-1 bg-white text-black" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span>전화</span>
          <input className="border px-2 py-1 bg-white text-black" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>이메일</span>
          <input className="border px-2 py-1 bg-white text-black" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>태그 (쉼표 구분)</span>
          <input className="border px-2 py-1 bg-white text-black" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <div className="flex items-center gap-3 mt-2">
          <button disabled={loading} type="submit" className="border px-3 py-1 bg-white text-black">
            {loading ? "저장 중..." : "저장"}
          </button>
          <a href="/customers" className="underline">목록</a>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </section>
  );
}
