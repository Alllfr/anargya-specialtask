import Car from "@/components/Car";
import { CARS } from "@/lib/data";
export const metadata = { title: "Cars – Anargya" };
export default function Cars() {
  return (
    <section className="pg">
      <h1>Six generations of Formula EV</h1>
      <div className="grid">{CARS.map((c, i) => (
        <div className="card tilt" key={c.n}>
          <div className="lane"><div className="drive" style={{ animationDelay: `-${i * 0.9}s` }}><Car color={c.c} /></div></div>
          <small className="g">{c.y}</small><h3>{c.n}</h3><p>{c.d}</p>
        </div>))}
      </div>
    </section>
  );
}
