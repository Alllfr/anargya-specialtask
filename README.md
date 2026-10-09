# Anargya Web (Next.js)

Public website, shop, and admin panel for the Anargya ITS Formula EV Team.
Stack: Next.js 15 (App Router) · TypeScript · Prisma + SQLite · PWA (manifest + service worker).

## Run locally
```bash
npm install
cp .env.example .env      # set ADMIN_PASSWORD and SESSION_SECRET
npx prisma db push        # create the database
c          # demo products and orders
npm run dev               # http://localhost:3000
```
Admin: http://localhost:3000/admin (password from `.env`).

## Test the PWA
The service worker only registers in production:
```bash
npm run build && npm start
```
Open the site, then use the browser's install option. Turn the network off to see the offline page and the order queue.

## Deploy
- Vercel + Postgres (Neon or Supabase): change `provider` in `prisma/schema.prisma` to `postgresql`, set `DATABASE_URL`, run `npx prisma db push`, then `npm run db:seed`.
- Set `ADMIN_PASSWORD` and `SESSION_SECRET` in the host's environment variables.

## Structure
- `src/app/(site)` public pages · `src/app/admin` admin panel · `src/app/actions.ts` server actions (orders, login, products)
- `src/components` cart, PWA helper, SVG art · `src/lib/data.ts` team, cars, and results content
- `public/sw.js` service worker · `src/app/manifest.ts` web app manifest

Notes: no payment gateway (not required). Orders placed offline are queued in the browser and sent when the connection returns.
