// artwork_grid.js
// src/components/artwork_grid.js
// Desc: Client-side artwork grid with lightbox for artist detail page
// ============================================================
'use client'

import { useState } from 'react'
import Lightbox from '@/components/lightbox'

export default function ArtworkGrid({ artworks, artistName }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((work) => (
          <div
            key={work.id}
            className="group cursor-pointer"
            onClick={() => setSelected({ ...work, artistName })}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-sage-600/5 border border-black/[0.04]">
              {work.photo_url ? (
                <img
                  src={work.photo_url}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <span className="font-serif text-sm text-sage-500/40 text-center">{work.title}</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="font-serif text-sm font-semibold text-sage-700 leading-tight">{work.title}</div>
              <div className="text-[0.7rem] text-gray-400 font-light">
                {work.medium}
                {work.size && ` · ${work.size}`}
              </div>
              {work.price && work.status === 'available' && (
                <div className="text-sm text-sage-600 font-medium mt-0.5">${work.price}</div>
              )}
              {work.status === 'sold' && (
                <div className="text-xs text-red-400 font-medium mt-0.5 uppercase tracking-wider">Sold</div>
              )}
              {work.description && (
                <div className="text-xs text-gray-400 font-light mt-1">{work.description}</div>
              )}
              <div className="text-[0.65rem] text-sage-500/60 mt-1">Tap to enlarge</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Lightbox work={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

// end of file
