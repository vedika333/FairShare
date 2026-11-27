# FairShare 🌸

### Splitwise tells you who owes what. FairShare tells you whose turn it is.

**Live demo:** https://fairshare-zeta-nine.vercel.app/  *(replace with your Vercel link)*
**Demo group code:** `000000`  *(replace with a seeded group so judges can look around right away)*

Built for the **SMBP FinHack** (Finance Track).

---

## The problem

University students in tight friend groups (5-6 people) rarely split every bill. They **take turns paying** instead: you cover this lunch, I'll cover the next one.

Nobody tracks it. It lives in memory and in old WhatsApp chats, so over time:

- people forget whose turn it is,
- one person quietly ends up paying more,
- and nobody wants to be the one who brings it up.

What students told us:

> "Even when it's my payment, it gets counted as someone else's, and I can't say anything."

> "During vacations I end up paying more, and things still get forgotten."

> "I'm the one who ends up paying the most."

Splitwise-style apps assume every bill is split. **Rotation is a different habit, and no common tool serves it.**

## The solution

FairShare is a mobile-first web app that answers one question: **is our rotation fair, and whose turn is it?**

|  | Splitwise | FairShare |
|---|---|---|
| Question it answers | Who owes whom for this bill? | Is our rotation fair, and whose turn is it? |
| First thing you see | Balances | The Fairness Ring and a name |
| Reminding someone | Awkward | Anonymous, gentle nudge |

## Features

| | Feature | What it does |
|---|---|---|
| F1 | **Group codes** | Create a group, share the 6-digit code, friends join. No passwords or logins. |
| F2 | **Add payment** | Pick who covered it, enter the amount, save. Three taps. |
| F3 | **Fairness Ring** | A live 0-100 score with three moods: calm, tense and dramatic. |
| F4 | **Whose Turn card** | Names the person who has covered the least, with a lighthearted line. |
| F5 | **Gentle nudge** | Sends a reminder to the next payer. The receiver never sees who sent it. |
| F6 | **Rotation timeline** | A horizontal strip showing who paid and when, so patterns are easy to spot. |
| F7 | **Settle via PayMe / FPS** | A mock button showing the exact amount to even up. Built for the Hong Kong student context. |
| F8 | **Trip mode** | A toggle for holidays. Fairness thresholds relax because trips are naturally lumpy. |

> Delete any row above that you did not ship before submitting.

## How fairness is calculated

All of the logic is in [`lib/fairness.ts`](lib/fairness.ts) and is a few lines long:

```
fair_share = total_group_spend / group_size
net[member] = total_paid_by[member] - fair_share
score       = 100 - (spread(net) / total_spend x 100)
whose turn  = the member with the lowest net
```

- `net > 0` means the group is ahead of that person (they have covered more than their share).
- `net < 0` means that person is behind.
- `spread` is the highest net minus the lowest net.
- **100** means perfectly even. **0** means one person paid for everything.
- Moods: calm at 75 and above, tense from 40 to 74, dramatic below 40. Trip mode relaxes these thresholds.

## Design

Splitting money causes anxiety, so FairShare is designed to feel like a **calm, slightly dramatic c-drama diary** (inspired by the soft look of *Hidden Love*) and not like a banking app.

- **Editorial paper look:** warm paper background, thin cocoa borders, hard offset shadows and a ticket-style perforation.
- **Type:** Instrument Serif for titles and the hero number, Plus Jakarta Sans for text, JetBrains Mono for amounts.
- **Palette:** peach, rose, lilac and mint. Mint only appears when the group is fair.
- **Copy with personality:** all funny lines and emoji live in one file, [`lib/copy.ts`](lib/copy.ts).
- **Sticker-sized emoji:** only in a few chosen places, never scattered.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres, free tier) |
| Hosting | Vercel |
| Sync model | Sync-on-refresh: data is read on page load and on window focus |

```
[Browser: React + Tailwind]
        | fetch("/api/...")
        v
[Next.js API routes (server only)]
        | supabase-js + secret key
        v
[Supabase Postgres: groups, members, payments, nudges]
```

The browser never talks to the database directly. The Supabase secret key stays on the server, and the tables are locked with Row Level Security (no public policies). That is how the app works safely without user accounts.

## Run it locally

1. **Clone and install**
   ```bash
   git clone https://github.com/your-username/fairshare.git
   cd fairshare
   npm install
   ```

2. **Create the database.** In Supabase, open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates four tables: `groups`, `members`, `payments` and `nudges`.

3. **Add your keys.** Copy `.env.example` to `.env.local` and fill in both values (Supabase: Project Settings, then API):
   ```env
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
   ```
   Do **not** add a `NEXT_PUBLIC_` prefix. These must stay on the server.

4. **Start the app**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

5. **(Optional) Load demo data**
   ```bash
   npm run seed
   ```
   This creates a group with uneven payments and prints its code.

> To test multi-device sync, open the app on two devices (or two browsers), join the same group code, and refresh.

## Database

| Table | Holds |
|---|---|
| `groups` | 6-digit code, group name, trip-mode flag |
| `members` | Name and emoji avatar, linked to a group |
| `payments` | Payer, amount, optional note, timestamp |
| `nudges` | Who nudged whom (the receiver never sees the sender) |

## API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/groups` | Create a group and its first member |
| POST | `/api/groups/join` | Join a group with a code |
| GET | `/api/groups/[code]` | Everything the dashboard needs: group, members, payments, nudges, fairness stats |
| PATCH | `/api/groups/[code]` | Turn trip mode on or off |
| POST | `/api/groups/[code]/payments` | Add a payment |
| POST | `/api/groups/[code]/nudge` | Send a gentle reminder |

## Project structure

```
app/
  page.tsx               Home: create or join a group
  g/[code]/page.tsx      Dashboard
  api/groups/...         Backend routes
components/
  ui/                    Card, Button, Sheet, Toast
  dashboard/             Header, FairnessRing, WhoseTurnCard, RotationLog, ...
  sheets/                Add payment, payment detail, settle (mock)
  evenup/                "Even up" view
lib/
  fairness.ts            Fairness score and whose-turn logic
  debts.ts               Fewest transfers to even things up
  mood.ts                Score to mood (trip mode aware)
  copy.ts                All emoji and funny lines in one place
  api.ts                 All fetch calls
  supabase.ts            Server-side database connection
supabase/schema.sql      Database setup
```

## Scope decisions

Left out on purpose, to ship something polished in a hackathon:

- **Real-time websockets:** sync-on-refresh is enough for the use case.
- **Real PayMe / FPS integration:** the settle flow is a clearly labelled mock.
- **Logins and passwords:** group codes keep it friction-free for students.
- **Native mobile app:** it is a mobile-first web app.
- **AI features:** not needed to solve this problem.

## AI tools usage

*Edit this section so it describes what you actually did.*

- **Claude** was used to plan the architecture, write and explain the Supabase SQL, draft the API routes and fairness logic, and review code.
- **Google Antigravity** was used to generate UI components from written specifications.
- All code was run, tested and reviewed by the team. The product idea, problem research, interviews and design direction are ours.

## Team

- *Your name* (role)
- *Teammate* (role)

---

*Built for SMBP FinHack 2026. Nobody has to be the bad guy.* 🌸