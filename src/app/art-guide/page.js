// ============================================================
// Script: art_guide_page.js
// Path:   src/app/art-guide/page.js
// Desc:   Art Guide — Downeast Maine arts institutions.
//         Leaflet map with bidirectional card↔pin interaction.
//         Mobile-friendly: map visible on all screen sizes.
// ============================================================
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

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

const FARMSTEAD = { lat: 44.4948, lng: -68.1404 }

// ── marker icon html ──────────────────────────────────────────────────────────

function makeIconHtml(color, selected) {
  const size   = selected ? 18 : 12
  const shadow = selected ? '0 2px 8px rgba(0,0,0,0.55)' : '0 1px 4px rgba(0,0,0,0.4)'
  const ring   = selected ? `outline:3px solid ${color};outline-offset:2px;` : ''
  return `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid #fff;box-shadow:${shadow};${ring}transition:all 0.15s"></div>`
}

// ── main component ────────────────────────────────────────────────────────────

export default function ArtGuidePage() {
  const [institutions, setInstitutions] = useState([])
  const [filtered, setFiltered]         = useState([])
  const [category, setCategory]         = useState('All')
  const [loading, setLoading]           = useState(true)
  const [selectedId, setSelectedId]     = useState(null)

  const mapRef     = useRef(null)
  const mapObj     = useRef(null)
  const leafletRef = useRef(null)        // L instance
  const markersRef = useRef({})          // id → L.marker
  const cardRefs   = useRef({})          // id → DOM element

  // request form
  const [reqName, setReqName]       = useState('')
  const [reqOrg, setReqOrg]         = useState('')
  const [reqEmail, setReqEmail]     = useState('')
  const [reqWebsite, setReqWebsite] = useState('')
  const [reqMsg, setReqMsg]         = useState('')
  const [reqSending, setReqSending] = useState(false)
  const [reqDone, setReqDone]       = useState(false)

  // ── load data ─────────────────────────────────────────────────────────────

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

  // ── filter ────────────────────────────────────────────────────────────────

  useEffect(() => {
    setFiltered(
      category === 'All'
        ? institutions
        : institutions.filter(i => i.category === category)
    )
    setSelectedId(null)
  }, [category, institutions])

  // ── pin click → scroll card into view ────────────────────────────────────

  const handlePinClick = useCallback((id) => {
    setSelectedId(id)
    setTimeout(() => {
      const card = cardRefs.current[id]
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }, [])

  // ── card click → pan map + open popup ────────────────────────────────────

  const handleCardClick = useCallback((inst) => {
    if (!inst.lat || !inst.lng) return
    setSelectedId(inst.id)
    const marker = markersRef.current[inst.id]
    if (marker && mapObj.current) {
      mapObj.current.panTo([inst.lat, inst.lng], { animate: true })
      marker.openPopup()
    }
  }, [])

  // ── update marker icons when selection changes ────────────────────────────

  useEffect(() => {
    const L = leafletRef.current
    if (!L) return
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const inst = institutions.find(i => String(i.id) === String(id))
      if (!inst) return
      const color      = CATEGORY_COLORS[inst.category] || '#5b7b6a'
      const isSelected = String(id) === String(selectedId)
      const size       = isSelected ? 18 : 12
      const anchor     = isSelected ? 9 : 6
      marker.setIcon(L.divIcon({
        className: '',
        html: makeIconHtml(color, isSelected),
        iconSize: [size, size],
        iconAnchor: [anchor, anchor],
      }))
      if (isSelected) marker.setZIndexOffset(1000)
      else marker.setZIndexOffset(0)
    })
  }, [selectedId, institutions])

  // ── init Leaflet map ──────────────────────────────────────────────────────

  useEffect(() => {
    if (loading || !mapRef.current) return

    async function initMap() {
      if (!document.getElementById('leaflet-css')) {
        const link  = document.createElement('link')
        link.id     = 'leaflet-css'
        link.rel    = 'stylesheet'
        link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const L = (await import('leaflet')).default
      leafletRef.current = L

      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
        markersRef.current = {}
      }

      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([44.45, -68.15], 9)
      mapObj.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Farmstead pin
      L.marker([FARMSTEAD.lat, FARMSTEAD.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:#8b1a1a;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        }),
      }).addTo(map).bindPopup('<strong>Farmstead Artists</strong><br/>East Sullivan, ME')

      // Institution pins — stored in markersRef
      institutions.forEach(inst => {
        if (!inst.lat || !inst.lng) return
        const color  = CATEGORY_COLORS[inst.category] || '#5b7b6a'
        const marker = L.marker([inst.lat, inst.lng], {
          icon: L.divIcon({
            className: '',
            html: makeIconHtml(color, false),
            iconSize: [12, 12], iconAnchor: [6, 6],
          }),
        })
          .addTo(map)
          .bindPopup(
            `<strong>${inst.name}</strong><br/>${inst.town}, ME` +
            (inst.website ? `<br/><a href="${inst.website}" target="_blank">Visit website</a>` : '')
          )

        marker.on('click', () => handlePinClick(inst.id))
        markersRef.current[inst.id] = marker
      })
    }

    initMap()
  }, [loading, institutions, handlePinClick])

  // ── request form ──────────────────────────────────────────────────────────

  async function handleRequest(e) {
    e.preventDefault()
    if (!reqName.trim() || !reqEmail.trim()) return
    setReqSending(true)
    const subject = encodeURIComponent('Art Guide Listing Request')
    const body    = encodeURIComponent(
      `Name: ${reqName}\nOrganization: ${reqOrg}\nEmail: ${reqEmail}\nWebsite: ${reqWebsite}\n\nMessage:\n${reqMsg}`
    )
    window.location.href = `mailto:farmsteadartists@gmail.com?subject=${subject}&body=${body}`
    setTimeout(() => {
      setReqSending(false); setReqDone(true)
      setReqName(''); setReqOrg(''); setReqEmail(''); setReqWebsite(''); setReqMsg('')
    }, 1000)
  }

  // ── render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <p className="text-gray-400 font-light">Loading Art Guide…</p>
    </section>
  )

  const featured = filtered.filter(i => i.featured)
  const rest     = filtered.filter(i => !i.featured)
  const inp = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }
  const lbl = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '3px' }

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">

      {/* ── Header ── */}
      <div className="mb-4">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Downeast Maine</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-3">Art Guide</h1>
        <p className="text-gray-500 font-light mb-5 max-w-lg">
          A curated directory of galleries, arts organizations, schools, and studios across Downeast Maine.
          Tap any card to locate it on the map, or tap a pin to find the listing.
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              background: category === cat ? '#8b1a1a' : '#fff',
              color: category === cat ? '#fff' : '#555',
              border: `1px solid ${category === cat ? '#8b1a1a' : '#ddd'}`,
              padding: '7px 18px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}>
              {cat === 'All' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8b1a1a', border: '1px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            Farmstead Artists
          </div>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '1px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              {CATEGORY_LABELS[cat]}
            </div>
          ))}
        </div>
      </div>

      {/* ── Map — full width, visible on all screen sizes ── */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '320px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          marginBottom: '32px',
        }}
      />

      {/* ── Featured ── */}
      {featured.length > 0 && (
        <div className="mb-10">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-4">Featured Partners</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map(inst => (
              <InstitutionCard
                key={inst.id}
                inst={inst}
                featured
                selected={selectedId === inst.id}
                onClick={() => handleCardClick(inst)}
                cardRef={el => { if (el) cardRefs.current[inst.id] = el; else delete cardRefs.current[inst.id] }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Rest ── */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-4">More in Downeast Maine</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map(inst => (
              <InstitutionCard
                key={inst.id}
                inst={inst}
                selected={selectedId === inst.id}
                onClick={() => handleCardClick(inst)}
                cardRef={el => { if (el) cardRefs.current[inst.id] = el; else delete cardRefs.current[inst.id] }}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-light">No listings in this category yet.</p>
        </div>
      )}

      {/* ── Request a Listing ── */}
      <div className="mt-16 p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #5b7b6a, #3a6186)' }}>
        <h2 className="font-serif text-xl font-semibold text-white mb-2">Are you an arts organization in Downeast Maine?</h2>
        <p className="text-white/80 font-light text-sm mb-6">
          We'd love to feature you in our Art Guide. Fill out the form below and we'll be in touch.
        </p>

        {reqDone ? (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>Thank you! Your request has been sent ✓</p>
            <button onClick={() => setReqDone(false)} style={{ marginTop: '10px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              Submit another request
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ ...lbl, color: 'rgba(255,255,255,0.8)' }}>Your Name *</label>
              <input value={reqName} onChange={e => setReqName(e.target.value)} placeholder="Jane Smith" style={{ ...inp, background: 'rgba(255,255,255,0.95)' }} />
            </div>
            <div>
              <label style={{ ...lbl, color: 'rgba(255,255,255,0.8)' }}>Organization *</label>
              <input value={reqOrg} onChange={e => setReqOrg(e.target.value)} placeholder="Gallery or Studio name" style={{ ...inp, background: 'rgba(255,255,255,0.95)' }} />
            </div>
            <div>
              <label style={{ ...lbl, color: 'rgba(255,255,255,0.8)' }}>Email *</label>
              <input type="email" value={reqEmail} onChange={e => setReqEmail(e.target.value)} placeholder="you@example.com" style={{ ...inp, background: 'rgba(255,255,255,0.95)' }} />
            </div>
            <div>
              <label style={{ ...lbl, color: 'rgba(255,255,255,0.8)' }}>Website</label>
              <input value={reqWebsite} onChange={e => setReqWebsite(e.target.value)} placeholder="https://…" style={{ ...inp, background: 'rgba(255,255,255,0.95)' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ ...lbl, color: 'rgba(255,255,255,0.8)' }}>Tell us about your organization</label>
              <textarea value={reqMsg} onChange={e => setReqMsg(e.target.value)} rows={3}
                placeholder="A brief description of what you do…"
                style={{ ...inp, background: 'rgba(255,255,255,0.95)', resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button onClick={handleRequest} disabled={reqSending || !reqName.trim() || !reqEmail.trim()}
                style={{ background: '#fff', color: '#3a6186', border: 'none', padding: '11px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                {reqSending ? 'Opening email…' : 'Request a Listing'}
              </button>
              <span style={{ marginLeft: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                This will open your email app.
              </span>
            </div>
          </div>
        )}
      </div>

    </section>
  )
}

// ── Institution card ──────────────────────────────────────────────────────────

function InstitutionCard({ inst, featured, selected, onClick, cardRef }) {
  const color   = CATEGORY_COLORS[inst.category] || '#5b7b6a'
  const label   = CATEGORY_LABELS[inst.category]  || inst.category
  const hasMap  = inst.lat && inst.lng

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: selected
          ? `0 4px 20px rgba(0,0,0,0.18)`
          : featured ? '0 2px 12px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.07)',
        border: selected
          ? `2px solid ${color}`
          : featured ? `2px solid ${color}30` : '1px solid #ebe7e0',
        display: 'flex',
        flexDirection: 'column',
        cursor: hasMap ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Color bar */}
      <div style={{ height: 4, background: color, flexShrink: 0 }} />

      {/* Photo — if available */}
      {inst.photo_url && (
        <div style={{ height: featured ? 180 : 120, overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={inst.photo_url}
            alt={inst.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ padding: featured ? '20px' : '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category label */}
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: '6px' }}>
          {label}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: featured ? '20px' : '16px', color: '#2d2d2d', marginBottom: '6px', lineHeight: 1.2 }}>
          {inst.name}
        </h3>

        {/* Location */}
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
          📍 {inst.town}{inst.state ? `, ${inst.state}` : ', ME'}
          {hasMap && (
            <span style={{ marginLeft: '6px', fontSize: '11px', color: color, fontWeight: '600' }}>· on map</span>
          )}
        </div>

        {/* Hours / season — shown if data exists */}
        {inst.hours && (
          <div style={{ fontSize: '12px', color: '#777', marginBottom: '6px' }}>
            🕐 {inst.hours}
          </div>
        )}
        {inst.season && !inst.hours && (
          <div style={{ fontSize: '12px', color: '#777', marginBottom: '6px' }}>
            📅 {inst.season}
          </div>
        )}

        {/* Description */}
        {inst.description && (
          <p style={{
            fontSize: '13px', color: '#666', lineHeight: 1.6, fontWeight: '300', flex: 1,
            display: '-webkit-box', WebkitLineClamp: featured ? 4 : 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px',
          }}>
            {inst.description}
          </p>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {inst.website && (
            <a
              href={inst.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ background: color, color: '#fff', borderRadius: '5px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}
            >
              Visit Website
            </a>
          )}
          {inst.phone && (
            <a
              href={`tel:${inst.phone.replace(/[^0-9]/g, '')}`}
              onClick={e => e.stopPropagation()}
              style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}
            >
              📞 {inst.phone}
            </a>
          )}
          {hasMap && (
            <span style={{ fontSize: '11px', color: color, fontWeight: '600', marginLeft: 'auto' }}>
              {selected ? '📍 Showing on map' : 'Tap to locate →'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// end of file
