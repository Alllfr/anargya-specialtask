"use client";
import { useEffect, useRef, useState } from "react";
import { createOrder } from "@/app/actions";

const WARM = ["/offline", "/", "/shop", "/team", "/cars", "/results", "/checkout"];
const ASSET = /\/_next\/static\/[^"'\\\s)(<>]+/g;
const queued = (): any[] => { try { return JSON.parse(localStorage.getItem("ag_queue") || "[]"); } catch { return []; } };

// Fetch every page plus the CSS, JS, and font files it uses, so the service worker saves them all.
async function warm() {
  const seen = new Set<string>();
  const get = async (u: string) => {
    if (seen.has(u) || !navigator.onLine) return "";
    seen.add(u);
    try {
      const r = await fetch(u);
      return r.ok && /text|javascript|json/.test(r.headers.get("content-type") || "") ? await r.text() : "";
    } catch { return ""; }
  };
  for (const u of WARM) {
    const html = await get(u);
    for (const a of html.match(ASSET) || []) {
      const t = await get(a);
      for (const m of t.match(ASSET) || []) await get(m);
    }
  }
  for (const u of ["/mark.jpg", "/logo.jpg", "/icon.png", "/manifest.webmanifest"]) await get(u);
}

export default function Pwa() {
  const [off, setOff] = useState(false);
  const [msg, setMsg] = useState("");
  const [waiting, setWaiting] = useState(0);
  const [ev, setEv] = useState<any>(null);
  const was = useRef(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(async () => {
        if (!navigator.serviceWorker.controller)
          await new Promise<void>((res) => { navigator.serviceWorker.addEventListener("controllerchange", () => res(), { once: true }); setTimeout(res, 3000); });
        try { if (sessionStorage.getItem("ag_w")) return; sessionStorage.setItem("ag_w", "1"); } catch {}
        setTimeout(warm, 1500);
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