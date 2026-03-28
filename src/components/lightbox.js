// lightbox.js
// src/components/lightbox.js
// Desc: Fullscreen image lightbox — click artwork to enlarge
// ============================================================
'use client'

import { useEffect } from 'react'

export default function Lightbox({ work, onClose }) {
  // close on ESC key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!work) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 20,
          background: 'none', border: 'none', color: '#fff',
          fontSize: '28px', cursor: 'pointer', lineHeight: 1,
          opacity: 0.8,
        }}
      >
        ✕
      </button>

      {/* content — stop click from bubbling to overlay */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '12px', overflow: 'hidden',
          maxWidth: '90vw', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* image */}
        {work.photo_url && (
          <div style={{ flex: 1, overflow: 'hidden', maxHeight: '70vh' }}>
            <img
              src={work.photo_url}
              alt={work.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
        )}

        {/* caption */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0ebe4' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontWeight: '600', fontSize: '17px', color: '#2d4a3e' }}>
            {work.title}
          </div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>
            {[work.medium, work.size].filter(Boolean).join(' · ')}
            {work.artistName && <span> — {work.artistName}</span>}
          </div>
          {work.price && work.status !== 'sold' && (
            <div style={{ fontSize: '15px', color: '#5b7b6a', fontWeight: '600', marginTop: '4px' }}>
              ${work.price.toLocaleString()}
            </div>
          )}
          {work.status === 'sold' && (
            <div style={{ fontSize: '12px', color: '#e57373', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sold
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// end of file
