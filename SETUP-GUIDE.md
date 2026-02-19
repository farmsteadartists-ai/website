# Farmstead Artists Website — Complete Setup Guide
## farmsteadartists.art | Next.js + Vercel

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────┐
│  DOMAINS (Namecheap)                                │
│  farmsteadartists.art  ← PRIMARY                    │
│  farmsteadartists.com  → redirect to .art           │
│  farmsteadartists.one  → redirect to .art           │
│  farmsteadartists.uno  → redirect to .art           │
├─────────────────────────────────────────────────────┤
│  HOSTING (Vercel - free tier)                       │
│  Auto SSL via Let's Encrypt                         │
│  Auto deploys from GitHub on every push             │
├─────────────────────────────────────────────────────┤
│  CODE (GitHub - acadiagit/farmstead-website)        │
│  Next.js 14 App Router                              │
│  Tailwind CSS                                       │
├─────────────────────────────────────────────────────┤
│  CONTENT (Google Drive - shared folder)             │
│  Artist photos, bios, artwork images                │
│  Farmstead_Website_Data.xlsx (master spreadsheet)   │
├─────────────────────────────────────────────────────┤
│  EMAIL (farmsteadartists@gmail.com)                 │
│  Google Contacts for subscriber list                │
│  Mailchimp free tier (500 contacts) for campaigns   │
└─────────────────────────────────────────────────────┘
```

---

## 2. DNS SETUP — Namecheap → Vercel

### Step A: Get Vercel IP addresses
After deploying to Vercel (Step 5), Vercel gives you these DNS values:
- **A Record**: `76.76.21.21`
- **CNAME**: `cname.vercel-dns.com`

### Step B: Configure PRIMARY domain (farmsteadartists.art)

1. Log into Namecheap → Domain List → farmsteadartists.art → MANAGE
2. Click "Advanced DNS" tab
3. Delete any existing records
4. Add these records:

| Type  | Host | Value               | TTL       |
|-------|------|---------------------|-----------|
| A     | @    | 76.76.21.21         | Automatic |
| CNAME | www  | cname.vercel-dns.com | Automatic |

### Step C: Configure REDIRECT domains (.com, .one, .uno)

For each of farmsteadartists.com, farmsteadartists.one, farmsteadartists.uno:

**Option A — Redirect via Namecheap (simplest):**
1. MANAGE → Advanced DNS
2. Add a URL Redirect Record:
   - Host: `@`
   - Value: `https://farmsteadartists.art`
   - Type: Permanent (301)
3. Add another:
   - Host: `www`
   - Value: `https://farmsteadartists.art`
   - Type: Permanent (301)

**Option B — Add all domains to Vercel (better):**
1. In Vercel dashboard → Project Settings → Domains
2. Add farmsteadartists.com, .one, .uno
3. Vercel will tell you to set DNS records (same A + CNAME pattern)
4. Vercel automatically redirects secondary domains to primary

**I recommend Option B** — Vercel handles SSL for all domains and the redirects are faster.

### Step D: Verify in Vercel
1. Go to Vercel dashboard → Project → Settings → Domains
2. Add `farmsteadartists.art` as primary
3. Add `www.farmsteadartists.art`
4. Add the other domains as redirects
5. Green checkmarks appear when DNS propagates (5 min to 48 hours, usually ~15 min)

---

## 3. LOCAL DEVELOPMENT SETUP

### On your Mac at /Users/website:

```bash
# 1. Clone the repo (after creating on GitHub)
cd /Users/website
git clone https://github.com/acadiagit/farmstead-website.git
cd farmstead-website

# 2. Install dependencies
npm install

# 3. Run local dev server
npm run dev
# Opens at http://localhost:3000

# 4. When ready to deploy, just push to GitHub
git add .
git commit -m "your message"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

### Local file structure:
```
/Users/website/farmstead-website/
├── public/                    ← Static files (images, PDFs)
│   ├── images/
│   │   ├── logo.png
│   │   ├── barn/             ← Barn photos
│   │   ├── artists/          ← Artist headshots
│   │   ├── artwork/          ← Artwork photos (Phase 2)
│   │   └── shows/            ← Show/event photos
│   └── forms/
│       └── guest-artist-application.pdf
├── src/
│   ├── app/                  ← Next.js App Router pages
│   │   ├── layout.js         ← Root layout (nav, footer)
│   │   ├── page.js           ← Home page
│   │   ├── about/page.js
│   │   ├── artists/page.js
│   │   ├── calendar/page.js
│   │   ├── directions/page.js
│   │   ├── contact/page.js
│   │   └── globals.css
│   ├── components/           ← Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ArtistCard.jsx
│   │   ├── ShowCard.jsx
│   │   ├── EmailSignup.jsx
│   │   └── Timeline.jsx
│   └── data/                 ← Content data (easy to edit)
│       ├── artists.json      ← Artist names, bios, photos
│       ├── shows.json        ← 2026 show dates
│       └── site.json         ← Site-wide config (address, email, etc.)
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 4. SHARED CONTENT — Google Drive

