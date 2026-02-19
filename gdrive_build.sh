#!/bin/bash
# ============================================================
# Farmstead Artists — Google Drive Folder Builder
# Creates the website asset folder structure locally.
# Upload the resulting folder to Google Drive.
#
# Usage: ./gdrive_build.sh [target_dir]
# Default: ~/Desktop/Farmstead_Website
# ============================================================

TARGET="${1:-$HOME/Desktop/Farmstead_Website}"

echo ""
echo "📁 Farmstead Artists — Building Drive Folder Structure"
echo "   Location: $TARGET"
echo ""

# ── Top-level folders ──
mkdir -p "$TARGET/Barn Photos"
mkdir -p "$TARGET/Show Photos/2025"
mkdir -p "$TARGET/Show Photos/2026"
mkdir -p "$TARGET/Logo & Branding"
mkdir -p "$TARGET/Documents"
mkdir -p "$TARGET/Presentations"
mkdir -p "$TARGET/Guest Artists 2026"

# ── Artist folders (one per member) ──
ARTISTS=(
  "Becky OKeefe"
  "Bethany Preble"
  "Brooke Simon"
  "Carol Michaud"
  "Hugo Diaz"
  "Janis Guyette"
  "Linda Malaussena"
  "Mary Laury"
  "Mavis Davis"
  "Melissa Rioux"
  "Pamela Hall"
  "Penny Ricker"
  "Rick Sawyer"
  "Steve Brookman"
  "Suzanne Becque"
)

for ARTIST in "${ARTISTS[@]}"; do
  mkdir -p "$TARGET/Artists/$ARTIST"

  # Drop a README in each artist folder
  cat > "$TARGET/Artists/$ARTIST/WHAT_TO_UPLOAD.txt" <<EOF
Hi $ARTIST!

Please upload the following to this folder:

1. HEADSHOT
   - One photo of you (face or working in studio)
   - Name it: headshot.jpg
   - Minimum 400x400 pixels

2. BIO
   - 2-3 sentences about you and your art
   - Name it: bio.txt
   - Example: "I work primarily in watercolors inspired by
     the Downeast Maine coastline. My subjects range from
     harbor scenes to wildflowers."

3. ARTWORK PHOTOS (3-5 images)
   - Name each: title-of-piece.jpg
   - Example: morning-fog-harbor.jpg
   - Include a list of titles, medium, and size in a file
     called: artwork-list.txt

Questions? Email farmsteadartists@gmail.com
EOF

done

# ── Barn Photos README ──
cat > "$TARGET/Barn Photos/WHAT_TO_UPLOAD.txt" <<EOF
Barn Photos — For the Website

Upload photos of the Farmstead Barn here:
- Exterior shots (Route 1 view, parking area, signage)
- Interior shots (empty barn, setup, artwork on walls)
- Seasonal shots (summer, fall colors)
- Historical photos if available

Name files descriptively: barn-exterior-summer.jpg, barn-interior-setup.jpg
Minimum 1200 pixels wide for hero/banner use.
EOF

# ── Show Photos README ──
cat > "$TARGET/Show Photos/WHAT_TO_UPLOAD.txt" <<EOF
Show Photos — Organized by Year

Upload photos from each show weekend:
- Visitors browsing
- Artists at their displays
- Reception/events
- Guest speaker presentations

Name files: june-show-crowd.jpg, august-frey-talk.jpg, etc.
EOF

# ── Presentations README ──
cat > "$TARGET/Presentations/WHAT_TO_UPLOAD.txt" <<EOF
Presentations — Guest Speaker Materials

Upload materials from past and upcoming presentations:
- Speaker slides or photos
- Event photos
- Promotional flyers

2025: Philip Frey — Art Talk (August)
2026: TBD
EOF

# ── Guest Artists README ──
cat > "$TARGET/Guest Artists 2026/WHAT_TO_UPLOAD.txt" <<EOF
Guest Artists 2026

Each guest artist should upload:
- headshot.jpg (minimum 400x400)
- bio.txt (2-3 sentences)
- 2-3 artwork photos (title-of-piece.jpg)
- artwork-list.txt (title, medium, size for each piece)

Create a subfolder for each guest artist.
EOF

# ── Documents README ──
cat > "$TARGET/Documents/WHAT_TO_UPLOAD.txt" <<EOF
Documents

Store shared documents here:
- Guest Artist Application form (PDF)
- Membership guidelines
- Show setup checklists
- Financial reports
- Meeting notes
EOF

# ── Logo & Branding README ──
cat > "$TARGET/Logo & Branding/WHAT_TO_UPLOAD.txt" <<EOF
Logo & Branding

Upload brand assets here:
- FA logo (PNG with transparent background, plus JPG)
- Color palette reference
- Any signage designs
- Social media profile/cover images
EOF

# ── Master spreadsheet placeholder ──
cat > "$TARGET/Farmstead_Website_Data_README.txt" <<EOF
Farmstead Website Data

Create a Google Sheet called "Farmstead_Website_Data" with tabs:

Tab 1: Artists
  Name | Bio | Medium | Website | Headshot Filename

Tab 2: Shows 2026
  Date | Title | Hours | Notes | Guest Speaker

Tab 3: Guest Artists
  Name | Show Date | Bio | Medium

Tab 4: Artwork Catalog (future)
  Artist | Title | Medium | Size | Price | Photo Filename | Status
EOF

# ── Summary ──
echo "✅ Folder structure created!"
echo ""
echo "📂 Contents:"
find "$TARGET" -type d | sort | sed "s|$TARGET|  Farmstead_Website|"
echo ""
echo "📊 Stats:"
echo "   $(find "$TARGET" -type d | wc -l | xargs) folders"
echo "   $(find "$TARGET" -type f | wc -l | xargs) guide files"
echo ""
echo "Next steps:"
echo "  1. Open Google Drive: https://drive.google.com/drive/folders/1xCdzv7MzAJ6uFlNrKy_cUiVBblm5PZQ4"
echo "  2. Drag the entire '$TARGET' folder into it"
echo "  3. Or: right-click in Drive → Upload folder → select Farmstead_Website"
echo ""
### END-OF-FILE
