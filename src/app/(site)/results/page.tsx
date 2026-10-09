import { RESULTS } from "@/lib/data";
export const metadata = { title: "Results – Anargya" };
export default function Results() {
  return (
    <section className="pg">
      <h1>Results on the track</h1>
      {RESULTS.map((r) => (
        <div className="res" key={r.y + r.e}><span className="g">{r.y}</span><div><b>{r.e}</b><p>{r.r}</p></div></div>
      ))}
      <p><small>Sources: ITS News, formulastudent.de.</small></p>
    </section>
  );
}
