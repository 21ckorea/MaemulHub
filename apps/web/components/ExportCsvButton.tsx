"use client";

import { useState } from "react";

function toCsvValue(v: any) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export default function ExportCsvButton({
  kind,
  searchParams,
  filename,
}: {
  kind: "properties" | "customers" | "inquiries" | "contracts";
  searchParams: Record<string, string | string[] | undefined>;
  filename: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";

  const TYPE_LABEL: Record<string, string> = {
    apartment: '아파트', officetel: '오피스텔', store: '상가', land: '토지', multifamily: '다가구', villa: '빌라',
  };
  const DEAL_LABEL: Record<string, string> = {
    sale: '매매', jeonse: '전세', monthly: '월세', lease: '임대', rent: '임차',
  };
  const PSTATUS_LABEL: Record<string, string> = {
    draft: '임시저장', review: '검토중', published: '공개', in_contract: '계약중', closed: '종료',
  };
  const ISTATUS_LABEL: Record<string, string> = { new: '새 요청', in_progress: '진행중', closed: '종료' };
  const ISOURCE_LABEL: Record<string, string> = { web: '웹', phone: '전화', referral: '지인추천', kakao: '카카오' };
  const CTYPE_LABEL: Record<string, string> = { lease: '임대', rent: '임차', sale: '매매' };
  const CSTATUS_LABEL: Record<string, string> = { draft: '임시저장', signed: '서명완료', cancelled: '취소' };

  const buildParams = (page: number, pageSize: number) => {
    const usp = new URLSearchParams();
    // carry over filters from current page
    for (const [k, v] of Object.entries(searchParams || {})) {
      if (v === undefined) continue;
      if (k === "page" || k === "pageSize") continue;
      usp.set(k, Array.isArray(v) ? v[0] : v);
    }
    usp.set("page", String(page));
    usp.set("pageSize", String(pageSize));
    return usp;
  };

  async function fetchAll(): Promise<any[]> {
    const pageSize = 200;
    let page = 1;
    let all: any[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const usp = buildParams(page, pageSize);
      const res = await fetch(`${base}/${kind}?${usp.toString()}`);
      if (!res.ok) throw new Error("export fetch failed");
      const data = await res.json();
      const items = data.items || [];
      all = all.concat(items);
      if (all.length >= (data.total || items.length)) break;
      if (items.length < pageSize) break;
      page += 1;
    }
    return all;
  }

  type Header = { key: string; label: string; get?: (row: any) => any };
  const headersByKind: Record<string, Header[]> = {
    properties: [
      { key: "type", label: "유형", get: (r) => TYPE_LABEL[r.type] || r.type },
      { key: "complexName", label: "단지명", get: (r) => r.complexName ?? r.complex_name ?? '' },
      { key: "address", label: "주소" },
      { key: "dealType", label: "거래", get: (r) => r.dealType ? (DEAL_LABEL[r.dealType] || r.dealType) : '' },
      { key: "price", label: "가격" },
      { key: "assignee", label: "등록자" },
      { key: "status", label: "상태", get: (r) => PSTATUS_LABEL[r.status] || r.status },
      { key: "createdAt", label: "생성" },
    ],
    customers: [
      { key: "name", label: "이름" },
      { key: "phone", label: "전화" },
      { key: "email", label: "이메일" },
      { key: "createdAt", label: "생성" },
    ],
    inquiries: [
      { key: "title", label: "제목" },
      { key: "source", label: "유입", get: (r) => ISOURCE_LABEL[r.source] || r.source },
      { key: "status", label: "상태", get: (r) => ISTATUS_LABEL[r.status] || r.status },
      { key: "assignee", label: "담당" },
      { key: "customer.name", label: "고객" },
      { key: "createdAt", label: "생성" },
    ],
    contracts: [
      { key: "type", label: "유형", get: (r) => CTYPE_LABEL[r.type] || r.type },
      { key: "status", label: "상태", get: (r) => CSTATUS_LABEL[r.status] || r.status },
      { key: "property.address", label: "매물주소" },
      { key: "customer.name", label: "고객" },
      { key: "amount", label: "금액", get: (r) => {
        const parts: string[] = [];
        if (r.price != null) parts.push(`${r.price}`);
        if (r.deposit != null) parts.push(`보증금 ${r.deposit}`);
        if (r.rent != null) parts.push(`월세 ${r.rent}`);
        return parts.join(" / ");
      } },
      { key: "signedAt", label: "서명일" },
      { key: "startAt", label: "시작일" },
      { key: "createdAt", label: "생성" },
    ],
  };

  const getByPath = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  const toCsv = (rows: any[]): string => {
    const headers = headersByKind[kind];
    const lines = [headers.map((h) => toCsvValue(h.label)).join(",")];
    for (const r of rows) {
      const line = headers
        .map((h) => {
          const v = h.get ? h.get(r) : getByPath(r, h.key);
          if (h.key.endsWith("At") && v) {
            try { return toCsvValue(new Date(v).toLocaleString('ko-KR')); } catch { return toCsvValue(v); }
          }
          return toCsvValue(v);
        })
        .join(",");
      lines.push(line);
    }
    return lines.join("\n");
  };

  async function onClick() {
    if (downloading) return;
    setDownloading(true);
    try {
      const rows = await fetchAll();
      const csv = toCsv(rows);
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("CSV 내보내기에 실패했습니다");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button type="button" onClick={onClick} className="btn btn-soft" disabled={downloading}>
      {downloading ? "내보내는 중..." : "CSV 내보내기"}
    </button>
  );
}
