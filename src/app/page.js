// home_page.js
// src/app/page.js
// Desc:   Home page — hero, about, artists, calendar,
//         history, signup, directions, contact
// ============================================================

import shows from '@/data/shows.json'
import site from '@/data/site.json'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Flexit Cafe show — May 12 to June 10, 2026
// Remove this array after the show ends and restore barn hero
const flexitArtists = [
  { name: 'Suzanne Becque', slug: 'suzanne-becque', img: '/images/flexit/01-suzanne.jpg' },
  { name: 'Steve Brookman', slug: 'steve-brookman', img: '/images/flexit/02-steve.jpg' },
  { name: 'Mavis Davis', slug: 'mavis-davis', img: '/images/flexit/03-mavis.jpg' },
  { name: 'Mary Laury', slug: 'mary-laury', img: '/images/flexit/04-mary.jpg' },
  { name: 'Pamela Hall', slug: 'pamela-hall', img: '/images/flexit/05-pamela.jpg' },
  { name: 'Janis Guyette', slug: 'janis-guyette', img: '/images/flexit/06-janis.jpg' },
  { name: 'Linda Malaussena', slug: 'linda-malaussena', img: '/images/flexit/07-linda.jpg' },
  { name: 'Penny Ricker', slug: 'penny-ricker', img: '/images/flexit/08-penny.jpg' },
  { name: 'Carol Michaud', slug: 'carol-michaud', img: '/images/flexit/09-carol.jpg' },
  { name: 'Becky O\'Keefe', slug: 'becky-okeefe', img: '/images/flexit/10-becky.jpg' },
]

