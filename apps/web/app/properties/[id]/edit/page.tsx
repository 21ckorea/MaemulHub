"use client";

import { useEffect, useState } from "react";

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const id = params.id;
  // Ensure absolute base and include '/api' prefix for Vercel serverless
  const baseEnv = process.env.NEXT_PUBLIC_API_BASE || '/api';
  const appBase = process.env.NEXT_PUBLIC_APP_BASE || (typeof window !== 'undefined' ? window.location.origin : '');
  let apiBase = baseEnv.startsWith('http') ? baseEnv : `${appBase}${baseEnv}`;
  if (!/\/(api)(\/|$)/.test(new URL(apiBase, appBase).pathname)) {
    apiBase = apiBase.replace(/\/?$/, '') + '/api';
  }
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    type: "apartment",
    address: "",
    deal_type: "sale",
    status: "draft",
    photos: [] as string[],
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
    tags: "" as any,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/properties/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const p = await res.json();
        if (!alive) return;
        setForm({
          type: p.type ?? "apartment",
          address: p.address ?? "",
          deal_type: p.dealType ?? "sale",
          status: p.status ?? "draft",
          complex_name: p.complexName ?? p.complex_name ?? "",
          area_supply: p.areaSupply ?? p.area_supply ?? undefined,
          area_exclusive: p.areaExclusive ?? p.area_exclusive ?? undefined,
          floor: p.floor ?? undefined,
          rooms: p.rooms ?? undefined,
          baths: p.baths ?? undefined,
          built_year: p.builtYear ?? p.built_year ?? undefined,
          parking: p.parking ?? "",
          price: p.price ?? undefined,
          deposit: p.deposit ?? undefined,
          rent: p.rent ?? undefined,
          available_from: p.availableFrom ? String(p.availableFrom).slice(0,10) : "",
          maintenance_fee: p.maintenanceFee ?? p.maintenance_fee ?? undefined,
          lat: p.lat ?? undefined,
          lng: p.lng ?? undefined,
          assignee: p.assignee ?? "",
          tags: Array.isArray(p.tags) ? (p.tags as string[]).join(',') : (p.tags ?? ''),
          photos: Array.isArray(p.photos)
            ? p.photos.map((u: string) => {
                if (!u) return u;
                u = u.replace(/\\/g, '/');
                if (u.startsWith('http://')) u = u.replace(/^http:\/\//, 'https://');
                if (u.startsWith('http')) return encodeURI(u);
                const full = u.startsWith('/') ? `${apiBase}${u}` : `${apiBase}/${u}`;
                return encodeURI(full);
              })
            : [],
        });
      } catch (e: any) {
        setMsg(`불러오기 오류: ${e.message || String(e)}`);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [apiBase, id]);

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
        .map((f: any) => f.url as string)
        .map((u: string) => {
          if (u.startsWith('http')) return u;
          if (u.startsWith('/')) return `${apiBase}${u}`;
          return `${apiBase}/${u}`;
        });
      setForm((prev: any) => ({ ...prev, photos: [...(prev.photos || []), ...urls] }));
      setMsg(null);
    } catch (err: any) {
      setMsg(`업로드 오류: ${err?.message || String(err)}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removePhoto(url: string) {
    setForm((prev: any) => ({ ...prev, photos: (prev.photos || []).filter((u: string) => u !== url) }));
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setForm((prev: any) => {
      const list = [...(prev.photos || [])];
      const j = index + dir;
      if (j < 0 || j >= list.length) return prev;
      const tmp = list[index];
      list[index] = list[j];
      list[j] = tmp;
      return { ...prev, photos: list };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      // build sanitized payload
      const payload: any = { ...form };
      // normalize tags
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      // drop empty date
      if (!payload.available_from) delete payload.available_from;
      // coerce numeric fields
      const numKeys = [
        'area_supply','area_exclusive','floor','rooms','baths','built_year',
        'price','deposit','rent','maintenance_fee','lat','lng'
      ];
      for (const k of numKeys) {
        if (payload[k] === '' || payload[k] == null) { delete payload[k]; continue; }
        const n = Number(payload[k]);
        if (Number.isFinite(n)) payload[k] = n; else delete payload[k];
      }
      // clear conflicting amounts by deal type
      if (payload.deal_type === 'sale') { delete payload.deposit; delete payload.rent; }
      if (payload.deal_type === 'jeonse') { delete payload.price; delete payload.rent; }
      if (payload.deal_type === 'monthly') { delete payload.price; }

      // drop empty strings generally
      for (const [k, v] of Object.entries(payload)) {
        if (v === '') delete payload[k];
      }

      const res = await fetch(`${apiBase}/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }
      setMsg("저장 완료");
    } catch (err: any) {
      setMsg(`오류: ${err.message || String(err)}`);
    }
  }

  if (loading) return <p>로딩중...</p>;

  return (
    <section>
      <h2>매물 수정</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            사진 관리
            <input type="file" accept="image/*" multiple onChange={onFilesSelected} style={{ marginLeft: 8 }} />
          </label>
          {uploading && <span style={{ marginLeft: 8 }}>업로드 중...</span>}
          {(form.photos?.length ?? 0) > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {form.photos.map((u: string, idx: number) => (
                <div key={u} style={{ position: 'relative' }}>
                  <img src={u} alt="photo" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <div style={{ position: 'absolute', top: 2, right: 2, display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => movePhoto(idx, -1)} title="앞으로" style={{ background: '#111', color: '#fff', borderRadius: 6, fontSize: 12, padding: '2px 6px' }}>↑</button>
                    <button type="button" onClick={() => movePhoto(idx, 1)} title="뒤로" style={{ background: '#111', color: '#fff', borderRadius: 6, fontSize: 12, padding: '2px 6px' }}>↓</button>
                    <button type="button" onClick={() => removePhoto(u)} title="삭제" style={{ background: '#b91c1c', color: '#fff', borderRadius: 6, fontSize: 12, padding: '2px 6px' }}>삭제</button>
                  </div>
                  {idx === 0 && <div style={{ position: 'absolute', left: 4, bottom: 4, background: '#000', color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 4 }}>커버</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            주소
            <input
              style={{ marginLeft: 8 }}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            단지명
            <input
              style={{ marginLeft: 8 }}
              value={form.complex_name ?? ''}
              onChange={(e) => setForm({ ...form, complex_name: e.target.value })}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>분양면적(㎡)<input type="number" value={form.area_supply ?? ''} onChange={(e) => setForm({ ...form, area_supply: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>전용면적(㎡)<input type="number" value={form.area_exclusive ?? ''} onChange={(e) => setForm({ ...form, area_exclusive: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>층<input type="number" value={form.floor ?? ''} onChange={(e) => setForm({ ...form, floor: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>방수<input type="number" value={form.rooms ?? ''} onChange={(e) => setForm({ ...form, rooms: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>욕실수<input type="number" value={form.baths ?? ''} onChange={(e) => setForm({ ...form, baths: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>준공년도<input type="number" value={form.built_year ?? ''} onChange={(e) => setForm({ ...form, built_year: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>주차<input value={form.parking ?? ''} onChange={(e) => setForm({ ...form, parking: e.target.value })} style={{ marginLeft: 8 }}/></label>
          <label>가격(매매가, 만원)<input type="number" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          {form.deal_type === 'monthly' && (
            <>
              <label>보증금(만원)<input type="number" value={form.deposit ?? ''} onChange={(e) => setForm({ ...form, deposit: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
              <label>월세(만원)<input type="number" value={form.rent ?? ''} onChange={(e) => setForm({ ...form, rent: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
            </>
          )}
          {form.deal_type === 'jeonse' && (
            <label>보증금(만원)<input type="number" value={form.deposit ?? ''} onChange={(e) => setForm({ ...form, deposit: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          )}
          {form.deal_type === 'sale' && null}
          <label>입주가능일<input type="date" value={form.available_from ?? ''} onChange={(e) => setForm({ ...form, available_from: e.target.value })} style={{ marginLeft: 8 }}/></label>
          <label>관리비(만원)<input type="number" value={form.maintenance_fee ?? ''} onChange={(e) => setForm({ ...form, maintenance_fee: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>위도<input type="number" value={form.lat ?? ''} onChange={(e) => setForm({ ...form, lat: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>경도<input type="number" value={form.lng ?? ''} onChange={(e) => setForm({ ...form, lng: e.target.value ? Number(e.target.value) : undefined })} style={{ marginLeft: 8 }}/></label>
          <label>담당자<input value={form.assignee ?? ''} onChange={(e) => setForm({ ...form, assignee: e.target.value })} style={{ marginLeft: 8 }}/></label>
          <label>태그(콤마구분)<input value={form.tags ?? ''} onChange={(e) => setForm({ ...form, tags: e.target.value })} style={{ marginLeft: 8 }}/></label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            유형
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ marginLeft: 8 }}
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
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
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
            >
              <option value="sale">매매</option>
              <option value="jeonse">전세</option>
              <option value="monthly">월세</option>
              <option value="lease">임대</option>
              <option value="rent">임차</option>
            </select>
          </label>
        </div>
        {form.deal_type === "monthly" && (
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <label>
              보증금
              <input
                type="number"
                value={form.deposit ?? ""}
                onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })}
                style={{ marginLeft: 8 }}
              />
            </label>
            <label>
              월세
              <input
                type="number"
                value={form.rent ?? ""}
                onChange={(e) => setForm({ ...form, rent: Number(e.target.value) })}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
        )}
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
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      <p style={{ marginTop: 12 }}>
        <a href={`/properties/${id}`}>상세로</a> · <a href="/properties">목록</a>
      </p>
    </section>
  );
}
