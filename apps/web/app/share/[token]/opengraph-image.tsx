import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

async function fetchPublic(token: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";
  try {
    const res = await fetch(`${base}/share-links/public/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatPrice(p: any) {
  if (p?.price != null) return `${Number(p.price).toLocaleString()}만원`;
  const parts: string[] = [];
  if (p?.deposit != null) parts.push(`보증금 ${Number(p.deposit).toLocaleString()}만원`);
  if (p?.rent != null) parts.push(`월세 ${Number(p.rent).toLocaleString()}만원`);
  return parts.join(" / ") || "-";
}

export default async function OGImage({ params }: { params: { token: string } }) {
  const data = await fetchPublic(params.token);
  const p = data?.property;
  const address = p?.address || "공유 매물";
  const price = p ? formatPrice(p) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          color: "#fff",
          fontFamily:
            'Pretendard, "Noto Sans KR", Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.9 }}>MaemulHub</div>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, marginTop: 12, maxWidth: 960 }}>
          {address}
        </div>
        <div style={{ fontSize: 34, marginTop: 16, opacity: 0.95 }}>{price}</div>
        {data?.expiresAt && (
          <div style={{ fontSize: 20, marginTop: 12, opacity: 0.8 }}>
            만료: {new Date(data.expiresAt).toLocaleDateString("ko-KR")}
          </div>
        )}
        <div style={{ position: "absolute", right: 48, bottom: 36, fontSize: 22, opacity: 0.9 }}>
          share/{params.token}
        </div>
      </div>
    ),
    { ...size }
  );
}
