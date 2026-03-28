// gallery_page.js
// src/app/gallery/page.js
// Desc:   Public artwork gallery — browse, filter by medium,
//         price, size. Lightbox on click. Links to artist page.
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Lightbox from '@/components/lightbox'

export default function GalleryPage() {
  const [artworks, setArtworks]       = useState([])
  const [filtered, setFiltered]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)

  // Filters
  const [medium, setMedium]           = useState('All')
  const [maxPrice, setMaxPrice]       = useState('')
  const [maxWidth, setMaxWidth]       = useState('')
  const [maxHeight, setMaxHeight]     = useState('')
  const [mediumOptions, setMediumOptions] = useState(['All'])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('artworks')
        .select(`
          id, title, medium, size, price, photo_url,
          description, status, width_in, height_in,
          artists (id, name, slug, photo_url)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      const results = data || []
      setArtworks(results)
      setFiltered(results)

      const mediums = ['All', ...new Set(
        results.map(a => a.medium).filter(Boolean).map(m => m.trim())
      )]
      setMediumOptions(mediums)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let results = [...artworks]
    if (medium !== 'All') {
      results = results.filter(a => a.medium && a.medium.toLowerCase().includes(medium.toLowerCase()))
    }
    if (maxPrice)  results = results.filter(a => a.price    && a.price    <= parseFloat(maxPrice))
    if (maxWidth)  results = results.filter(a => a.width_in && a.width_in <= parseFloat(maxWidth))
    if (maxHeight) results = results.filter(a => a.height_in && a.height_in <= parseFloat(maxHeight))
    setFiltered(results)
  }, [medium, maxPrice, maxWidth, maxHeight, artworks])

  function clearFilters() {
    setMedium('All'); setMaxPrice(''); setMaxWidth(''); setMaxHeight('')
  }

  const hasFilters = medium !== 'All' || maxPrice || maxWidth || maxHeight

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <p className="text-gray-400 font-light">Loading gallery...</p>
    </section>
  )

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">

      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Available Work</div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-2">Gallery</h1>
      <p className="text-gray-500 font-light mb-8 max-w-lg">
        Original artwork by Farmstead Artists members. Click any piece to enlarge.
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 border border-black/[0.04] shadow-sm mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Medium</label>
            <select value={medium} onChange={e => setMedium(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none">
              {mediumOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Max Price ($)</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              placeholder="e.g. 200" min="0"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Max Width (in)</label>
            <input type="number" value={maxWidth} onChange={e => setMaxWidth(e.target.value)}
              placeholder="e.g. 18" min="0"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Max Height (in)</label>
            <input type="number" value={maxHeight} onChange={e => setMaxHeight(e.target.value)}
              placeholder="e.g. 22" min="0"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none" />
          </div>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="mt-4 text-sm text-sage-600 underline font-medium">
            Clear all filters
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400 font-light mb-4">
        {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} available
      </p>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-light text-lg">No artwork matches your filters.</p>
          <button onClick={clearFilters} className="mt-4 text-sage-600 underline text-sm">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(work => (
            <div key={work.id}
              className="bg-white rounded-xl overflow-hidden border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow">

              {/* Photo — click to enlarge */}
              <div
                className="aspect-square bg-cream-200 overflow-hidden cursor-pointer"
                onClick={() => setSelected({ ...work, artistName: work.artists?.name })}
              >
                {work.photo_url ? (
                  <img src={work.photo_url} alt={work.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-300 text-xs">No photo</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <h3
                  className="font-serif font-semibold text-sage-700 text-sm leading-tight truncate cursor-pointer hover:text-sage-500"
                  onClick={() => setSelected({ ...work, artistName: work.artists?.name })}
                >
                  {work.title}
                </h3>
                {work.medium && <p className="text-xs text-gray-400 font-light mt-0.5">{work.medium}</p>}
                {(work.width_in || work.size) && (
                  <p className="text-xs text-gray-400 font-light">
                    {work.width_in && work.height_in ? `${work.width_in} × ${work.height_in} in` : work.size}
                  </p>
                )}
                {work.price && (
                  <p className="text-sage-600 font-semibold text-sm mt-1">${work.price.toLocaleString()}</p>
                )}
                {work.artists && (
                  <Link href={`/artists/${work.artists.slug}`}
                    className="text-xs text-gray-400 hover:text-sage-600 transition-colors mt-1 block">
                    by {work.artists.name}
                  </Link>
                )}
                <Link href={`/gallery/${work.id}/inquire`}
                  className="block w-full text-center mt-3 py-2.5 bg-sage-600 text-cream-50 rounded-lg text-sm font-semibold hover:bg-sage-500 transition-colors">
                  I'm Interested
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && <Lightbox work={selected} onClose={() => setSelected(null)} />}

    </section>
  )
}

// end of file
