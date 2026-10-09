export default function Car({ color = "#2ECC71" }: { color?: string }) {
  return (
    <svg viewBox="0 0 320 100" width="100%" aria-hidden>
      <path d="M10 78h50v6H10z" fill="#F4F1EC" />
      <path d="M22 72l40-18 60-6 48-18 40 4 6 16 66 8 14 14z" fill={color} />
      <path d="M150 34q22-18 46-4" stroke="#F4F1EC" strokeWidth="3" fill="none" />
      <path d="M262 28h44M284 28v28" stroke="#F4F1EC" strokeWidth="5" />
      <path d="M170 52l-8 14h9l-4 12 14-18h-9l5-8z" fill="#050606" />
      {[[72, 78, 18], [246, 76, 21]].map(([x, y, r]) => (
        <g key={x} className="wheel">
          <circle cx={x} cy={y} r={r} fill="#111" stroke="#F4F1EC" strokeWidth="3" />
          <path d={`M${x} ${y - r + 2}v${2 * r - 4}M${x - r + 2} ${y}h${2 * r - 4}`} stroke={color} strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
}
