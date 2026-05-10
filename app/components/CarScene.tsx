"use client";

interface CarSceneProps {
  distance: number;
  isActive: boolean;
  statusColor: string;
}

export default function CarScene({ distance, isActive, statusColor }: CarSceneProps) {
  const maxDist = 80;
  const minY = 85;
  const maxY = 158;
  const t = Math.min(distance / maxDist, 1);
  const carY = minY + (maxY - minY) * t;
  const rearY = carY + 38;

  const beamTargets = [246, 266, 294, 314];
  const beamStartXs = [266, 276, 286, 296];

  const sensorColor = statusColor;
  const showBeams = isActive && distance < maxDist;

  return (
    <svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Wall */}
      <rect x="0" y="0" width="560" height="20" fill="#1e2530" rx="0" />
      <rect x="0" y="0" width="560" height="3" fill="#2d3748" />
      {/* Wall bolts */}
      {[40, 120, 200, 280, 360, 440, 520].map((x) => (
        <circle key={x} cx={x} cy="10" r="2" fill="#2d3748" />
      ))}

      {/* Ground grid */}
      {[80, 160, 240, 320, 400, 480].map((x) => (
        <line key={`vg-${x}`} x1={x} y1="20" x2={x} y2="210" stroke="#0f1520" strokeWidth="1" />
      ))}
      {[70, 120, 170].map((y) => (
        <line key={`hg-${y}`} x1="0" y1={y} x2="560" y2={y} stroke="#0f1520" strokeWidth="1" />
      ))}

      {/* Distance zone arcs */}
      <path d="M 280 20 m -55 0 a 55 55 0 0 1 110 0" fill="none" stroke={isActive ? "rgba(252,92,92,0.2)" : "rgba(252,92,92,0.05)"} strokeWidth="1" strokeDasharray="4,4" />
      <path d="M 280 20 m -100 0 a 100 100 0 0 1 200 0" fill="none" stroke={isActive ? "rgba(246,173,85,0.2)" : "rgba(246,173,85,0.05)"} strokeWidth="1" strokeDasharray="4,4" />
      <path d="M 280 20 m -150 0 a 150 150 0 0 1 300 0" fill="none" stroke={isActive ? "rgba(0,200,122,0.2)" : "rgba(0,200,122,0.05)"} strokeWidth="1" strokeDasharray="4,4" />

      {/* Zone labels */}
      {isActive && (
        <>
          <text x="340" y="72" fill="rgba(252,92,92,0.5)" fontSize="9" fontFamily="Share Tech Mono">PERIGO</text>
          <text x="387" y="117" fill="rgba(246,173,85,0.5)" fontSize="9" fontFamily="Share Tech Mono">ATENÇÃO</text>
          <text x="434" y="167" fill="rgba(0,200,122,0.5)" fontSize="9" fontFamily="Share Tech Mono">SEGURO</text>
        </>
      )}

      {/* Sensor beams */}
      {showBeams && beamStartXs.map((sx, i) => (
        <line
          key={`beam-${i}`}
          x1={sx} y1={rearY}
          x2={beamTargets[i]} y2="20"
          stroke={sensorColor}
          strokeWidth="0.8"
          opacity="0.4"
          strokeDasharray="4,5"
          className="beam-line"
        />
      ))}

      {/* Car group */}
      <g transform={`translate(280, ${carY})`} style={{ transition: 'transform 0.15s ease-out' }}>
        {/* Car body */}
        <rect x="-30" y="-55" width="60" height="93" rx="9" fill="#1a1f2a" stroke="#2d3748" strokeWidth="1" />
        {/* Hood detail */}
        <rect x="-18" y="-48" width="36" height="4" rx="2" fill="#252d3a" />
        {/* Windshield front */}
        <rect x="-22" y="-44" width="44" height="20" rx="4" fill="#0a1525" stroke="#1e2530" strokeWidth="0.5" />
        {/* Dashboard line */}
        <line x1="-22" y1="-24" x2="22" y2="-24" stroke="#2d3748" strokeWidth="0.5" />
        {/* Center stripe */}
        <line x1="0" y1="-55" x2="0" y2="38" stroke="#252d3a" strokeWidth="1" />
        {/* Rear window */}
        <rect x="-18" y="10" width="36" height="14" rx="3" fill="#0a1525" stroke="#1e2530" strokeWidth="0.5" />
        {/* Trunk */}
        <rect x="-22" y="26" width="44" height="10" rx="2" fill="#141820" stroke="#2d3748" strokeWidth="0.5" />
        {/* Stop lights */}
        <rect x="-30" y="28" width="10" height="8" rx="2" fill={isActive ? "#fc5c5c" : "#3a1515"} />
        <rect x="20" y="28" width="10" height="8" rx="2" fill={isActive ? "#fc5c5c" : "#3a1515"} />
        {/* Sensor dots */}
        {[-16, -5, 5, 16].map((x, i) => (
          <circle
            key={`sd-${i}`}
            cx={x}
            cy={39}
            r="2.5"
            fill={isActive ? sensorColor : "#2d3748"}
            style={{ transition: 'fill 0.3s' }}
          />
        ))}
        {/* Sensor bar */}
        <rect x="-22" y="36" width="44" height="6" rx="1" fill="none" stroke={isActive ? `${sensorColor}33` : "transparent"} strokeWidth="1" />
        {/* Wheels */}
        {[[-39, -42], [29, -42], [-39, 18], [29, 18]].map(([wx, wy], i) => (
          <rect key={`w-${i}`} x={wx} y={wy} width="10" height="22" rx="3" fill="#0c1018" stroke="#2d3748" strokeWidth="0.5" />
        ))}
        {/* Wheel rims */}
        {[[-34, -31], [34, -31], [-34, 29], [34, 29]].map(([cx, cy], i) => (
          <circle key={`wr-${i}`} cx={cx} cy={cy} r="3.5" fill="none" stroke="#1e2530" strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}
