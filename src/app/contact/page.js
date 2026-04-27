// contact_page.js
// src/app/contact/page.js
// Desc:   Contact page — 4 contact boxes (same as home page),
//         guest artist application, barn owner info
// ============================================================

import site from '@/data/site.json'
import shows from '@/data/shows.json'

export const metadata = {
  title: 'Contact — Farmstead Artists',
  description: 'Get in touch with the Farmstead Artists in East Sullivan, Maine.',
}

export default function ContactPage() {
  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">
      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Get in Touch</div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Guest Artist Application */}
      <div className="mt-10 max-w-2xl">
        <h2 className="font-serif text-2xl font-semibold text-sage-700 mb-3">Apply as a Guest Artist</h2>
        <p className="text-gray-600 font-light leading-relaxed mb-4">
          Maine artists are welcome to apply as Guest Artists for the {shows.season} summer season.
          Download the application form, fill it out, and send it to{' '}
          <a href="mailto:suzannebecque@gmail.com" className="text-sage-600 font-medium">suzannebecque@gmail.com</a>.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/forms/Guest Artist Application.pdf"
            download
            className="inline-block bg-sage-600 text-cream-50 px-6 py-3 rounded font-semibold text-sm tracking-wide hover:bg-sage-500 transition-colors"
          >
            Download Application (PDF)
          </a>
          <a
            href="mailto:suzannebecque@gmail.com?subject=Guest Artist Application — 2026"
            className="inline-block border border-sage-600 text-sage-600 px-6 py-3 rounded font-semibold text-sm tracking-wide hover:bg-sage-600/5 transition-colors"
          >
            Email (mobile)
          </a>
        </div>
      </div>

      {/* Barn contact */}
      <div className="mt-10 p-6 bg-cream-200 rounded-lg max-w-2xl">
        <h2 className="font-serif text-lg text-sage-700 font-semibold mb-2">The Farmstead Barn</h2>
        <p className="text-gray-600 font-light text-sm leading-relaxed">
          The barn is owned by {site.barnOwners.names}. For venue-related inquiries
          (non-art-show), please contact them at{' '}
          <a href={`tel:${site.barnOwners.phone.replace(/-/g, '')}`} className="text-sage-600 font-medium">
            {site.barnOwners.phone}
          </a>{' '}
          or visit{' '}
          <a href={site.barnOwners.website} target="_blank" className="text-sage-600 font-medium underline">
            farmsteadbarn.com
          </a>.
        </p>
      </div>
    </section>
  )
}

// end of file
