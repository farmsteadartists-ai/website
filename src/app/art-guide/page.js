// art_guide_page.js
// src/app/art-guide/page.js
// Desc: Art Guide — Downeast Maine arts institutions directory
// ============================================================
'use client'

import { useEffect, useState } from 'react'

const CATEGORIES = ['All', 'nonprofit', 'gallery', 'school', 'studio', 'museum']

const CATEGORY_LABELS = {
  nonprofit: 'Arts Organization',
  gallery:   'Gallery',
  school:    'Arts School',
  studio:    'Studio',
  museum:    'Museum',
}

const CATEGORY_COLORS = {
  nonprofit: '#5b7b6a',
  gallery:   '#8b1a1a',
  school:    '#3a6186',
  studio:    '#7a5c2e',
  museum:    '#4a3f6b',
}

export default function ArtGuidePage() {
  const [institutions, setInstitutions] = useState([])
  const [filtered, setFiltered]         = useState([])
  const [category, setCategory]         = useState('All')
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data } = await sb
        .from('art_guide_institutions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      setInstitutions(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (category === 'All') {
      setFiltered(institutions)
    } else {
      setFiltered(institutions.filter(i => i.category === category))
    }
  }, [category, institutions])

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <p className="text-gray-400 font-light">Loading Art Guide…</p>
    </section>
  )

  const featured = filtered.filter(i => i.featured)
  const rest     = filtered.filter(i => !i.featured)

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">

      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Downeast Maine</div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-3">Art Guide</h1>
      <p className="text-gray-500 font-light mb-8 max-w-xl">
        A curated directory of galleries, arts organizations, schools, and studios across Downeast Maine.
        These are our neighbors, supporters, and fellow believers in the power of art.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              background: category === cat ? '#8b1a1a' : '#fff',
              color: category === cat ? '#fff' : '#555',
              border: `1px solid ${category === cat ? '#8b1a1a' : '#ddd'}`,
              padding: '7px 18px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            {cat === 'All' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-10">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-4">Featured Partners</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map(inst => <InstitutionCard key={inst.id} inst={inst} featured />)}
          </div>
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-4">More in Downeast Maine</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map(inst => <InstitutionCard key={inst.id} inst={inst} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-light">No listings in this category yet.</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 p-8 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #5b7b6a, #3a6186)' }}>
        <h2 className="font-serif text-xl font-semibold text-white mb-2">Are you an arts organization in Downeast Maine?</h2>
        <p className="text-white/80 font-light text-sm mb-4">We'd love to feature you in our Art Guide.</p>
        <a
          href="mailto:farmsteadartists@gmail.com?subject=Art Guide Listing Request"
          className="inline-block bg-white text-sage-700 px-6 py-2.5 rounded font-semibold text-sm hover:-translate-y-0.5 transition-all"
        >
          Request a Listing
        </a>
      </div>

    </section>
  )
}

function InstitutionCard({ inst, featured }) {
  const color = CATEGORY_COLORS[inst.category] || '#5b7b6a'
  const label = CATEGORY_LABELS[inst.category] || inst.category

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: featured ? '0 2px 12px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.07)',
      border: featured ? `2px solid ${color}30` : '1px solid #ebe7e0',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 4, background: color }} />
      <div style={{ padding: featured ? '24px' : '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: '8px' }}>
          {label}
        </div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: featured ? '22px' : '17px', color: '#2d2d2d', marginBottom: '8px', lineHeight: 1.2 }}>
          {inst.name}
        </h3>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
          📍 {inst.town}, {inst.state}
        </div>
        {inst.description && (
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, fontWeight: '300', flex: 1,
            display: '-webkit-box', WebkitLineClamp: featured ? 4 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {inst.description}
          </p>
        )}
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {inst.website && (
            <a href={inst.website} target="_blank" rel="noopener noreferrer"
              style={{ background: color, color: '#fff', borderRadius: '5px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              Visit Website
            </a>
          )}
          {inst.phone && (
            <a href={`tel:${inst.phone.replace(/[^0-9]/g, '')}`}
              style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
              📞 {inst.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// end of file