### Structure (shared with all members):
```
📁 Farmstead Website (shared link already created)
│   📄 Farmstead_Website_Data.xlsx   ← Master spreadsheet
│   📄 Farmstead_Drive_Folder_Setup.md
│
├── 📁 Logo & Branding/
├── 📁 Site Photos/
│   ├── 📁 Barn/
│   ├── 📁 Shows/
│   └── 📁 Events/
├── 📁 Artists/
│   ├── 📁 Becky O'Keefe/
│   ├── 📁 ... (one per artist)
│   └── 📁 Suzanne Becque/
├── 📁 Guest Artists 2026/
├── 📁 Documents/
└── 📁 Calendar 2026/
```

### Workflow: Google Drive → Website
1. Artists upload photos and fill spreadsheet rows in Google Drive
2. Hugo (you) downloads new content to your Mac
3. Optimize images (I'll provide a script) and place in /public/images/
4. Update artists.json with new bios
5. `git push` → Vercel auto-deploys

### Why Google Drive (not a separate repo for content):
- **All 15 artists can access it** — no GitHub accounts needed
- **Familiar interface** — everyone knows how to upload to Drive
- **Already set up** — your shared folder is live
- **Free** — 15GB per Google account
- The code lives in GitHub, the content lives in Google Drive. Clean separation.

### Alternative for later (Phase 2+):
When you add the inventory catalog, you may want to move to **Supabase** (which you already know from Vecinita) to store artwork data in a real database. But for Phase 1, flat JSON files in the repo are simpler and faster.

---

## 5. DEPLOYMENT STEPS (do these in order)

### Step 1: Create GitHub repo
```bash
# On github.com → acadiagit → New Repository
# Name: farmstead-website
# Public or Private: your choice
# Don't initialize with README (we'll push our own)
```

### Step 2: Create Vercel account & connect
1. Go to https://vercel.com
2. Sign up with your GitHub account (acadiagit)
3. Click "Import Project" → select farmstead-website repo
4. Framework preset: Next.js (auto-detected)
5. Click Deploy
6. Vercel gives you a preview URL like farmstead-website.vercel.app

### Step 3: Add custom domain in Vercel
1. Project → Settings → Domains
2. Add: farmsteadartists.art
3. Vercel shows you the DNS records to set
4. Go to Namecheap and set them (Step 2 above)

### Step 4: Add redirect domains
1. Same Domains page in Vercel
2. Add: farmsteadartists.com → redirects to farmsteadartists.art
3. Add: farmsteadartists.one → redirects to farmsteadartists.art
4. Add: farmsteadartists.uno → redirects to farmsteadartists.art
5. Set DNS for each in Namecheap

### Step 5: SSL
- **Nothing to do!** Vercel automatically provisions Let's Encrypt SSL certificates for all your domains. HTTPS just works.

---

## 6. EMAIL STRATEGY (500 subscribers)

### Current: farmsteadartists@gmail.com
- Keep this as primary contact email
- Use Google Contacts for internal member directory

### Newsletter/notifications: Mailchimp Free Tier
- Free for up to 500 contacts and 1,000 sends/month
- Sign up at mailchimp.com with farmsteadartists@gmail.com
- Create a signup form → embed on the website
- Design email template with FA branding
- Schedule show reminders (1 week before each show, day before)

### Email types to send:
1. **Welcome email** — auto-sent when someone subscribes
2. **Show reminders** — 1 week and 1 day before each show weekend
3. **Season opener** — May/early June announcement
4. **Guest speaker** — special event announcements
5. **Season wrap-up** — recap with stats and photos

---

## 7. QUICK REFERENCE

| What              | Where                                             |
|-------------------|---------------------------------------------------|
| Primary domain    | farmsteadartists.art                              |
| Registrar         | Namecheap                                         |
| Hosting           | Vercel (free)                                     |
| SSL               | Auto via Vercel/Let's Encrypt                     |
| Code repo         | github.com/acadiagit/farmstead-website            |
| Shared content    | Google Drive (existing shared folder)             |
| Email             | farmsteadartists@gmail.com                        |
| Newsletter        | Mailchimp (free, 500 contacts)                    |
| Local dev path    | /Users/website/farmstead-website                  |
| Dev server        | http://localhost:3000                             |
| Deploy            | `git push origin main` (auto-deploys to Vercel)   |
