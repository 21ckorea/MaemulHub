"use client";

import { useState } from "react";

export default function SharePhotosCarousel({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  if (!photos || photos.length === 0) return null;
  const go = (d: number) => setIdx((i) => (i + d + photos.length) % photos.length);
  const sel = (i: number) => setIdx(i);
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <img src={photos[idx]} alt={`photo-${idx+1}`} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Prev" style={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', background: '#111', color: '#fff', borderRadius: 6, padding: '6px 10px', opacity: 0.85 }}>
              ◀
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next" style={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', background: '#111', color: '#fff', borderRadius: 6, padding: '6px 10px', opacity: 0.85 }}>
              ▶
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {photos.map((u, i) => (
            <button key={u} type="button" onClick={() => sel(i)} style={{ outline: idx === i ? '2px solid #7c3aed' : 'none', borderRadius: 8 }}>
              <img src={u} alt={`thumb-${i+1}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
