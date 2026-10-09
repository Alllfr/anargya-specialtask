"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const L = [
  ["/admin", "Dashboard", "M3 12l9-8 9 8M5 10v10h14V10"],
  ["/admin/orders", "Orders", "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"],
  ["/admin/products", "Products", "M21 8l-9-5-9 5 9 5zM3 8v8l9 5 9-5V8"],
  ["/admin/customers", "Customers", "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 8a3 3 0 010 6M21 20a5 5 0 00-4-5"],
];
export default function AdminNav() {
  const p = usePathname();
  return (
    <nav className="ad-nav">
      {L.map(([h, l, d]) => (
        <Link key={h} href={h} className={p === h ? "on" : ""}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>{l}
        </Link>
      ))}
    </nav>
  );
}