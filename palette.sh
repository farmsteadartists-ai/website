#!/bin/bash
# ============================================================
# Farmstead Artists — Palette Switcher
# Usage: ./palette.sh [green|red] [low|med|high]
# Example: ./palette.sh red med
# ============================================================

TAILWIND="tailwind.config.js"

if [ ! -f "$TAILWIND" ]; then
  echo "Error: Run this from /Users/website/farmstead-website/"
  exit 1
fi

COLOR="${1:-green}"
SAT="${2:-med}"

echo ""
echo "🎨 Farmstead Palette Switcher"
echo "   Color: $COLOR | Saturation: $SAT"
echo ""

# Each palette defines 10 shades (50-900) for the sage/primary color
# Format: 50 100 200 300 400 500 600 700 800 900

case "${COLOR}-${SAT}" in

  # ── GREEN LOW (muted, dusty sage — current default) ──
  green-low)
    C50="#FAFCF7"  C100="#EEF3E8" C200="#D4E4C8" C300="#B5CFA0"
    C400="#8EAF93" C500="#7B9E87"  C600="#5B7B6A" C700="#4A6358"
    C800="#3A4D44" C900="#2A3832"
    LABEL="Green Low — Dusty Sage"
    ;;

  # ── GREEN MED (classic forest sage) ──
  green-med)
    C50="#F5FAF5"  C100="#E2F0E2" C200="#BDD9BD" C300="#8FC08F"
    C400="#6BAF6B" C500="#5A9E5A"  C600="#3D7B3D" C700="#306330"
    C800="#264D26" C900="#1C381C"
    LABEL="Green Med — Forest Sage"
    ;;

  # ── GREEN HIGH (vibrant spring green) ──
  green-high)
    C50="#F0FCF0"  C100="#D5F5D5" C200="#A3E8A3" C300="#6BD86B"
    C400="#45C745" C500="#32B232"  C600="#228B22" C700="#1A711A"
    C800="#145814" C900="#0E400E"
    LABEL="Green High — Spring Green"
    ;;

  # ── RED LOW (muted barn, dusty rose) ──
  red-low)
    C50="#FDF8F7"  C100="#F3ECEA" C200="#E4CFC8" C300="#CFA8A0"
    C400="#AF8B8B" C500="#9E7B7B"  C600="#7B5B5B" C700="#634A4A"
    C800="#4D3A3A" C900="#382A2A"
    LABEL="Red Low — Dusty Barn"
    ;;

  # ── RED MED (warm barn red) ──
  red-med)
    C50="#FDF5F5"  C100="#F5E0E0" C200="#E8B8B8" C300="#D48A8A"
    C400="#C06868" C500="#AB5252"  C600="#8B3A3A" C700="#712E2E"
    C800="#582424" C900="#401A1A"
    LABEL="Red Med — Warm Barn"
    ;;

  # ── RED HIGH (rich, saturated barn red) ──
  red-high)
    C50="#FEF2F2"  C100="#FCD5D5" C200="#F5A3A3" C300="#EF6B6B"
    C400="#E84545" C500="#D43232"  C600="#B22222" C700="#911A1A"
    C800="#701414" C900="#500E0E"
    LABEL="Red High — Bold Barn"
    ;;

  *)
    echo "Usage: ./palette.sh [green|red] [low|med|high]"
    echo ""
    echo "  Palettes:"
    echo "    green low  — Dusty Sage (original)"
    echo "    green med  — Forest Sage"
    echo "    green high — Spring Green"
    echo "    red low    — Dusty Barn"
    echo "    red med    — Warm Barn"
    echo "    red high   — Bold Barn"
    echo ""
    exit 1
    ;;
esac

# ── Apply to tailwind.config.js ──
# We replace lines by matching the shade keys
sed -i '' \
  -e "s/50: '.*'/50: '${C50}'/" \
  -e "s/100: '.*'/100: '${C100}'/" \
  -e "s/200: '.*'/200: '${C200}'/" \
  -e "s/300: '.*'/300: '${C300}'/" \
  -e "s/400: '.*'/400: '${C400}'/" \
  -e "s/500: '.*'/500: '${C500}'/" \
  -e "s/600: '.*'/600: '${C600}'/" \
  -e "s/700: '.*'/700: '${C700}'/" \
  -e "s/800: '.*'/800: '${C800}'/" \
  -e "s/900: '.*'/900: '${C900}'/" \
  "$TAILWIND"

# ── Also update hardcoded hex colors in page.js and globals.css ──
# The navbar, calendar, signup sections use sage-600 (#5B7B6A) hardcoded in some inline styles
PAGE="src/app/page.js"
CSS="src/app/globals.css"

if [ -f "$PAGE" ]; then
  # Update inline style hex colors (timeline, gradients)
  sed -i '' \
    -e "s/#5B7B6A/${C600}/g" \
    -e "s/#7B9E87/${C500}/g" \
    -e "s/#89A7B5/${C400}/g" \
    -e "s/#7BAF8E/${C400}/g" \
    -e "s/#7B5B5B/${C600}/g" \
    -e "s/#9E7B7B/${C500}/g" \
    -e "s/#AF8B8B/${C400}/g" \
    -e "s/#3D7B3D/${C600}/g" \
    -e "s/#5A9E5A/${C500}/g" \
    -e "s/#6BAF6B/${C400}/g" \
    -e "s/#8B3A3A/${C600}/g" \
    -e "s/#AB5252/${C500}/g" \
    -e "s/#C06868/${C400}/g" \
    -e "s/#228B22/${C600}/g" \
    -e "s/#32B232/${C500}/g" \
    -e "s/#45C745/${C400}/g" \
    -e "s/#B22222/${C600}/g" \
    -e "s/#D43232/${C500}/g" \
    -e "s/#E84545/${C400}/g" \
    "$PAGE"
fi

if [ -f "$CSS" ]; then
  sed -i '' \
    -e "s/--sage-600: .*/--sage-600: ${C600};/" \
    -e "s/--sage-500: .*/--sage-500: ${C500};/" \
    -e "s/--sage-400: .*/--sage-400: ${C400};/" \
    "$CSS"
fi

echo "✅ Applied: $LABEL"
echo ""
echo "   50:  $C50    500: $C500"
echo "  100:  $C100    600: $C600"
echo "  200:  $C200    700: $C700"
echo "  300:  $C300    800: $C800"
echo "  400:  $C400    900: $C900"
echo ""
echo "🔄 Page should hot-reload. If not: rm -rf .next && npm run dev"
echo ""
