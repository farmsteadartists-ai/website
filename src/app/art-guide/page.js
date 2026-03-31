// art_guide_page.js
// src/app/art-guide/page.js
// Desc: Art Guide — Downeast Maine arts institutions directory
//       with Leaflet map and Request a Listing form
// ============================================================
'use client'

import { useEffect, useState, useRef } from 'react'

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

// Farmstead barn coordinates
const FARMSTEAD = { lat: 44.4948, lng: -68.1404, name: 'Farmstead Artists' }

export default function ArtGuidePage() {
  const [institutions, setInstitutions] = useState([])
  const [filtered, setFiltered]         = useState([])
  const [category, setCategory]         = useState('All')
  const [loading, setLoading]           = useState(true)
  const mapRef  = useRef(null)
  const mapObj  = useRef(null)

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
    setFiltered(category === 'All' ? institutions : institutions.filter(i => i.category === category))
  }, [category, institutions])

  // ── Leaflet map ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (loading || !mapRef.current) return

    async function initMap() {
      // Dynamically load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const L = (await import('leaflet')).default

      // destroy previous map instance if any
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }

      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([44.45, -68.15], 9)
      mapObj.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Farmstead pin — dark red
      const farmIcon = L.divIcon({
        className: '',
        html: `<div style="background:#8b1a1a;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      })
      L.marker([FARMSTEAD.lat, FARMSTEAD.lng], { icon: farmIcon })
        .addTo(map)
        .bindPopup(`<strong>Farmstead Artists</strong><br/>East Sullivan, ME`)

      // Institution pins
      institutions.forEach(inst => {
        if (!inst.lat || !inst.lng) return
        const color = CATEGORY_COLORS[inst.category] || '#5b7b6a'
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
          iconSize: [12, 12], iconAnchor: [6, 6],
        })
        L.marker([inst.lat, inst.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${inst.name}</strong><br/>${inst.town}, ME${inst.website ? `<br/><a href="${inst.website}" target="_blank">Visit website</a>` : ''}`)
      })
    }

    initMap()
  }, [loading, institutions])

  // ── request form submit ───────────────────────────────────────────────────

  async function handleRequest(e) {
    e.preventDefault()
    if (!reqName.trim() || !reqEmail.trim()) return
    setReqSending(true)

    // Use mailto as the submission mechanism
    const subject = encodeURIComponent('Art Guide Listing Request')
    const body = encodeURIComponent(
      `Name: ${reqName}\nOrganization: ${reqOrg}\nEmail: ${reqEmail}\nWebsite: ${reqWebsite}\n\nMessage:\n${reqMsg}`
    )
    window.location.href = `mailto:farmsteadartists@gmail.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setReqSending(false)
      setReqDone(true)
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

      {/* Header + Map row */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">

        {/* Left — header + filters */}
        <div className="flex-1">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Downeast Maine</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-3">Art Guide</h1>
          <p className="text-gray-500 font-light mb-6 max-w-lg">
            A curated directory of galleries, arts organizations, schools, and studios across Downeast Maine.
            These are our neighbors, supporters, and fellow believers in the power of art.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
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

          {/* Map legend */}
          <div className="flex flex-wrap gap-3 mt-4">
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

        {/* Right — Leaflet map */}
        <div className="hidden md:block flex-shrink-0" style={{ width: '380px' }}>
          <div
            ref={mapRef}
            style={{ width: '100%', height: '320px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
          />
        </div>
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

      {/* Request a Listing form */}
      <div className="mt-16 p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #5b7b6a, #3a6186)' }}>
        <h2 className="font-serif text-xl font-semibold text-white mb-2">Are you an arts organization in Downeast Maine?</h2>
        <p className="text-white/80 font-light text-sm mb-6">We'd love to feature you in our Art Guide. Fill out the form below and we'll be in touch.</p>

        {reqDone ? (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>Thank you! Your request has been sent ✓</p>
            <button onClick={() => setReqDone(false)} style={{ marginTop: '10px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              Submit another request
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                This will open your email app to send the request.
              </span>
            </div>
          </div>
        )}
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
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>📍 {inst.town}, {inst.state}</div>
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
