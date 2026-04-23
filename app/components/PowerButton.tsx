"use client";

interface PowerButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function PowerButton({ isActive, onToggle }: PowerButtonProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer ring */}
      {isActive && (
        <div
          className="power-ring"
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '1px solid var(--color-green)',
            opacity: 0.3,
          }}
        />
      )}
      {/* Middle ring */}
      <div style={{
        position: 'absolute',
        width: '86px',
        height: '86px',
        borderRadius: '50%',
        border: `1px solid ${isActive ? 'var(--color-green)' : 'var(--color-border)'}`,
        opacity: 0.4,
        transition: 'border-color 0.4s',
      }} />

      {/* Main button */}
      <button
        onClick={onToggle}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: `2px solid ${isActive ? 'var(--color-green)' : 'var(--color-border2)'}`,
          background: isActive ? 'rgba(0,200,122,0.08)' : '#0f1115',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.35s',
          boxShadow: isActive ? '0 0 24px rgba(0,200,122,0.3), inset 0 0 16px rgba(0,200,122,0.06)' : 'none',
          outline: 'none',
          position: 'relative',
          zIndex: 1,
        }}
        aria-label={isActive ? 'Desligar sensor' : 'Ligar sensor'}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? 'var(--color-green)' : 'var(--color-muted)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'stroke 0.35s',
            filter: isActive ? 'drop-shadow(0 0 6px var(--color-green))' : 'none',
          }}
        >
          <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      </button>
    </div>
  );
}
