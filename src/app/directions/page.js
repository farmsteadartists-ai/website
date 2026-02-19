import site from '@/data/site.json'

export const metadata = {
  title: 'Directions — Farmstead Artists',
  description: 'Find the Farmstead Barn at 2816 US-1, East Sullivan, ME 04664.',
}

export default function DirectionsPage() {
  return (
    <section className="py-14 px-6 md:px-16 bg-cream-50 min-h-screen">
      <div className="max-w-2xl">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Visit Us</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-6">Find the Barn</h1>

        <div className="bg-cream-100 rounded-lg p-6 border border-black/[0.04]">
          <h2 className="font-serif text-xl text-sage-700 mb-1">{site.address.venue}</h2>
          <p className="text-gray-500 font-light text-lg">
            {site.address.street}<br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </p>

          <iframe
            className="w-full h-80 border-none rounded-lg mt-6"
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2800!2d${site.address.lng}!3d${site.address.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4caec3bf9cb6e725%3A0xa5f6931321738f24!2sFarmstead%20Barn!5e0!3m2!1sen!2sus!4v1`}
            allowFullScreen
            loading="lazy"
          />

          <div className="flex gap-3 mt-4">
            <a
              href={`https://www.google.com/maps/dir//Farmstead+Barn,+2816+US-1,+East+Sullivan,+ME+04664/@${site.address.lat},${site.address.lng},15z`}
              target="_blank"
              className="flex-1 text-center py-3 bg-sage-600 text-cream-50 rounded font-medium hover:bg-sage-500 transition-colors"
            >
              Get Directions
            </a>
            <a
              href={`tel:${site.barnOwners.phone.replace(/-/g, '')}`}
              className="flex-1 text-center py-3 border border-sage-600 text-sage-600 rounded font-medium hover:bg-sage-600/5 transition-colors"
            >
              Call Barn ({site.barnOwners.phone})
            </a>
          </div>
        </div>

        <div className="mt-8 text-gray-600 font-light leading-relaxed">
          <h3 className="font-serif text-lg text-sage-700 font-semibold mb-2">Getting Here</h3>
          <p>
            The Farmstead Barn is located directly on US Route 1 in East Sullivan, between Ellsworth
            and Gouldsboro. Look for the historic barn on the west side of the road. Free parking is
            available on site.
          </p>
        </div>
      </div>
    </section>
  )
}
