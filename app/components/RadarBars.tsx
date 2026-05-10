"use client";

interface RadarBarsProps {
  distance: number;
  isActive: boolean;
  color: string;
}

export default function RadarBars({ distance, isActive, color }: RadarBarsProps) {
  const BARS = 9;
  const maxH = 40;
  const minH = 5;

  return (
    <div style={{
      display: 'flex',
      gap: '5px',
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: '48px',
    }}>
      {Array.from({ length: BARS }, (_, i) => {
        const center = (BARS - 1) / 2;
        const spread = 1 - Math.abs(i - center) / center;
        const t = isActive ? (1 - Math.min(distance / 80, 1)) : 0;
        const h = minH + (maxH - minH) * t * (0.3 + 0.7 * spread);
        return (
          <div
            key={i}
            style={{
              width: '20px',
              height: `${Math.round(h)}px`,
              background: isActive && t > 0.1 ? color + '99' : '#1e2530',
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.15s ease, background 0.3s',
            }}
          />
        );
      })}
    </div>
  );
}
