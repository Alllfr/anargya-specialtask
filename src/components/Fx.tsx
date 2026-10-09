"use client";
import { useEffect, useRef } from "react";
export default function Fx() {
  const g = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last: HTMLElement | null = null;
    const m = (e: MouseEvent) => {
      if (g.current) g.current.style.transform = `translate(${e.clientX - 150}px,${e.clientY - 150}px)`;
      const c = (e.target as HTMLElement).closest?.<HTMLElement>(".tilt") ?? null;
      if (last && last !== c) last.style.transform = "";
      if (c) { const b = c.getBoundingClientRect(); c.style.transform = `perspective(700px) rotateY(${((e.clientX - b.left) / b.width - 0.5) * 8}deg) rotateX(${-((e.clientY - b.top) / b.height - 0.5) * 8}deg)`; }
      last = c;
    };
    addEventListener("mousemove", m);
    return () => removeEventListener("mousemove", m);
  }, []);
  return <div className="glow" ref={g} aria-hidden />;
}
