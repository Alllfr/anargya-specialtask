import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
export const key = new TextEncoder().encode(process.env.SESSION_SECRET ?? "dev-secret-change-me");
export async function startSession() {
  const t = await new SignJWT({ admin: true }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key);
  (await cookies()).set("ag_admin", t, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
}
export async function endSession() { (await cookies()).delete("ag_admin"); }
export async function isAdmin() {
  const t = (await cookies()).get("ag_admin")?.value;
  if (!t) return false;
  try { await jwtVerify(t, key); return true; } catch { return false; }
}
