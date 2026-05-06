// marketing_page.js
// src/app/marketing/page.js
// Desc:   Marketing assets download page — logos, photos,
//         flyers, and other promo materials for FA members
//         With thumbnail previews for each asset
// ============================================================

export const metadata = {
  title: 'Marketing Assets — Farmstead Artists',
  description: 'Download logos, photos, and promotional materials for Farmstead Artists.',
}

const assets = [
  { section: 'Logos', items: [
    { name: 'Logo 2026 (High Res JPG)', file: 'Logo2026HR.jpg', size: '333 KB', preview: true },
    { name: 'Logo 2026 (High Res SVG)', file: 'Logo2026HR.svg', size: '84 KB', preview: true },
    { name: 'Logo 2026 (Large JPG)', file: 'Logo2026LG.jpg', size: '3.6 MB', preview: true },
    { name: 'Logo 2026 (Large PNG)', file: 'Logo2026LG.png', size: '3.2 MB', preview: true },
  ]},
  { section: 'Print Materials', items: [
    { name: '2026 Tri-Fold Brochure', file: '2026-tri-fold.pdf', size: '735 KB', preview: false },
    { name: 'QR Code', file: 'QRcode.png', size: '81 KB', preview: true },
  ]},
  { section: 'Barn Photos', items: [
    { name: 'Barn Exterior', file: 'barn-exterior.jpg', size: '2.3 MB', preview: true },
    { name: 'Barn Interior', file: 'barn-inside.jpg', size: '101 KB', preview: true },
    { name: 'Barn Winter', file: 'barn-winter.jpg', size: '37 KB', preview: true },
    { name: 'Barn (PNG)', file: 'barn.png', size: '96 KB', preview: true },
    { name: 'Build Indoors', file: 'build-indoors.jpg', size: '154 KB', preview: true },
  ]},
  { section: 'Events & Shows', items: [
    { name: 'Flexit Cafe 2026 Flyer', file: 'Flexit2026.jpg', size: '148 KB', preview: true },
    { name: 'Hammond Hall 2024', file: 'HammondHall2024.jpg', size: '35 KB', preview: true },
    { name: 'Map', file: 'map.jpg', size: '49 KB', preview: true },
  ]},
]

export default function MarketingPage() {
  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">
      <div className="max-w-2xl">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Resources</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-3">Marketing Assets</h1>
        <p className="text-gray-500 font-light mb-8">
          Download logos, photos, and promotional materials. These are the official assets — please use them as-is to keep our branding consistent.
        </p>

        {assets.map(group => (
          <div key={group.section} className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-sage-700 mb-3">{group.section}</h2>
            <div className="space-y-2">
              {group.items.map(item => (
                <a
                  key={item.file}
                  href={`/marketing/${item.file}`}
                  download
                  className="flex items-center gap-4 p-4 bg-cream-50 rounded-lg border border-black/[0.04] hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-black/[0.06]">
                    {item.preview ? (
                      <img
                        src={`/marketing/${item.file}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📄</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sage-700 font-medium text-sm">{item.name}</div>
                    <div className="text-sage-500/60 text-xs">{item.file} · {item.size}</div>
                  </div>
                  <span className="text-sage-600 text-lg font-bold shrink-0">↓</span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 p-5 bg-cream-200 rounded-lg">
          <p className="text-gray-600 font-light text-sm leading-relaxed">
            <strong className="text-sage-700">Usage guidelines:</strong> Always use the exact name "Farmstead Artists" and the unaltered logo. 
            For questions about branding or to request additional assets, contact{' '}
            <a href="mailto:farmsteadartists@gmail.com" className="text-sage-600 font-medium">farmsteadartists@gmail.com</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

// end of file
