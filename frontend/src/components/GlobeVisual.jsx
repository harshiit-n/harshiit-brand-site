const DOTS = [
  { x: 118, y: 152 },
  { x: 200, y: 122 },
  { x: 262, y: 168 },
  { x: 312, y: 196 },
  { x: 152, y: 262 },
  { x: 232, y: 282 },
];

const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
];

export default function GlobeVisual({ className = "" }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Stylized globe representing global deal sourcing coverage"
    >
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

      {/* Meridians */}
      <ellipse cx="200" cy="200" rx="90" ry="150" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="30" ry="150" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

      {/* Parallels */}
      <ellipse cx="200" cy="200" rx="150" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <ellipse cx="200" cy="140" rx="130" ry="15" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <ellipse cx="200" cy="260" rx="130" ry="15" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <ellipse cx="200" cy="90" rx="80" ry="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <ellipse cx="200" cy="310" rx="80" ry="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

      {/* Connector paths between sourcing points */}
      {LINKS.map(([a, b], i) => {
        const from = DOTS[a];
        const to = DOTS[b];
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 26;
        return (
          <path
            key={i}
            d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
        );
      })}

      {DOTS.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="4" className="globe-pulse" fill="var(--color-accent)" />
          <circle cx={d.x} cy={d.y} r="3.5" fill="var(--color-accent)" />
        </g>
      ))}
    </svg>
  );
}
