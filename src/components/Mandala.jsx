// ─────────────────────────────────────────────────────────────────────────────
// Mandala.jsx  —  Animated SVG mandala used on the landing hero
// ─────────────────────────────────────────────────────────────────────────────

export default function Mandala({ size = 72 }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  const dots   = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" stroke="rgba(232,200,112,0.12)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="36" stroke="rgba(212,101,26,0.18)"  strokeWidth="0.5" />
      <circle cx="50" cy="50" r="24" stroke="rgba(232,200,112,0.22)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="12" stroke="rgba(212,101,26,0.30)"  strokeWidth="0.5" />

      {spokes.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={50 + 12 * Math.cos(r)} y1={50 + 12 * Math.sin(r)}
            x2={50 + 48 * Math.cos(r)} y2={50 + 48 * Math.sin(r)}
            stroke="rgba(232,200,112,0.10)" strokeWidth="0.5"
          />
        );
      })}

      {dots.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={50 + 36 * Math.cos(r)}
            cy={50 + 36 * Math.sin(r)}
            r="1.4"
            fill="rgba(212,101,26,0.38)"
          />
        );
      })}

      <circle cx="50" cy="50" r="3.5" fill="rgba(232,200,112,0.55)" />
      <circle cx="50" cy="50" r="1.5" fill="rgba(232,200,112,0.90)" />
    </svg>
  );
}
