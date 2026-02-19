import site from '@/data/site.json'

export const metadata = {
  title: 'About — Farmstead Artists',
  description: 'The story of the Farmstead Artists and the historic Farmstead Barn in East Sullivan, Maine.',
}

export default function AboutPage() {
  return (
    <section className="py-14 px-6 md:px-16 bg-cream-50 min-h-screen">
      <div className="max-w-2xl">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">About Us</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-6 leading-tight">
          Our Story
        </h1>

        <p className="text-gray-600 font-light leading-relaxed mb-4">
          The Farmstead Artists are a select group of community, non-represented artists who display
          and sell original artwork at the Farmstead Barn — a beautifully weathered structure on Route 1
          in East Sullivan, Maine that dates back to 1803.
        </p>

        <p className="text-gray-600 font-light leading-relaxed mb-4">
          In the winter of 2022, Bonnie approached barn owners Judy Ashby and Ray Weintraub to ask if Hugo,
          Mavis Davis, and some other local artists might use the barn for summer art shows. They graciously
          agreed. The first year was successful beyond our hopes — so many people came to the shows and shared
          their childhood memories of the barn from when Ginia Davis Wexler offered summer programs, and many
          guests purchased art.
        </p>

        <p className="text-gray-600 font-light leading-relaxed mb-4">
          Since then, we've grown into a collective of {site.stats.memberCount} member artists. Each summer we host
          four show weekends — Friday through Sunday — featuring watercolors, oils, acrylics, collages, and
          drawings in ink and colored pencil, plus prints and cards. In 2025, we sold {site.stats.piecesSold2025} pieces
          of original art across {site.stats.showDays2025} show days.
        </p>

        <blockquote className="border-l-[3px] border-sage-600 pl-5 my-8 font-serif italic text-lg text-sage-700 leading-relaxed">
          "The second year was a continuation of community goodwill, good memories, good art, and sales.
          And thus it all began."
        </blockquote>

        <h2 className="font-serif text-2xl font-semibold text-sage-700 mt-10 mb-4">The Barn</h2>

        <div className="space-y-4 text-gray-600 font-light leading-relaxed">
          <p>
            The Farmstead Barn has a long history in the Town of Sullivan. Built in 1803 as a milk farm on the shore,
            the structure was moved in the late 1800s to the other side of what is now Route 1. In the 1940s and 50s,
            it operated as a Tea House offering simple food and fortune telling.
          </p>
          <p>
            For forty years, from approximately 1972 to 2012, the barn housed summer theater and children's arts
            programming organized and run by Ginia Davis Wexler — an internationally renowned operatic performer
            and activist in the New York performance scene. From 2012 the barn fell silent.
          </p>
          <p>
            In 2018, Judy Ashby and Ray Weintraub purchased the property with the hope of reopening the Farmstead
            Barn as an event center. We continue to be extremely grateful for their generosity and friendship.
          </p>
        </div>
      </div>
    </section>
  )
}
