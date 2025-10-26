"use client";

import { useToast } from "./ToastProvider";

export default function SharePublicActions({ token, address, phone }: { token: string; address: string; phone?: string }) {
  const { show } = useToast();

  const copyLink = async () => {
    const url = `${location.origin}/share/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      show("링크가 복사되었습니다", "success");
    } catch {
      show("복사 실패", "error");
    }
  };

  const openMap = (provider: "google" | "naver" | "kakao") => {
    const q = encodeURIComponent(address);
    let url = ``;
    if (provider === "google") url = `https://www.google.com/maps/search/?api=1&query=${q}`;
    if (provider === "naver") url = `https://map.naver.com/v5/search/${q}`;
    if (provider === "kakao") url = `https://map.kakao.com/?q=${q}`;
    window.open(url, "_blank");
  };

  const onPrint = () => {
    try {
      window.print();
    } catch {}
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copyLink} className="border px-3 py-1">링크 복사</button>
      <button type="button" onClick={() => openMap("google")} className="border px-3 py-1">구글 지도</button>
      <button type="button" onClick={() => openMap("naver")} className="border px-3 py-1">네이버 지도</button>
      <button type="button" onClick={() => openMap("kakao")} className="border px-3 py-1">카카오 지도</button>
      {phone && (
        <a href={`tel:${phone}`} className="border px-3 py-1">전화하기</a>
      )}
      <button type="button" onClick={onPrint} className="border px-3 py-1">인쇄</button>
    </div>
  );
}
