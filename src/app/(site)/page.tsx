import Link from "next/link";
import Scene from "@/components/Scene";
import { STATS } from "@/lib/data";
export default function Home() {
  return (
    <section className="pg">
      <h1>Born in Surabaya,<br />driven by electric.</h1>
      <p className="lead">Anargya is the ITS Formula EV Team: students from Institut Teknologi Sepuluh Nopember building electric formula race cars since 2018.</p>
      <div className="row"><Link className="btn" href="/shop">Open the shop</Link><Link className="btn ghost" href="/cars">Meet the cars</Link></div>
      <Scene />
      <div className="grid">{STATS.map(([v, l]) => <div className="card tilt" key={l}><div className="big">{v}</div><small>{l}</small></div>)}</div>
      <h2>About Anargya</h2>
      <p className="lead">Anargya means "infinite value". It is a student research team under the Center of Excellence for Automotive Control (PUI-SKO) at ITS. The team designs and builds electric formula cars and competes in Formula SAE Japan, FSAE Australasia, and Formula Bharat, with support from partners including Vale Indonesia.</p>
    </section>
  );
}
