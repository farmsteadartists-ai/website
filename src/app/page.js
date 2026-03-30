// home_page.js
// src/app/page.js
// Desc:   Home page — hero, about, artists, calendar,
//         history, signup, directions, contact
// ============================================================

import shows from '@/data/shows.json'
import site from '@/data/site.json'

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="/images/barn/barn-exterior.jpg"
            alt="The Farmstead Barn, East Sullivan, Maine"
            className="w-full h-full object-cover opacity-45"
          />
        </div>
        <div className="relative z-10 text-cream-50">
          <span className="inline-block text-sm font-bold tracking-[0.2em] uppercase text-gold border-2 border-gold/60 px-4 py-2 rounded-sm mb-5">
            East Sullivan, Maine
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] mb-3">
            Farmstead<br />Artists
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-md mx-auto">
            Original art in a historic barn on Route 1. Four weekends each summer since 2022.
          </p>
          <div className="inline-block bg-black/30 border border-white/15 rounded-md px-6 py-4">
            <div className="text-[0.65rem] uppercase tracking-[0.18em] text-gold font-semibold mb-1">Next Show</div>
            <div className="font-serif text-xl font-semibold">{shows.shows[0].dates}, {shows.season}</div>
            <div className="text-sm opacity-70 font-light">Fri–Sat {shows.hours.friday} · Sun {shows.hours.sunday}</div>
          </div>
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

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-14 px-6 md:px-16 bg-cream-100">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Get in Touch</div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-sage-700 mb-5">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-lg shrink-0">✉</div>
            <div>
              <a href={`mailto:${site.contact.email}`} className="text-sage-700 font-medium text-sm">{site.contact.email}</a>
              <small className="block text-sage-500/70 text-xs font-light">General inquiries &amp; show information</small>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-lg shrink-0">📞</div>
            <div>
              <div className="text-sage-700 font-medium text-sm">{site.contact.phone}</div>
              <small className="block text-sage-500/70 text-xs font-light mb-1">{site.contact.phoneName}</small>
              <a
                href={`tel:${site.contact.phone.replace(/-/g, '')}`}
                className="inline-block px-3 py-1 bg-sage-600 text-cream-50 rounded text-xs font-semibold hover:bg-sage-500 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-md border border-black/[0.04] flex-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-lg shrink-0">f</div>
            <div>
              <a href={site.social.facebook} target="_blank" className="text-sage-700 font-medium text-sm">Facebook</a>
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
    </>
  )
}

// end of file
