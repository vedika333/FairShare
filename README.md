# FairShare

FairShare is a warm, friendly expense-rotation app for small friend groups (5–6 people) who take turns paying. Instead of feeling like a cold bank ledger, it tracks a group fairness score, highlights whose turn it is next, lets friends send anonymous gentle reminders, and includes a Trip mode for holidays.

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the project root with the two Supabase environment variables below.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).
5. *(Optional)* Seed a demo group ("Canteen Crew" with 5 members and 8 uneven payments) while the dev server is running:
   ```bash
   npm run seed
   ```

## Environment variables

Create `.env.local` (already git-ignored via `.env*`) with:

- `SUPABASE_URL` — Your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key (used only on the server inside API routes).

## Folder map

- `app/` — Next.js App Router pages (`/` home, `/g/[code]` group dashboard) and `/api/groups/*` backend routes.
- `components/ui/` — Reusable stationery-style building blocks (`Card`, `Button`, `Sheet`, `Toast`, `Petals`).
- `components/home/` — Create/Join group form (`CreateJoinForm`).
- `components/dashboard/` — Header, Hero card, Fairness ring, Whose Turn card, Nudge banner, Rotation timeline, Expense feed, and Trip mode toggle.
- `components/balances/` — Simplified debts list, member balance bars, and the demo PayMe settle sheet.
- `components/sheets/` — Bottom sheets for adding a payment and viewing a receipt split.
- `lib/` — Plain TypeScript helpers (`api.ts` for all fetch calls, `types.ts`, `fairness.ts`, `debts.ts`, `mood.ts`, `copy.ts`, `session.ts`, `format.ts`, `supabase.ts`).
- `scripts/` — `seed-demo.mjs` to create a ready-to-demo group against `localhost:3000`.

## Vercel deploy checklist

- [ ] Push your repo to GitHub (verify `.env.local` is not committed).
- [ ] Import the project in Vercel and set **Root Directory** to `fairshare` (if deploying from the parent repo).
- [ ] Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in **Vercel → Project Settings → Environment Variables**.
- [ ] Deploy and open the production URL on a phone.
- [ ] Test creating a new group, copying the 6-digit code, joining from a second browser/device, adding a payment, and toggling Trip mode.
