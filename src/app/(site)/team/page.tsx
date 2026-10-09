import { DIVISIONS } from "@/lib/data";
export const metadata = { title: "Team – Anargya" };
export default function Team() {
  return (
    <section className="pg">
      <h1>Three divisions, one car</h1>
      <p className="lead">Anargya is student-led. Each division owns a part of the car and of the team, and all of them meet on race day.</p>
      <div className="grid">{DIVISIONS.map((d) => (
        <div className="card tilt" key={d.n}>
          <div className="hex">{d.n[0]}</div><h3>{d.n}</h3><p>{d.d}</p>
          {d.p.map((x) => <div className="li" key={x}>{x}</div>)}
        </div>))}
      </div>
    </section>
  );
}
