import { db, rp } from "@/lib/db";
import Art from "@/components/Art";
import { adjustStock, deleteProduct, saveProduct } from "@/app/actions";
export const dynamic = "force-dynamic";
const Fields = ({ p }: { p?: { name: string; category: string; price: number; stock: number; kind: string } }) => (
  <>
    <label>Name<input name="name" defaultValue={p?.name} required /></label>
    <label>Price (Rp)<input name="price" type="number" min="1" defaultValue={p?.price} required /></label>
    <label>Stock<input name="stock" type="number" min="0" defaultValue={p?.stock ?? 0} required /></label>
    <label>Category<select name="category" defaultValue={p?.category ?? "Apparel"}><option>Apparel</option><option>Accessories</option></select></label>
    <label>Icon<select name="kind" defaultValue={p?.kind ?? "tee"}><option value="tee">Tee</option><option value="cap">Cap</option><option value="bot">Bottle</option><option value="stk">Sticker</option></select></label>
  </>
);
export default async function Products() {
  const ps = await db.product.findMany({ orderBy: { id: "asc" } });
  return (
    <>
      <div className="ad-h"><h1>Products</h1><p>{ps.length} product(s). Stock can go to zero and be raised again at any time.</p></div>
      <details className="pn add"><summary>+ Add a new product</summary><form action={saveProduct} className="fgrid"><Fields /><button className="ab">Add product</button></form></details>
      <div className="pgrid">
        {ps.map((p) => {
          const st = p.stock === 0 ? "st-out" : p.stock < 20 ? "st-low" : "st-ok";
          return (
            <div className="pc" key={p.id}>
              <div className="pc-top">
                <div className="pc-art"><Art kind={p.kind} /></div>
                <div><b>{p.name}</b><small>{p.category}</small><span className="pc-price">{rp(p.price)}</span></div>
                <span className={`pill ${st}`}>{p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}</span>
              </div>
              <div className="pc-stock"><span>Stock</span>
                <div className="step">
                  <form action={adjustStock.bind(null, p.id, -10)}><button className="ab sm gh">−10</button></form>
                  <form action={adjustStock.bind(null, p.id, -1)}><button className="ab sm gh" aria-label="Decrease stock">−</button></form>
                  <b>{p.stock}</b>
                  <form action={adjustStock.bind(null, p.id, 1)}><button className="ab sm" aria-label="Increase stock">+</button></form>
                  <form action={adjustStock.bind(null, p.id, 10)}><button className="ab sm">+10</button></form>
                </div>
              </div>
              <details><summary>Edit details</summary>
                <form action={saveProduct} className="fgrid"><input type="hidden" name="id" value={p.id} /><Fields p={p} /><button className="ab">Save changes</button></form>
              </details>
              <details className="danger"><summary>Delete product</summary>
                <p>This removes the product permanently. Past orders keep its name.</p>
                <form action={deleteProduct.bind(null, p.id)}><button className="ab dg sm">Yes, delete it</button></form>
              </details>
            </div>
          );
        })}
      </div>
    </>
  );
}