export default async function HomePage() {
  const { data: members } = await supabase
    .from('artists')
    .select('name, slug, medium, photo_url')
    .eq('role', 'member')
    .order('sort_order')
  return (
    <>
      {/* ===== HERO — Flexit Cafe Show ===== */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-14 bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="/images/barn/barn-exterior.jpg"
            alt="The Farmstead Barn, East Sullivan, Maine"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-cream-50 w-full max-w-2xl">
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-[1.1] mb-1">
            Farmstead Artists
          </h1>
          <p className="text-gold font-semibold text-sm uppercase tracking-[0.2em] mb-5">NOW SHOWING at FLEXIT CAFE</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/images/flexit/12-FA-logo.jpg" alt="Farmstead Artists" className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-contain" />
            <div className="bg-black/40 border border-white/15 rounded-lg px-5 py-3">
              <div className="font-serif text-xl md:text-2xl font-bold">May 12 – June 10, 2026</div>
              <div className="text-xs opacity-80 font-light mt-1">142 Main St, Ellsworth · Mon–Sat 7am–3pm</div>
              <div className="text-gold text-xs font-semibold mt-1">Reception Saturday, May 16th</div>
            </div>
            <img src="/images/flexit/11-flexit-logo.jpg" alt="Flexit Cafe" className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-contain" />
          </div>
          <div className="grid grid-cols-5 gap-1.5 md:gap-2 mb-1">
            {flexitArtists.slice(0, 5).map((a) => (
              <Link key={a.slug} href={`/artists/${a.slug}`} className="group">
                <div className="aspect-square rounded overflow-hidden border border-white/20">
                  <img src={a.img} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-cream-50/70 text-[0.5rem] md:text-[0.65rem] mt-1 font-light leading-tight truncate">{a.name}</div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5 md:gap-2 mb-5">
            {flexitArtists.slice(5, 10).map((a) => (
              <Link key={a.slug} href={`/artists/${a.slug}`} className="group">
                <div className="aspect-square rounded overflow-hidden border border-white/20">
                  <img src={a.img} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-cream-50/70 text-[0.5rem] md:text-[0.65rem] mt-1 font-light leading-tight truncate">{a.name}</div>
              </Link>
            ))}
          </div>
          <p className="text-cream-50 font-serif text-sm tracking-wide">2816 Route 1, Sullivan ME 04664</p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-14 px-6 md:px-16 bg-cream-50">
        <div className="max-w-2xl">
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">About Us</div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-sage-700 mb-4 leading-tight">
              Community Art in a<br />Historic Setting
            </h2>
            <p className="text-gray-600 font-light mb-4 leading-relaxed">
              The Farmstead Artists are a select group of community, non-represented artists who display and sell
              original artwork at the Farmstead Barn — a beautifully weathered structure on Route 1 in East Sullivan,
              Maine that dates back to 1803.
            </p>
            <blockquote className="border-l-[3px] border-sage-600 pl-5 my-6 font-serif italic text-lg text-sage-700 leading-relaxed">
              &ldquo;So many people came to the shows and shared their childhood memories of the barn.&rdquo;
            </blockquote>
            <p className="text-gray-600 font-light leading-relaxed">
              Since our first summer in 2022, we&rsquo;ve grown into a collective of {site.stats.memberCount} members,
              welcoming guest artists each season and drawing visitors from across Downeast Maine and beyond.
              Our shows feature watercolors, oils, acrylics, collages, and drawings — plus prints and cards.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
              <div className="text-center py-4 px-2 bg-cream-100 rounded-md">
                <span className="font-serif text-2xl font-bold text-sage-600 block">{site.stats.piecesSold2025}</span>
                <span className="text-[0.7rem] uppercase tracking-wider text-sage-500/70 font-medium">Pieces sold<br />in 2025</span>
              </div>
              <div className="text-center py-4 px-2 bg-cream-100 rounded-md">
                <span className="font-serif text-2xl font-bold text-sage-600 block">{site.stats.summers}</span>
                <span className="text-[0.7rem] uppercase tracking-wider text-sage-500/70 font-medium">Summers<br />&amp; counting</span>
              </div>
              <div className="text-center py-4 px-2 bg-cream-100 rounded-md">
                <span className="font-serif text-2xl font-bold text-sage-600 block">{site.stats.memberCount}</span>
                <span className="text-[0.7rem] uppercase tracking-wider text-sage-500/70 font-medium">Member<br />artists</span>
              </div>
            </div>
        </div>
      </section>

      {/* ===== ARTISTS — mobile only ===== */}
      <section id="artists" className="md:hidden py-14 px-6 bg-cream-100">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Our Artists</div>
        <h2 className="font-serif text-3xl font-semibold text-sage-700 mb-4">Member Artists</h2>
        <div className="grid grid-cols-2 gap-4">
          {(members || []).map(artist => (
            <Link key={artist.slug} href={`/artists/${artist.slug}`} className="group block">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-sage-600/10 relative">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-3xl font-bold text-sage-600/30">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="font-serif font-semibold text-cream-50 text-sm leading-tight">{artist.name}</div>
                  {artist.medium && <div className="text-[0.65rem] text-cream-50/70 font-light mt-0.5">{artist.medium}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/artists" className="block mt-6 text-center py-3 border border-sage-600 text-sage-600 rounded font-semibold text-sm hover:bg-sage-600/5 transition-colors">
          View All Artists →
        </Link>
      </section>

      {/* ===== CALENDAR ===== */}
      <section id="calendar" className="py-14 px-6 md:px-16 bg-sage-600 text-cream-50">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-gold font-semibold mb-2">{shows.season} Season</div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">Show Dates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {shows.shows.map((show) => (
            <div key={show.startDate} className="bg-white/[0.07] border border-white/10 rounded-lg p-4 text-center">
              <div className="font-serif text-2xl font-bold text-gold leading-none">{show.days}</div>
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/50 font-semibold mt-1">{show.month}</div>
              <div className="text-xs opacity-50 font-light mt-1">{show.title}</div>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.07] border border-white/10 rounded-lg p-4">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=farmsteadartists%40gmail.com&ctz=America%2FNew_York&mode=AGENDA&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&bgcolor=%23ffffff"
            className="w-full rounded"
            style={{ border: 0, minHeight: '400px' }}
            frameBorder="0"
            scrolling="no"
          />
          <p className="text-center text-xs opacity-50 mt-3 font-light">
            Fri–Sat {shows.hours.friday} · Sun {shows.hours.sunday}
          </p>
        </div>
        <div className="mt-6 text-center">
          <a href="#signup" className="inline-block text-gold text-sm font-medium tracking-wider uppercase border border-gold/40 px-6 py-2.5 rounded hover:bg-gold/15 transition-colors">
            Get show reminders →
          </a>
        </div>
      </section>

      {/* ===== BARN HISTORY ===== */}
      <section id="history" className="py-14 px-6 md:px-16 bg-cream-200">
        <div className="max-w-2xl">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">The Barn</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-sage-700 mb-6">A Story Since 1803</h2>
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(to bottom, #B22222, #E84545)' }} />
            {[
              { year: '1803', text: 'Built as a milk farm on the shore of Sullivan.' },
              { year: 'Late 1800s', text: 'The barn was moved across to the other side of what is now Route 1.' },
              { year: '1940s–50s', text: 'Operated as a Tea House offering simple food and fortune telling.' },
              { year: '1972–2012', text: 'For forty years, Ginia Davis Wexler — an internationally renowned operatic performer — hosted summer theater and children\'s arts programming.' },
              { year: '2018', text: 'Judy Ashby and Ray Weintraub purchased the property with hopes of reopening it as an event center.' },
              { year: '2022', text: 'The Farmstead Artists held their first summer shows — and the barn came alive with art once more.' },
            ].map((item) => (
              <div key={item.year} className="relative mb-6 pl-4">
                <div className="absolute -left-[1.55rem] top-1.5 w-2 h-2 rounded-full bg-sage-600 border-2 border-cream-200" />
                <div className="font-serif font-bold text-sage-600">{item.year}</div>
                <div className="text-gray-500 font-light text-[0.92rem] mt-0.5">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EMAIL SIGNUP ===== */}
      <section id="signup" className="py-14 px-6 md:px-16 bg-sage-500 text-cream-50 text-center">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50 font-semibold mb-2">Stay in Touch</div>
        <h2 className="font-serif text-3xl font-semibold mb-3">Show Reminders<br />&amp; News</h2>
        <p className="opacity-80 font-light mb-6 text-[0.95rem]">
          Get notified before each show weekend, plus news about guest speakers and special events.
        </p>
        <a
          href="https://forms.gle/7XakUGhunzhDPLuZ6"
          target="_blank"
          className="inline-block px-8 py-3 bg-cream-50 text-sage-600 rounded font-semibold text-sm uppercase tracking-wider hover:bg-white hover:-translate-y-0.5 transition-all"
        >
          Sign Up for Show Reminders
        </a>
      </section>

      {/* ===== DIRECTIONS ===== */}
      <section id="directions" className="py-14 px-6 md:px-16 bg-cream-50">
        <div className="max-w-2xl">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Visit Us</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-sage-700 mb-4">Find the Barn</h2>
          <div className="bg-cream-100 rounded-lg p-6 border border-black/[0.04]">
            <h3 className="font-serif text-lg text-sage-700 mb-1">{site.address.venue}</h3>
            <p className="text-gray-500 font-light">
              {site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}
            </p>
            <iframe
              className="w-full h-64 border-none rounded-lg mt-4"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2800!2d${site.address.lng}!3d${site.address.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4caec3bf9cb6e725%3A0xa5f6931321738f24!2sFarmstead%20Barn!5e0!3m2!1sen!2sus!4v1`}
              allowFullScreen
              loading="lazy"
            />
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/dir//Farmstead+Barn,+2816+US-1,+East+Sullivan,+ME+04664/@${site.address.lat},${site.address.lng},15z`}
                target="_blank"
                className="block w-full text-center py-3 bg-sage-600 text-cream-50 rounded font-medium text-sm hover:bg-sage-500 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT — 4 boxes horizontal ===== */}
      <section id="contact" className="py-14 px-6 md:px-16 bg-cream-100">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Get in Touch</div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-sage-700 mb-5">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-lg shrink-0">✉</div>
            <div>
              <a href={`mailto:${site.contact.email}`} className="text-sage-700 font-semibold text-sm hover:underline">{site.contact.email}</a>
              <small className="block text-sage-500/70 text-xs font-light">General inquiries &amp; show info</small>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-lg shrink-0">📞</div>
            <div>
              <div className="text-sage-700 font-semibold text-sm">Carol Michaud</div>
              <small className="block text-sage-500/70 text-xs font-light">Public Relations</small>
              <a href="tel:2079749366" className="text-sage-600 font-semibold text-sm hover:underline">207-974-9366</a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-lg shrink-0">🎨</div>
            <div>
              <div className="text-sage-700 font-semibold text-sm">Suzanne Becque</div>
              <small className="block text-sage-500/70 text-xs font-light">Guest artist inquiries</small>
              <a href="mailto:suzannebecque@gmail.com" className="text-sage-700 text-xs block hover:underline">suzannebecque@gmail.com</a>
              <a href="tel:2072148730" className="text-sage-600 font-semibold text-sm hover:underline">207-214-8730</a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-lg shrink-0">f</div>
            <div>
              <a href={site.social.facebook} target="_blank" className="text-sage-700 font-semibold text-sm hover:underline">Facebook</a>
              <small className="block text-sage-500/70 text-xs font-light">Photos &amp; show updates</small>
            </div>
          </div>
        </div>

        {/* GUEST ARTIST APPLICATION */}
        <div className="mt-10">
          <h3 className="font-serif text-2xl font-semibold text-sage-700 mb-3">Apply as a Guest Artist</h3>
          <p className="text-gray-600 font-light leading-relaxed mb-4">
            Maine artists are welcome to apply as Guest Artists for the {shows.season} summer season.
            Download the application form, fill it out, and send it to{' '}
            <a href="mailto:suzannebecque@gmail.com" className="text-sage-600 font-medium">suzannebecque@gmail.com</a>.
          </p>
          <a
            href="/forms/Guest Artist Application.pdf"
            download
            className="inline-block bg-sage-600 text-cream-50 px-6 py-3 rounded font-semibold text-sm tracking-wide hover:bg-sage-500 transition-colors"
          >
            Download Application (PDF)
          </a>
        </div>

        {/* PRIOR PRESENTATIONS */}
        <div className="mt-10">
          <h3 className="font-serif text-2xl font-semibold text-sage-700 mb-3">Past Presentations</h3>
          <p className="text-gray-600 font-light leading-relaxed mb-4">
            Each summer we host special events including art talks by established Maine artists.
          </p>
          <div className="space-y-3">
            <div className="bg-cream-50 rounded-lg p-5 border border-black/[0.04]">
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-sage-500 font-semibold mb-1">August 2025</div>
              <h4 className="font-serif text-lg font-semibold text-sage-700">Philip Frey — Art Talk</h4>
              <p className="text-gray-500 font-light text-sm leading-relaxed mt-1">
                Maine artist Philip Frey, a Sullivan resident and nationally exhibiting painter best known
                for his bold paintings of Maine, gave a standing-room-only presentation. Phil discussed his
                development as an artist, what motivates and inspires his growth, and how he promotes his work
                in a way that sustains his passion and livelihood. He brought several original paintings on
                display and raffled three copies of his book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADDRESS ===== */}
      <section className="bg-charcoal py-5 text-center">
        <p className="text-white font-serif text-lg md:text-xl font-semibold tracking-wide">
          2816 US-1 · Sullivan, ME 04664
        </p>
      </section>
    </>
  )
}

// end of file
