export function formatManwon(n?: number | null): string {
  if (n == null) return "-";
  return `${n.toLocaleString('ko-KR')}만원`;
}

export function formatManwonCompact(n?: number | null): string {
  if (n == null) return "-";
  const v = Number(n);
  if (!Number.isFinite(v)) return "-";
  if (v >= 10000) {
    const dec = v / 10000;
    const s = dec.toFixed(1);
    const clean = s.endsWith('.0') ? s.slice(0, -2) : s;
    return `${clean}억`;
  }
  return `${v.toLocaleString('ko-KR')}만원`;
}

export function formatDepositRent(deposit?: number | null, rent?: number | null): string {
  const parts: string[] = [];
  if (deposit != null) parts.push(`보증금 ${deposit.toLocaleString('ko-KR')}만원`);
  if (rent != null) parts.push(`월세 ${rent.toLocaleString('ko-KR')}만원`);
  return parts.length ? parts.join(' / ') : '-';
}

export function formatSqmPyeong(sqm?: number | null): string {
  if (sqm == null) return "-";
  const pyeong = sqm / 3.3058;
  return `${sqm.toLocaleString('ko-KR')}㎡ (약 ${pyeong.toFixed(1)}평)`;
}

export function formatShortDate(v?: string | Date | null): string {
  if (!v) return '-';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '-';
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
}

export function formatPriceByDeal(
  dealType?: string | null,
  price?: number | null,
  deposit?: number | null,
  rent?: number | null
): string {
  const p = (n?: number | null) => (n == null ? null : formatManwonCompact(n));

  if (dealType === 'sale') {
    const v = p(price);
    return v ?? '-';
  }
  if (dealType === 'jeonse') {
    const v = p(deposit);
    return v ?? '-';
  }
  if (dealType === 'monthly') {
    const d = p(deposit);
    const r = p(rent);
    return d && r ? `${d} / ${r}` : '-';
  }
  // lease/rent/others fallback
  const v = p(price);
  return v ?? '-';
}
