# Website FA Issues
#website-fa-issues.md
#~/coworker/farmstead/website/website-fa-issues.md

*Updated: 2026-05-02*

To close an issue: tell Claude "close issue #N" with a one-line resolution.

| # | Date | Status | Priority | Issue | Resolution |
|---|------|--------|----------|-------|------------|
| 18 | 2026-05-02 | Open | Low | When hi-res original paintings are available, swap files in public/images/flexit/ (same filenames, no code change) | Current crops from flyer have text overlays |
| 17 | 2026-04-28 | Closed | — | Flexit flyer image shows reception date as 18th — should be 16th | Replaced flyer with HTML artwork grid — date is now text, reads May 16th |
| 16 | 2026-04-28 | Open | Medium | Correct FA member count to 18 or decide what to count: members, artists, or email list | Currently shows 15 in site.json stats.memberCount |
| 15 | 2026-04-28 | Open | Medium | After June 10: swap hero back to barn-exterior.jpg, remove Flexit flyer | Remove flexitArtists array and restore barn hero in page.js |
| 14 | 2026-04-28 | Open | Medium | Add Member feature — pending approval from Mary & Steve | Plan at `~/coworker/farmstead/add-member-feature.md` |
| 13 | 2026-04-28 | Closed | — | Delete old Vercel project `farmstead-website` | Deleted all duplicate repos in Vercel |
| 12 | 2026-04-28 | Closed | — | Delete old local repo `/Users/website/farmstead-website` | Deleted all duplicate repos in git |
| 11 | 2026-04-28 | Closed | — | Self-serve dashboard pages (add-artwork, edit-profile) may be missing from canonical workspace | Admin login works for editing all pages |
| 10 | 2026-04-28 | Open | Low | Artwork photos missing for some artists | Barbara, Bonnie, Carol Benson, Laurie, Louise, Lynn, Nancy, Richard, Robert, Tony |
| 9 | 2026-04-28 | Closed | — | Address bar at bottom of front page may still be hidden by footer | Simple address added below Flexit flyer |
| 8 | 2026-04-27 | Closed | — | Contact boxes missing Carol or Suzanne | Fixed: 4 boxes horizontal, identical on both pages |
| 7 | 2026-04-27 | Closed | — | Contact page layout different from home page | Fixed: same 4 boxes on both /contact and home scroll |
| 6 | 2026-04-25 | Closed | — | Art Guide admin access broken | Fixed: added is_admin to select query |
| 5 | 2026-04-25 | Closed | — | Supabase URL config wrong | Fixed: Site URL set to farmsteadartists.org |
| 4 | 2026-04-24 | Closed | — | Artwork photos not showing on live site | Fixed: force-dynamic + bulk SQL photo_url updates |
| 3 | 2026-04-24 | Closed | — | Artist cards not clickable from home page | Fixed: added slug prop + Link wrapper |
| 2 | 2026-04-24 | Closed | — | Supabase anon key wrong (sb_secret) | Fixed: switched to sb_publishable key |
| 1 | 2026-04-24 | Closed | — | farmsteadartists.org not on Vercel | Fixed: added to farmstead-art project |
