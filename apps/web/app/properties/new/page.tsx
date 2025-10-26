"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "apartment",
    address: "",
    deal_type: "sale",
    status: "draft",
    complex_name: "",
    area_supply: undefined as number | undefined,
    area_exclusive: undefined as number | undefined,
    floor: undefined as number | undefined,
    rooms: undefined as number | undefined,
    baths: undefined as number | undefined,
    built_year: undefined as number | undefined,
    parking: "",
    price: undefined as number | undefined,
    deposit: undefined as number | undefined,
    rent: undefined as number | undefined,
    available_from: "",
    maintenance_fee: undefined as number | undefined,
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
    assignee: "",
    tags: "" as any
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  // Resolve API base. On the server (prerender), avoid using window/URL.
  function resolveApiBase() {
    const baseEnv = process.env.NEXT_PUBLIC_API_BASE || '/api';
    if (typeof window === 'undefined') {
      return baseEnv; // defer full normalization to client runtime
    }
    const appBase = process.env.NEXT_PUBLIC_APP_BASE || window.location.origin;
    let abs = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
    if (!/\/(api)(\/|$)/.test(new URL(abs, appBase).pathname)) {
      abs = abs.replace(/\/?$/, '') + '/api';
    }
    return abs;
  }
  const apiBase = resolveApiBase();

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      const res = await fetch(`${apiBase}/blob/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload failed");
      const json = await res.json();
      const urls = (json.files || [])
        .map((f: any) => (f.url as string))
        .map((u: string) => {
          u = (u || '').replace(/\\/g, '/');
          if (u.startsWith('http')) return u;
          const base = apiBase;
          if (u.startsWith('/')) return `${base}${u}`;
          return `${base}/${u}`;
        });
      setPhotos((prev) => [...prev, ...urls]);
      setMsg(null);
    } catch (err: any) {
      setMsg(`업로드 오류: ${err?.message || String(err)}`);
    } finally {
      setUploading(false);
      // reset the file input to allow re-selection of same files
      e.target.value = "";
    }
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((u) => u !== url));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const payload: any = { ...form };
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      if (!payload.available_from) delete payload.available_from;
      if (photos.length) payload.photos = photos;
      const res = await fetch(`${apiBase}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }
      const created = await res.json();
      setMsg(`생성 완료: ${created.id}`);
      router.push(`/properties/${created.id}`);
    } catch (err: any) {
      setMsg(`오류: ${err.message || String(err)}`);
    }
  }

  return (
    <section>
      <h2>새 매물 등록</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: '100%' }}>
          <label>
            사진 업로드
            <input type="file" accept="image/*" multiple onChange={onFilesSelected} style={{ marginLeft: 8, background: '#fff', color: '#000' }} />
          </label>
          {uploading && <span style={{ marginLeft: 8 }}>업로드 중...</span>}
          {photos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {photos.map((u) => (
                <div key={u} style={{ position: 'relative' }}>
                  <img src={u} alt="photo" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <button type="button" onClick={() => removePhoto(u)} style={{ position: 'absolute', top: 2, right: 2, background: '#000', color: '#fff', borderRadius: 6, fontSize: 12, padding: '2px 6px' }}>삭제</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            유형
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ marginLeft: 8 }}
              className="border px-2 py-1 bg-white text-black"
            >
              <option value="apartment">아파트</option>
              <option value="officetel">오피스텔</option>
              <option value="store">상가</option>
              <option value="land">토지</option>
              <option value="multifamily">다가구</option>
              <option value="villa">빌라</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            주소
            <input
              style={{ marginLeft: 8 }}
              className="border px-2 py-1 bg-white text-black"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="도로명/지번"
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            단지명
            <input
              style={{ marginLeft: 8 }}
              className="border px-2 py-1 bg-white text-black"
              value={form.complex_name ?? ''}
              onChange={(e) => setForm({ ...form, complex_name: e.target.value })}
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            거래유형
            <select
              value={form.deal_type}
              onChange={(e) => setForm({ ...form, deal_type: e.target.value })}
              style={{ marginLeft: 8 }}
              className="border px-2 py-1 bg-white text-black"
            >
              <option value="sale">매매</option>
              <option value="jeonse">전세</option>
              <option value="monthly">월세</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>분양면적<input type="number" value={form.area_supply ?? ''} onChange={(e) => setForm({ ...form, area_supply: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>전용면적<input type="number" value={form.area_exclusive ?? ''} onChange={(e) => setForm({ ...form, area_exclusive: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>층<input type="number" value={form.floor ?? ''} onChange={(e) => setForm({ ...form, floor: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>방수<input type="number" value={form.rooms ?? ''} onChange={(e) => setForm({ ...form, rooms: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>욕실수<input type="number" value={form.baths ?? ''} onChange={(e) => setForm({ ...form, baths: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>준공년도<input type="number" value={form.built_year ?? ''} onChange={(e) => setForm({ ...form, built_year: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>주차<input value={form.parking ?? ''} onChange={(e) => setForm({ ...form, parking: e.target.value })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>가격(매매가)<input type="number" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          {form.deal_type === 'monthly' && (
            <>
              <label>보증금<input type="number" value={form.deposit ?? ''} onChange={(e) => setForm({ ...form, deposit: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
              <label>월세<input type="number" value={form.rent ?? ''} onChange={(e) => setForm({ ...form, rent: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
            </>
          )}
          <label>입주가능일<input type="date" value={form.available_from ?? ''} onChange={(e) => setForm({ ...form, available_from: e.target.value })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>관리비<input type="number" value={form.maintenance_fee ?? ''} onChange={(e) => setForm({ ...form, maintenance_fee: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>위도<input type="number" value={form.lat ?? ''} onChange={(e) => setForm({ ...form, lat: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>경도<input type="number" value={form.lng ?? ''} onChange={(e) => setForm({ ...form, lng: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>담당자<input value={form.assignee ?? ''} onChange={(e) => setForm({ ...form, assignee: e.target.value })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
          <label>태그(콤마구분)<input value={form.tags ?? ''} onChange={(e) => setForm({ ...form, tags: e.target.value })} style={{ marginLeft: 8 }} className="border px-2 py-1 bg-white text-black"/></label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            상태
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ marginLeft: 8 }}
            >
              <option value="draft">임시저장</option>
              <option value="review">검토중</option>
              <option value="published">공개</option>
              <option value="in_contract">계약중</option>
              <option value="closed">종료</option>
            </select>
          </label>
        </div>
        <button type="submit">저장</button>
        </div>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      <p style={{ marginTop: 12 }}>
        <a href="/properties">목록으로</a>
      </p>
    </section>
  );
}
