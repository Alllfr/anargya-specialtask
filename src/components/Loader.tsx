"use client";
import { useEffect, useState } from "react";
export default function Loader() {
  const [p, setP] = useState(0), [gone, setGone] = useState(false), [show, setShow] = useState(true);
  useEffect(() => {
    try { if (sessionStorage.getItem("ag_ld")) { setShow(false); return; } } catch {}
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(100, v + Math.random() * 9); setP(v);
      if (v >= 100) { clearInterval(t); setTimeout(() => { setGone(true); try { sessionStorage.setItem("ag_ld", "1"); } catch {} setTimeout(() => setShow(false), 700); }, 400); }
    }, 90);
    return () => clearInterval(t);
  }, []);
  if (!show) return null;
  return (
    <div className={"ld" + (gone ? " x" : "")} role="status" aria-label="Loading">
      <img src="/logo.jpg" alt="Anargya ITS Formula EV Team" />
      <div className="bat"><i style={{ width: p + "%" }} /></div>
      <b>{Math.floor(p)}%</b>
    </div>
  );
}
