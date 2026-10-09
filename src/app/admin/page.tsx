import { db, rp } from "@/lib/db";
import { STATUSES } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const [os, ps] = await Promise.all([db.order.findMany({ orderBy: { id: "desc" } }), db.product.findMany({ orderBy: { stock: "asc" } })]);
  const live = os.filter((o) => o.status !== "Cancelled"), rev = live.reduce((a, o) => a + o.total, 0);
  const cnt = (s: string) => os.filter((o) => o.status === s).length, mx = Math.max(1, ...STATUSES.map(cnt));
  const low = ps.filter((p) => p.stock < 20);
  const K = [["k1", "Revenue", rp(rev), "Excludes cancelled"], ["k2", "Orders", String(os.length), `${cnt("New")} new`], ["k3", "Average order", rp(live.length ? Math.round(rev / live.length) : 0), "Per active order"], ["k4", "Low stock", String(low.length), "Under 20 units"]];
  return (
    <>
      <div className="ad-h"><h1>Dashboard</h1><p>Overview of the Anargya shop.</p></div>
      <div className="kgrid">{K.map(([c, l, v, s]) => <div className={`kpi ${c}`} key={l}><small>{l}</small><b>{v}</b><span>{s}</span></div>)}</div>
      <div className="two">
        <section className="pn"><h3>Orders by status</h3>
          {STATUSES.map((s) => <div className={`bar s-${s}`} key={s}><span>{s}</span><div><i style={{ width: `${(cnt(s) / mx) * 100}%` }} /></div><b>{cnt(s)}</b></div>)}
        </section>
        <section className="pn"><h3>Low stock</h3>
          {low.map((p) => <div className="li2" key={p.id}><span>{p.name}</span><span className={`pill ${p.stock ? "st-low" : "st-out"}`}>{p.stock ? `${p.stock} left` : "Out of stock"}</span></div>)}
          {!low.length && <p>All products are well stocked.</p>}
        </section>
      </div>
      <section className="pn"><h3>Recent orders</h3>
        {os.slice(0, 5).map((o) => <div className="li2" key={o.id}><span>#{o.id} · {o.customer}</span><span>{rp(o.total)}</span><span className={`bd s-${o.status}`}>{o.status}</span></div>)}
        {!os.length && <p>No orders yet.</p>}
      </section>
    </>
  );
}