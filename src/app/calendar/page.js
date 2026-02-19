import shows from '@/data/shows.json'

export const metadata = {
  title: '2026 Shows — Farmstead Artists',
  description: 'Four art show weekends at the Farmstead Barn: June, July, August, and September 2026.',
}

export default function CalendarPage() {
  return (
    <section className="min-h-screen">
      {/* Hero calendar section */}
      <div className="py-14 px-6 md:px-16 bg-sage-600 text-cream-50">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-gold font-semibold mb-2">{shows.season} Season</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Show Dates</h1>
        <p className="opacity-80 font-light mb-8 max-w-md">
          Four weekends of original art at the Farmstead Barn on Route 1 in East Sullivan, Maine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {shows.shows.map((show) => (
            <div key={show.startDate} className="bg-white/[0.07] border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4">
                <div>
                  <div className="font-serif text-3xl font-bold text-gold leading-none">{show.days}</div>
                  <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/50 font-semibold mt-1">{show.month}</div>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold">{show.title}</h2>
                  <p className="text-sm opacity-65 font-light mt-1">
                    Friday & Saturday: {shows.hours.friday}<br />
                    Sunday: {shows.hours.sunday}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="py-14 px-6 md:px-16 bg-cream-50">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold text-sage-700 mb-4">What to Expect</h2>
          <div className="space-y-4 text-gray-600 font-light leading-relaxed">
            <p>
              Each show weekend features original artwork by our {shows.shows.length > 0 ? '15' : ''} member artists
              plus invited guest artists. You'll find watercolors, oils, acrylics, collages, and drawings in ink
              and colored pencil — plus prints and cards at every price point.
            </p>
            <p>
              Friday afternoons include a reception with light refreshments. Our August show traditionally
              features a guest speaker — in 2025, Maine artist Philip Frey gave a standing-room-only art talk.
            </p>
            <p>
              The Farmstead Barn is located at 2816 US-1 in East Sullivan, right on Route 1. Parking is free
              and the barn is accessible from the main road.
            </p>
          </div>

          {/* Subscribe CTA */}
          <div className="mt-10 p-6 bg-sage-500 rounded-lg text-cream-50 text-center">
            <h3 className="font-serif text-xl font-semibold mb-2">Never Miss a Show</h3>
            <p className="opacity-80 font-light text-sm mb-4">
              Get email reminders before each show weekend.
            </p>
            <a href="/#signup" className="inline-block bg-cream-50 text-sage-600 px-6 py-2.5 rounded font-semibold text-sm hover:-translate-y-0.5 transition-all">
              Subscribe for Reminders
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
