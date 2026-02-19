# Farmstead Artists — farmsteadartists.art

Original art in a historic barn on Route 1, East Sullivan, Maine.

## Quick Start (on your Mac)

```bash
cd /Users/website
git clone https://github.com/acadiagit/farmstead-website.git
cd farmstead-website
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Push to GitHub → Vercel auto-deploys in ~60 seconds.

```bash
git add .
git commit -m "update site"
git push origin main
```

## Edit Content

All content lives in `src/data/` as simple JSON files:
- `artists.json` — member names, bios, photo paths
- `shows.json` — 2026 show dates and schedule
- `site.json` — address, contact info, stats, social links

## Add Artist Photos

1. Place headshot in `public/images/artists/firstname-lastname.jpg`
2. Update `artists.json` to add `"photo": "/images/artists/firstname-lastname.jpg"`

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (spring palette: sage greens, soft blues, cream, gold)
- **Hosting:** Vercel (free tier)
- **Domain:** farmsteadartists.art (+ .com, .one, .uno redirects)

## Project Structure

```
src/
├── app/           ← Pages (home, about, artists, calendar, directions, contact)
├── components/    ← Reusable UI (Navbar, Footer, ArtistCard)
└── data/          ← Content JSON files (easy to edit without touching code)
public/
└── images/        ← Photos (artists, barn, shows, artwork)
```
