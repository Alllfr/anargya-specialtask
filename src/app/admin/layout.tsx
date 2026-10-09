import "./admin.css";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { logout } from "@/app/actions";
import AdminNav from "@/components/AdminNav";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) return <div className="ad ad-center">{children}</div>;
  return (
    <div className="ad">
      <aside className="ad-side">
        <div className="ad-brand"><img src="/mark.jpg" alt="Anargya" /><span>ADMIN</span></div>
        <AdminNav />
        <div className="ad-foot">
          <Link href="/" className="ab gh">View website</Link>
          <form action={logout}><button className="ab gh" style={{ width: "100%" }}>Sign out</button></form>
        </div>
      </aside>
      <div className="ad-main">{children}</div>
    </div>
  );
}