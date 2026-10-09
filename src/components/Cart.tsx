"use client";
import "./cart.css";
import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type Line = { id: number; name: string; price: number; qty: number; stock: number };
type Ctx = { lines: Line[]; add: (l: Omit<Line, "qty">) => void; dec: (id: number) => void; clear: () => void; count: number; total: number };
const C = createContext<Ctx>(null!);
export const useCart = () => useContext(C);
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, set] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { set(JSON.parse(localStorage.getItem("ag_cart") || "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("ag_cart", JSON.stringify(lines)); } catch {} }, [lines, ready]);
  const add = (l: Omit<Line, "qty">) => set((s) => {
    const e = s.find((x) => x.id === l.id);
    if (e) return e.qty >= l.stock ? s : s.map((x) => (x.id === l.id ? { ...x, qty: x.qty + 1 } : x));
    return l.stock < 1 ? s : [...s, { id: l.id, name: l.name, price: l.price, stock: l.stock, qty: 1 }];
  });
  const dec = (id: number) => set((s) => s.flatMap((x) => (x.id !== id ? [x] : x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : [])));
  const value = { lines, add, dec, clear: () => set([]), count: lines.reduce((a, b) => a + b.qty, 0), total: lines.reduce((a, b) => a + b.qty * b.price, 0) };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/checkout" className="cartlink" aria-label={`Cart, ${count} items`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" /><circle cx="9.5" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>
      {count > 0 && <span className="cbadge">{count}</span>}
    </Link>
  );
}
export function AddButton(p: Omit<Line, "qty">) {
  const { add } = useCart();
  return <button className="btn" disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? "Sold out" : "Add to cart"}</button>;
}