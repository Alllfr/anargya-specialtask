import Link from "next/link";
import { loginAction } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const signedIn = await isAdmin();
  return (
    <div className="lg-card">
      <img src="/logo.jpg" alt="Anargya ITS Formula EV Team" className="lg-logo" />
      {signedIn ? (
        <>
          <h1>You are signed in</h1><p>Continue to the admin dashboard.</p>
          <Link href="/admin" className="ab">Back to dashboard</Link>
        </>
      ) : (
        <form action={loginAction}>
          <h1>Admin sign in</h1><p>Staff only.</p>
          <label>Password<input name="password" type="password" required autoFocus /></label>
          {e && <p className="err" role="alert">Wrong password.</p>}
          {process.env.NODE_ENV !== "production" && <p><small>Dev hint: the password is ADMIN_PASSWORD in .env (default: change-me).</small></p>}
          <button className="ab">Sign in</button>
          <Link href="/" className="ab gh">Back to website</Link>
        </form>
      )}
    </div>
  );
}