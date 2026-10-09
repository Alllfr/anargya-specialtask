"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isAdmin, startSession, endSession } from "@/lib/auth";

type OrderInput = { customer: string; address: string; items: { id: number; qty: number }[] };
export async function createOrder(i: OrderInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  if (!i.customer.trim() || !i.address.trim() || !i.items.length) return { ok: false, error: "Fill in your name, address, and cart." };
  try {
    const o = await db.$transaction(async (tx) => {
      const ps = await tx.product.findMany({ where: { id: { in: i.items.map((x) => x.id) } } });
      let total = 0;
      const lines = i.items.map((x) => {
        const p = ps.find((p) => p.id === x.id);
        if (!p || x.qty < 1 || p.stock < x.qty) throw new Error(`Not enough stock: ${p?.name ?? "item"}`);
        total += p.price * x.qty;
        return { productId: p.id, name: p.name, qty: x.qty, price: p.price };
      });
      for (const l of lines) await tx.product.update({ where: { id: l.productId }, data: { stock: { decrement: l.qty } } });
      return tx.order.create({ data: { customer: i.customer.trim(), address: i.address.trim(), total, items: { create: lines } } });
    });
    revalidatePath("/shop"); revalidatePath("/admin", "layout");
    return { ok: true, id: o.id };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}

export async function loginAction(f: FormData) {
  if (String(f.get("password")).trim() !== (process.env.ADMIN_PASSWORD ?? "change-me").trim()) redirect("/admin/login?e=1");
  await startSession(); redirect("/admin");
}
export async function logout() { await endSession(); redirect("/admin/login"); }

async function guard() { if (!(await isAdmin())) throw new Error("Unauthorized"); }
const done = () => { revalidatePath("/admin", "layout"); revalidatePath("/shop"); };

export async function setStatus(f: FormData) {
  await guard();
  await db.order.update({ where: { id: Number(f.get("id")) }, data: { status: String(f.get("status")) } });
  done();
}
export async function adjustStock(id: number, delta: number) {
  await guard();
  const p = await db.product.findUnique({ where: { id } });
  if (p) await db.product.update({ where: { id }, data: { stock: Math.max(0, p.stock + delta) } });
  done();
}
export async function saveProduct(f: FormData) {
  await guard();
  const id = Number(f.get("id") ?? 0), name = String(f.get("name") ?? "").trim();
  const price = Math.round(Number(f.get("price") ?? 0)), stock = Math.max(0, Math.round(Number(f.get("stock") ?? 0)));
  if (!name || price < 1) return;
  const data = { name, price, stock, category: String(f.get("category")), kind: String(f.get("kind")) };
  if (id) await db.product.update({ where: { id }, data }); else await db.product.create({ data });
  done();
}
export async function deleteProduct(id: number) {
  await guard();
  await db.product.delete({ where: { id } }); // past orders keep the saved item name
  done();
}