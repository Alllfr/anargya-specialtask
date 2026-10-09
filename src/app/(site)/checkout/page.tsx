"use client";
import { useState } from "react";
import { useCart } from "@/components/Cart";
import { createOrder } from "@/app/actions";
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");
export default function Checkout() {
  const { lines, add, dec, clear, total } = useCart();
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  async function submit(f: FormData) {
    const order = { customer: String(f.get("customer") || ""), address: String(f.get("address") || ""), items: lines.map((l) => ({ id: l.id, qty: l.qty })) };
    if (!order.customer.trim() || !order.address.trim() || !order.items.length) return setMsg("Add items and fill in your name and address first.");
    if (!navigator.onLine) {
      const q = JSON.parse(localStorage.getItem("ag_queue") || "[]"); q.push(order); localStorage.setItem("ag_queue", JSON.stringify(q));
      clear(); setDone(true); return setMsg("Saved offline. It will be sent when you are back online.");
    }
    const r = await createOrder(order);
    if (!r.ok) return setMsg(r.error);
    clear(); setDone(true); setMsg(`Order #${r.id} received. Thank you!`);
  }
  if (done) return <section className="pg"><h1>{msg}</h1></section>;
  return (
    <section className="pg">
      <h1>Your cart</h1>
      {!lines.length && <p className="lead">Your cart is empty. Pick something from the shop.</p>}
      {lines.map((l) => (
        <div className="tr" key={l.id}><span className="wide">{l.name}</span><span>{rp(l.price * l.qty)}</span>
          <span><button className="btn sm ghost" aria-label="Decrease" onClick={() => dec(l.id)}>−</button> {l.qty} <button className="btn sm ghost" aria-label="Increase" onClick={() => add(l)}>+</button></span></div>
      ))}
      <form action={submit} className="form">
        <p><b>Total {rp(total)}</b></p>
        <input name="customer" placeholder="Full name" aria-label="Full name" />
        <input name="address" placeholder="Shipping address" aria-label="Shipping address" />
        {msg && <p role="alert">{msg}</p>}
        <button className="btn">Place order</button>
      </form>
    </section>
  );
}
