import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "600", "800"] });
export const metadata: Metadata = { title: "Anargya – ITS Formula EV Team", description: "Student-built electric formula race cars from Surabaya, Indonesia.", appleWebApp: { capable: true, title: "Anargya" } };
export const viewport: Viewport = { themeColor: "#050606", viewportFit: "cover" };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={outfit.className}>{children}</body></html>;
}
