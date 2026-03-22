// ============================================================
// Script: page.js (contact)
// Path:   src/app/contact/page.js
// Desc:   Contact page with social links, barn info,
//         and guest artist PDF application download
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
      <div className="max-w-2xl">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Get in Touch</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-6">Contact Us</h1>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-5 bg-cream-50 rounded-lg border border-black/[0.04]">
            <div className="w-12 h-12 rounded-full bg-sage-600/10 flex items-center justify-center text-xl shrink-0">✉</div>
            <div>
              <a href={`mailto:${site.contact.email}`} className="text-sage-700 font-semibold text-lg">{site.contact.email}</a>
              <p className="text-sage-500/70 text-sm font-light">General inquiries, guest artist applications, and show information</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-cream-50 rounded-lg border border-black/[0.04]">
            <div className="w-12 h-12 rounded-full bg-sage-600/10 flex items-center justify-center text-xl shrink-0">📞</div>
            <div>
              <a href={`tel:${site.contact.phone.replace(/-/g, '')}`} className="text-sage-700 font-semibold text-lg">{site.contact.phone}</a>
              <p className="text-sage-500/70 text-sm font-light">{site.contact.phoneName} — Group contact</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-cream-50 rounded-lg border border-black/[0.04]">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-xl shrink-0">f</div>
            <div>
              <a href={site.social.facebook} target="_blank" className="text-sage-700 font-semibold text-lg">Facebook</a>
              <p className="text-sage-500/70 text-sm font-light">Follow us for photos, show updates, and event announcements</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-cream-50 rounded-lg border border-black/[0.04]">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-xl shrink-0">◎</div>
            <div>
              <a href={site.social.instagram} target="_blank" className="text-sage-700 font-semibold text-lg">Instagram</a>
              <p className="text-sage-500/70 text-sm font-light">See artwork and barn life</p>
            </div>
          </div>
        </div>

        {/* Guest Artist Application */}
        <div className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-sage-700 mb-3">Apply as a Guest Artist</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-4">
            Maine artists are welcome to apply as Guest Artists for the {shows.season} summer season.
            Download the application form, fill it out, and email it to us.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/forms/Guest Artist Application.pdf"
              target="_blank"
              className="inline-block bg-sage-600 text-cream-50 px-6 py-3 rounded font-semibold text-sm tracking-wide hover:bg-sage-500 transition-colors"
            >
              Download Application (PDF)
            </a>
            <a
              href={`mailto:${site.contact.email}?subject=Guest Artist Application — ${shows.season}`}
              className="inline-block border border-sage-600 text-sage-600 px-6 py-3 rounded font-semibold text-sm tracking-wide hover:bg-sage-600/5 transition-colors"
            >
              Email Application
            </a>
          </div>
        </div>

        {/* Barn contact */}
        <div className="mt-10 p-6 bg-cream-200 rounded-lg">
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

      </div>
    </section>
  )
}

// end of file
