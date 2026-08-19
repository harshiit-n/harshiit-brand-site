# Harshiit Nemani — Personal Branding Site

A personal branding website for Harshiit Nemani's deal sourcing practice
(PE / VC / search fund deal flow), with a "coming soon" section for the
broader deal-flow-and-expert-network platform he's building toward.

Structured after chrisducker.com's homepage flow (hero → credentials →
about → offer breakdown → testimonials → vision/waitlist → newsletter →
contact → footer), rebuilt from scratch with original copy and no reused
assets.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 — a single-page site,
  fully responsive, with scroll-reveal animations and three working forms
  (contact, early-access waitlist, newsletter).
- **Backend:** Node.js + Express + SQLite (via `better-sqlite3`) — three
  public endpoints to receive form submissions, plus HTTP-Basic-Auth-
  protected admin endpoints to read them back.

No paid services required to run this. SQLite is a single file on disk —
nothing to provision.

## Project structure

```
harshiit-brand-site/
├── frontend/          React + Vite app (the site itself)
│   └── src/
│       ├── components/   One file per section (Hero, About, Contact, ...)
│       ├── hooks/         useReveal.js — scroll-in animation hook
│       └── lib/api.js     fetch wrapper for the backend API
├── backend/           Express API
│   └── src/
│       ├── server.js      App entrypoint, middleware, rate limiting
│       ├── routes.js      /api/contact, /api/waitlist, /api/newsletter, /api/admin/*
│       ├── db.js          SQLite connection + schema
│       ├── validate.js    Input validation helpers
│       └── adminAuth.js   Basic-Auth gate for admin routes
└── README.md          You are here
```

## Running locally

You need two terminals — one for the API, one for the site.

**1. Backend**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

This starts the API on `http://localhost:4000` and creates
`backend/data/site.db` automatically on first run.

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

This starts the site on `http://localhost:5173`. Vite is already
configured (see `frontend/vite.config.js`) to proxy `/api/*` requests to
the backend on port 4000, so the forms work out of the box in dev — no
extra config needed.

Open `http://localhost:5173` and try the contact form, the "Get Early
Access" waitlist form, and the newsletter signup — each writes a row into
`backend/data/site.db`.

## Viewing submissions (admin)

Admin routes are disabled by default. To enable them, set `ADMIN_USER` and
`ADMIN_PASSWORD` in `backend/.env`, restart the backend, then visit (with
Basic Auth credentials):

- `http://localhost:4000/api/admin/contact`
- `http://localhost:4000/api/admin/waitlist`
- `http://localhost:4000/api/admin/newsletter`

For anything beyond quick personal checks, swap this for a proper admin
UI or export the SQLite file with a tool like [DB Browser for
SQLite](https://sqlitebrowser.org/).

## Deploying

This is a standard two-service deploy — a static frontend and a small
Node API. Any of these combinations work well and all have generous free
tiers:

| Frontend (static)      | Backend (Node + persistent disk)     |
|-------------------------|---------------------------------------|
| Vercel                  | Render (free web service + disk)     |
| Netlify                 | Railway                              |
| Cloudflare Pages        | Fly.io                               |

Steps:

1. **Backend first.** Deploy the `backend/` folder as a Node service. Set
   environment variables from `.env.example` (at minimum `PORT` is
   usually set automatically by the host; set `ALLOWED_ORIGIN` to your
   deployed frontend's URL once you know it). Most hosts give you a URL
   like `https://your-api.onrender.com`.
2. **Frontend next.** Deploy the `frontend/` folder (build command
   `npm run build`, output directory `dist`). Set the environment variable
   `VITE_API_URL` to your backend's URL from step 1 (e.g.
   `https://your-api.onrender.com`) before building — the frontend reads
   this at build time (see `frontend/src/lib/api.js`).
3. Go back to the backend host and set `ALLOWED_ORIGIN` to your deployed
   frontend's URL (e.g. `https://harshiitnemani.com`), so CORS allows the
   real site to call the API.
4. **SQLite persistence:** make sure the backend host mounts a persistent
   disk for `backend/data/` — on most free tiers this means enabling a
   "disk"/"volume" add-on so the database file survives restarts and
   redeploys.

If you'd rather not manage a separate database file at all, the SQLite
layer in `backend/src/db.js` is a thin wrapper — swapping in a hosted
Postgres (e.g. Supabase or Neon, both have free tiers) later is a
contained change limited to that one file.

## What's still a placeholder

Search the codebase for these before launch:

- **Headshot photo** — `frontend/src/components/Hero.jsx` has a gray
  placeholder box where your photo should go.
- **Testimonials** — `frontend/src/components/Testimonials.jsx` has
  clearly marked placeholder quotes. Intentionally left unfilled rather
  than populated with invented client names.
- **"Trusted by" logos** — not included at all (removed rather than
  faked); add a section back in once you have real press/firm logos.
- **Booking link** — the "Book a Call" buttons currently point to the
  on-page `#contact` form. Swap the `href` in `Nav.jsx` and `Hero.jsx` for
  a Calendly (or similar) link once you have one.
- **Privacy Policy / Terms** — footer links are placeholders (`#`). Have
  these reviewed by a lawyer before real launch.
- **X/Twitter link** — omitted from the footer; add it in `Footer.jsx` if
  you want one.

## Notes on scope

This was built as a genuinely "semi-professional" v1 — solid design,
working forms, a real database, and a clean deploy path — not an
enterprise system. There's no email-sending (submissions land in SQLite,
not your inbox) and no CMS. Both are reasonable next additions once the
site is live and you know what you actually need:

- **Email notifications on submit:** add a transactional email provider
  (e.g. Resend, Postmark) inside `backend/src/routes.js`.
- **CMS for testimonials/content:** only worth it once you're updating
  copy often enough that editing React files is friction.
