Read AGENTS.md first. This Next.js version (16, App Router) has breaking changes, so
check node_modules/next/dist/docs when unsure. Route `params` are Promises.

PROJECT: FairShare, a web app for friend groups (5-6 students) who take turns paying.
It shows when the rotation is unfair and nudges gently so nobody is the bad guy.
The backend is DONE (Next.js API routes + Supabase). Do NOT edit anything under
app/api or lib/supabase.ts unless a milestone says so.

CODE STYLE (very important, the owner is a beginner and will edit this later):
1. Readable beats clever. Plain React + TypeScript, no extra libraries, no state library.
2. One component per file in components/, each under ~120 lines. If longer, split it.
3. Comments in simple English above each component and any non-obvious logic
   (say WHAT it does and WHY). No jargon.
4. All fetch calls live in lib/api.ts. Components never call fetch directly.
5. All types live in lib/types.ts. All colours, fonts and shadows come from theme
   tokens in app/globals.css. Never hardcode hex colours inside components.
6. Pages (page.tsx) only wire things together. Logic lives in components or lib.
7. Handle loading, error and empty states for everything that fetches data.
8. After finishing, list every file you created or changed with one line each.

API CONTRACT (already built, do not change):
GET   /api/groups/[code]  -> { group:{id,code,name,vacation_mode},
        members:[{id,name,avatar}],
        payments:[{id,paid_by,amount,note,created_at}]  (oldest first),
        stats:{ totalSpend, fairShare, score(0-100), mood:"calm"|"tense"|"BALANCED",
                balances:[{id,name,avatar,paid,net}], nextPayer } }
PATCH /api/groups/[code]  body {vacationMode:boolean}
POST  /api/groups/[code]/payments  body {paidBy, amount, note}
POST  /api/groups/[code]/nudge     body {fromMember, toMember}
POST  /api/groups       body {groupName, yourName, avatar} -> {code, memberId}
POST  /api/groups/join  body {code, yourName, avatar}      -> {code, memberId}
"Who am I" is stored in localStorage key "fairshare:session" as {code, memberId}.
net > 0 means the group owes that person. net < 0 means they owe the group.

DESIGN: copy the structure and style (NOT the code) of reference/splitnote.html:
thin ink borders, hard offset shadows, perforated ticket divider, hairline list rows,
Instrument Serif for the group title and big numbers, Plus Jakarta Sans for text,
JetBrains Mono for rupee amounts. Use this softer palette instead of black/white/coral:
  paper #FFF8F3 | card #FFFFFF | ink #3B2F33 (warm cocoa, used for borders and shadows)
  muted #8A767C | rose #E8798B (main actions) | peach #F9D5C4 | lilac #CDBEF0 (nudge, calm)
  mint #8FD3B6 (only for "all fair") | sky #CFE3F5 (vacation mode)
Mobile first (about 420px wide). Soft, calm, slightly BALANCED copy, never bank-like.