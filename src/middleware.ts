import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
const key = new TextEncoder().encode(process.env.SESSION_SECRET ?? "dev-secret-change-me");
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  try { await jwtVerify(req.cookies.get("ag_admin")?.value ?? "", key); return NextResponse.next(); }
  catch { return NextResponse.redirect(new URL("/admin/login", req.url)); }
}
export const config = { matcher: ["/admin/:path*"] };
