import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const P = [["Anargya Team Jersey","Apparel",250000,24,"tee"],["Snapback Cap","Apparel",120000,40,"cap"],["Insulated Tumbler","Accessories",150000,30,"bot"],["Sticker Pack","Accessories",25000,120,"stk"],["Mark 6.0 Tee","Apparel",175000,18,"tee"],["Team Lanyard","Accessories",35000,60,"stk"]] as const;
const O = [["Rina Putri","Delivered","2026-09-20",[["Anargya Team Jersey",1],["Sticker Pack",2]]],["Dimas Pratama","Shipped","2026-09-28",[["Snapback Cap",1],["Insulated Tumbler",1]]],["Salsa Amelia","Processing","2026-10-03",[["Mark 6.0 Tee",2]]],["Fajar Nugroho","Processing","2026-10-04",[["Anargya Team Jersey",2],["Snapback Cap",1]]],["Intan Maharani","New","2026-10-06",[["Team Lanyard",3],["Sticker Pack",1]]],["Bayu Setiawan","New","2026-10-07",[["Insulated Tumbler",2]]]] as const;
async function main() {
  await db.orderItem.deleteMany(); await db.order.deleteMany(); await db.product.deleteMany();
  const m: Record<string, { id: number; price: number }> = {};
  for (const [name, category, price, stock, kind] of P) m[name] = await db.product.create({ data: { name, category, price, stock, kind } });
  for (const [customer, status, d, items] of O)
    await db.order.create({ data: { customer, status, address: "Surabaya, East Java", createdAt: new Date(d), total: items.reduce((a, [n, q]) => a + m[n].price * q, 0), items: { create: items.map(([n, q]) => ({ productId: m[n].id, name: n, qty: q, price: m[n].price })) } } });
}
main().finally(() => db.$disconnect());