"use client";
import { useEffect, useRef, useState } from "react";
import { createOrder } from "@/app/actions";

const WARM = ["/offline", "/", "/shop", "/team", "/cars", "/results", "/checkout"];
const queued = (): any[] => { try { return JSON.parse(localStorage.getItem("ag_queue") || "[]"); } catch { return []; } };

export default function Pwa() {
  const [off, setOff] = useState(false);
  const [msg, setMsg] = useState("");
  const [waiting, setWaiting] = useState(0);
  const [ev, setEv] = useState<any>(null);
  const was = useRef(false);

  useEffect(() => {
    // Register the service worker, then save every main page so it still opens offline.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(async () => {
        for (const u of WARM) { if (!navigator.onLine) break; try { await fetch(u); } catch {} }
      }).catch(() => {});
    }
    const sync = async () => {
      const offline = !navigator.onLine;
      setOff(offline); setWaiting(queued().length);
      if (offline) { was.current = true; return; }
      const rest: any[] = []; let sent = 0, failed = 0;
      for (const o of queued()) {
        try { const r = await createOrder(o); if (r.ok) sent++; else failed++; } catch { rest.push(o); }
      }
      try { localStorage.setItem("ag_queue", JSON.stringify(rest)); } catch {}
      setWaiting(rest.length);
      if (was.current) {
        was.current = false;
        setMsg(`Back online.${sent ? ` ${sent} order(s) sent.` : ""}${failed ? ` ${failed} order(s) could not be sent (stock changed).` : ""}`);
        setTimeout(() => setMsg(""), 5000);
      }
    };
    const bip = (e: Event) => { e.preventDefault(); setEv(e); };
    const tick = setInterval(() => setWaiting(queued().length), 2000);
    sync(); addEventListener("online", sync); addEventListener("offline", sync); addEventListener("beforeinstallprompt", bip);
    return () => { clearInterval(tick); removeEventListener("online", sync); removeEventListener("offline", sync); removeEventListener("beforeinstallprompt", bip); };
  }, []);

  return (
    <>
      {(off || msg) && (
        <div className="offline" role="status">
          {off ? `You are offline. Saved pages still work. ${waiting ? `${waiting} order(s) waiting to send.` : "Orders will be sent when you reconnect."}` : msg}
        </div>
      )}
      {ev && (
        <div className="sheet">
          <b>Install Anargya</b><p>Quick access, just like an app.</p>
          <button className="btn" onClick={() => { ev.prompt(); setEv(null); }}>Install</button>{" "}
          <button className="btn ghost" onClick={() => setEv(null)}>Later</button>
        </div>
      )}
    </>
  );
}