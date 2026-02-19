import ArtistCard from '@/components/ArtistCard'
import artists from '@/data/artists.json'

export const metadata = {
  title: 'Artists — Farmstead Artists',
  description: 'Meet the 15 member artists of Farmstead Artists in East Sullivan, Maine.',
}

export default function ArtistsPage() {
  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">
      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Our Artists</div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-2">Member Artists</h1>
      <p className="text-gray-500 font-light mb-8 max-w-lg">
        Our collective of {artists.members.length} artists works in a variety of media including watercolors,
        oils, acrylics, collages, and drawings.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {artists.members.map((artist, i) => (
          <ArtistCard key={artist.slug} name={artist.name} index={i} />
        ))}
      </div>

      {/* Guest Artists */}
      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">2025 Guest Artists</div>
        <p className="text-gray-500 font-light mb-4 text-sm">
          Each show weekend we welcome guest artists who bring fresh perspectives and new work.
        </p>
        <div className="flex flex-wrap gap-2">
          {artists.guests2025.map(name => (
            <span key={name} className="bg-cream-50 border border-black/[0.06] px-3 py-1.5 rounded-full text-sm text-sage-500">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 rounded-lg text-center text-cream-50" style={{ background: 'linear-gradient(135deg, #89A7B5, #5B7B6A)' }}>
        <h2 className="font-serif text-xl font-semibold mb-2">Interested in Showing Your Work?</h2>
        <p className="opacity-80 font-light text-sm mb-4">
          Maine artists are welcome to apply as Guest Artists for the 2026 summer season.
        </p>
        <a
          href="mailto:farmsteadartists@gmail.com?subject=Guest Artist Inquiry"
          className="inline-block bg-cream-50 text-sage-700 px-6 py-2.5 rounded font-semibold text-sm hover:-translate-y-0.5 transition-all"
        >
          Apply as Guest Artist
        </a>
      </div>
    </section>
  )
}
