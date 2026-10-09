import { db, rp } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Customers() {
  const g = await db.order.groupBy({ by: ["customer"], where: { status: { not: "Cancelled" } }, _count: { _all: true }, _sum: { total: true }, orderBy: { _sum: { total: "desc" } } });
  return (
    <>
      <div className="ad-h"><h1>Customers</h1><p>Ranked by total spend, cancelled orders excluded.</p></div>
      <div className="pn" style={{ padding: 0, overflow: "hidden" }}>
        {g.map((c) => {
          const hue = [...c.customer].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
          return (
            <div className="cust" key={c.customer}>
              <span className="av" style={{ background: `hsl(${hue} 55% 38%)` }}>{c.customer.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
              <div><b>{c.customer}</b><br /><small style={{ color: "#8FA399" }}>{c._count._all} order(s)</small></div>
              <b style={{ color: "#2ECC71" }}>{rp(c._sum.total ?? 0)}</b>
            </div>
          );
        })}
        {!g.length && <p style={{ padding: 20 }}>No customers yet. They appear after the first order.</p>}
      </div>
    </>
  );
}