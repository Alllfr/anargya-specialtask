import Link from "next/link";
export default function Offline() {
  return (
    <section className="pg">
      <h1>You are offline</h1>
      <p className="lead">This page has not been saved yet. Pages you visited before still work, and orders you place are sent when you reconnect.</p>
      <div className="row"><Link className="btn" href="/">Home</Link><Link className="btn ghost" href="/shop">Shop</Link></div>
    </section>
  );
}