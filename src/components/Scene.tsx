"use client";
import { useEffect, useRef } from "react";
import Car from "./Car";
export default function Scene() {
  const sc = useRef<HTMLDivElement>(null), car = useRef<HTMLDivElement>(null), km = useRef<HTMLElement>(null), held = useRef(false);
  useEffect(() => {
    let sp = 0, raf = 0;
    const loop = () => {
      sp += ((held.current ? 1 : 0.15) - sp) * 0.05;
      const s = sc.current;
      if (s) { s.style.setProperty("--rd", (2.6 - sp * 2.2).toFixed(2) + "s"); s.style.setProperty("--wd", (0.7 - sp * 0.55).toFixed(2) + "s"); }
      if (car.current) car.current.style.transform = `translateX(${sp * 80}px)`;
      if (km.current) km.current.textContent = String(Math.round(sp * 160));
      raf = requestAnimationFrame(loop);
    };
    loop();
    const kd = (e: KeyboardEvent) => { if (e.code === "Space" && !/INPUT|SELECT|TEXTAREA|BUTTON/.test((e.target as HTMLElement).tagName)) { held.current = true; e.preventDefault(); } };
    const ku = (e: KeyboardEvent) => { if (e.code === "Space") held.current = false; };
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
  }, []);
  const on = () => { held.current = true; }, off = () => { held.current = false; };
  return (
    <div className="scene" ref={sc}>
      <div className="skyline" /><div className="road" />
      <div className="car" ref={car}><div className="bob"><Car /></div></div>
      <div className="hud"><b ref={km}>0</b> km/h</div>
      <button className="btn gas" onPointerDown={on} onPointerUp={off} onPointerLeave={off} onPointerCancel={off} onContextMenu={(e) => e.preventDefault()}>Hold to drive</button>
    </div>
  );
}
