import { db, rp } from "@/lib/db";
import Art from "@/components/Art";
import { AddButton } from "@/components/Cart";
export const dynamic = "force-dynamic";
export const metadata = { title: "Shop – Anargya" };
export default async function Shop() {
  const ps = await db.product.findMany({ orderBy: { id: "asc" } });
  return (
    <section className="pg">
      <h1>Official merch</h1>
      <div className="grid">{ps.map((p) => (
        <div className="card" key={p.id}>
          <div className="art"><Art kind={p.kind} /></div>
          <b>{p.name}</b><br /><small>{p.category} · {p.stock > 0 ? `${p.stock} in stock` : "Sold out"}</small>
          <div className="between"><span className="g">{rp(p.price)}</span><AddButton id={p.id} name={p.name} price={p.price} stock={p.stock} /></div>
        </div>))}
      </div>
    </section>
  );
}
