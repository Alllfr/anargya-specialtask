import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { p?: PrismaClient };
export const db = g.p ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.p = db;
export const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");
