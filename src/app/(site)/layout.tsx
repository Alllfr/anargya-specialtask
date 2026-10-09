import Link from "next/link";
import { CartProvider, CartLink } from "@/components/Cart";
import Pwa from "@/components/Pwa";
import Loader from "@/components/Loader";
import Fx from "@/components/Fx";
const NAV = [["/", "Home"], ["/team", "Team"], ["/cars", "Cars"], ["/results", "Results"], ["/shop", "Shop"]];
export default function Site({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <header className="top">
        <Link href="/"><img src="/mark.jpg" alt="Anargya" height={34} /></Link>
        <nav>{NAV.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <CartLink />
      </header>
      <main>{children}</main>
      <footer>
        <div><img src="/logo.jpg" alt="Anargya ITS Formula EV Team" height={56} /><p>Student-built electric race cars from Surabaya, Indonesia.</p></div>
        <div><b>Contact</b><p>anargya.its@gmail.com<br />Instagram @anargya.its<br />LinkedIn: ANARGYA ITS<br />ITS Campus, Surabaya</p></div>
        <div><b>Staff</b><p><Link href="/admin">Admin login</Link></p></div>
      </footer>
      <Pwa />
      <Loader />
      <Fx />
    </CartProvider>
  );
}
