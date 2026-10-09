const P: Record<string, string> = { tee: "M30 24l20-10q10 10 20 0l20 10 12 22-14 6v44H32V52L18 46z", cap: "M20 70q0-40 40-40t40 40zM12 74h96q0 6-6 6H18q-6 0-6-6z", bot: "M48 16h24v14l8 10v64H40V40l8-10z", stk: "M60 12l40 22v44L60 108 20 78V34z" };
export default function Art({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" style={{ maxHeight: 150 }} aria-hidden>
      <path d={P[kind] ?? P.stk} fill="#12261b" stroke="#2ECC71" strokeWidth="2.5" />
      <path d="M64 44 50 68h10l-4 16 16-26H62z" fill="#2ECC71" />
    </svg>
  );
}
