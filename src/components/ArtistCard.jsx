// ============================================================
// Script: ArtistCard.jsx
// Path:   src/components/ArtistCard.jsx
// Desc:   Clickable artist card — links to /artists/[slug]
// ============================================================

import Link from 'next/link'

const gradients = [
  ['#5B7B6A', '#89A7B5'], ['#7B9E87', '#536B78'], ['#89A7B5', '#5B7B6A'],
  ['#7BAF8E', '#6E8FA0'], ['#536B78', '#7B9E87'], ['#5B7B6A', '#C2A96E'],
  ['#89A7B5', '#7BAF8E'], ['#7B9E87', '#89A7B5'], ['#5B7B6A', '#7BAF8E'],
  ['#C2A96E', '#5B7B6A'], ['#7BAF8E', '#536B78'], ['#89A7B5', '#C2A96E'],
  ['#536B78', '#7BAF8E'], ['#7B9E87', '#5B7B6A'], ['#5B7B6A', '#89A7B5'],
]

export default function ArtistCard({ name, slug, index = 0, photo = null }) {
  const initials = name.split(' ').map(w => w[0]).join('')
  const [c1, c2] = gradients[index % gradients.length]

  return (
    <Link href={`/artists/${slug}`} className="block">
      <div className="bg-cream-50 rounded-lg p-4 text-center border border-black/[0.04] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-14 h-14 rounded-full mx-auto mb-2 object-cover"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center font-serif text-white text-lg font-semibold"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {initials}
          </div>
        )}
        <div className="font-serif text-sm font-semibold text-sage-700">{name}</div>
        <div className="text-xs text-sage-500/70 mt-0.5">Member Artist</div>
      </div>
    </Link>
  )
}

// end of file
