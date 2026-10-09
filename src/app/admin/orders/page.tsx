import { db, rp } from "@/lib/db";
import { setStatus } from "@/app/actions";
import { STATUSES } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Orders({ searchParams }: { searchParams: Promise<{ q?: string; s?: string }> }) {
  const { q = "", s = "" } = await searchParams;
  const os = await db.order.findMany({ where: { ...(s ? { status: s } : {}), ...(q ? { customer: { contains: q } } : {}) }, include: { items: { include: { product: true } } }, orderBy: { id: "desc" } });
  return (
    <>
      <div className="ad-h"><h1>Orders</h1><p>{os.length} order(s) shown. Change a status and press Update.</p></div>
      <form className="bar2">
        <input name="q" defaultValue={q} placeholder="Search customer" aria-label="Search customer" />
        <select name="s" defaultValue={s} aria-label="Status"><option value="">All statuses</option>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
        <button className="ab">Filter</button>
      </form>
      <div className="pn" style={{ padding: 0, overflow: "hidden" }}>
        <div className="orow ohead"><span>Order</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span></div>
        {os.map((o) => (
          <div className="orow" key={o.id}>
            <span><b>#{o.id}</b><br /><small>{o.createdAt.toISOString().slice(0, 10)}</small></span>
            <span>{o.customer}</span>
            <span>{o.items.map((i) => `${i.name || i.product?.name || "Deleted product"} ×${i.qty}`).join(", ")}</span>
            <span><b>{rp(o.total)}</b></span>
            <div style={{ display: "grid", gap: 8 }}>
              <span className={`bd s-${o.status}`}>{o.status}</span>
              <form action={setStatus} className="sf"><input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} aria-label="New status">{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
                <button className="ab sm">Update</button></form>
            </div>
          </div>
        ))}
        {!os.length && <p style={{ padding: 20 }}>No orders match your filters.</p>}
      </div>
    </>
  );
}