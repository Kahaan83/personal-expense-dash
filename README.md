# Ledger

A mobile-first personal expense and investment tracker, built as a single-file web app and installable as a PWA. Track spending, see where the money went, monitor your portfolio, keep tabs on who owes you, and let AI handle the boring parts.

**Live:** https://personal-expense-dash.vercel.app

<!-- TODO: add 3–4 screenshots (Home, Expenses, Invest, People) in /docs and link them here -->

---

## Features

**Home**
- Month picker with a hero card: total spent, cumulative-spend chart, money in, net, and total owed to you
- Natural-language quick add (e.g. `chai 20, auto to campus 60`) parsed by Gemini
- AI insight card: a short "pattern in your spending" summary for the month
- Recent transactions and a category breakdown bar

**Expenses**
- Search by merchant, note, or category, plus category filter chips
- Nudge for uncategorised transactions
- Swipe / tap actions on rows (edit, delete) with an undo snackbar

**Investments**
- Holdings grouped by type with invested value, current value, and P&L
- Expandable sections, per-holding actions, allocation bars
- Estimated values are flagged so you can tell them from live ones

**People & debts**
- Running total of money owed to you
- Household reimbursements, with suggested matches you can accept or reject

**App shell**
- Installable PWA (standalone, portrait, offline-aware banner)
- Liquid-glass dark theme built on Material 3 tokens, with reduced-motion support
- Safe-area aware layout for notched phones

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla HTML/CSS/JS in a single `index.html` |
| Backend / DB | [Supabase](https://supabase.com) (Postgres) |
| AI | Google Gemini API (`generativelanguage.googleapis.com`) |
| Hosting | Vercel (static, auto-deploys from `main`) |
| Fonts / icons | Plus Jakarta Sans, DM Mono, Material Symbols Rounded (Google Fonts) |
| PWA | `manifest.json` + `sw.js` |

## Project structure

```
.
├── index.html       # the entire app: markup, styles, logic
├── manifest.json    # PWA manifest
├── sw.js            # service worker
├── icon-192.png
├── icon-512.png
└── README.md
```

## Data model

Supabase tables used by the app:

`transactions`, `investments`, `debts`, `people`, `household_reimbursements`, `income`, `income_sources`

<!-- TODO: add supabase/schema.sql with the real CREATE TABLE + RLS statements and link it here -->

## Setup

1. **Clone**
   ```bash
   git clone https://github.com/Kahaan83/personal-expense-dash.git
   cd personal-expense-dash
   ```
2. **Create a Supabase project** and create the tables listed above.
3. **Enable Row Level Security** on every table and add policies (see Security below). The anon key ships to the browser, so RLS is what actually protects your data.
4. **Add your Supabase URL and anon key** in `index.html` (search for `supabase`).
5. **Serve locally** (any static server works; the service worker needs `http://localhost` or HTTPS):
   ```bash
   npx serve .
   ```
6. **Gemini key (optional):** open the app, go to Settings, and paste your key. It is stored in your browser's `localStorage` only and is never committed.
7. **Deploy:** import the repo into Vercel. No build step or framework preset needed.

## Security notes

This app handles personal financial data, so:

- **Supabase anon key is public by design.** Without RLS and authentication, anyone who finds your deployed URL can read and write your data. Turn on Supabase Auth and write RLS policies scoped to `auth.uid()`.
- **The Gemini key lives in `localStorage`.** Restrict it in Google AI Studio / Cloud Console (HTTP referrer limit to your Vercel domain and a low quota) so a leaked key has little value.
- **Never commit** bank statements, Groww exports, CSVs, or `.env` files. See `.gitignore`.

## Roadmap

- [ ] Auth + RLS-scoped policies
- [ ] Schema file and seed data for easy setup
- [ ] Budgets per category
- [ ] CSV export
- [ ] Split `index.html` into `css/` and `js/` modules

## License

MIT, see [LICENSE](LICENSE).
