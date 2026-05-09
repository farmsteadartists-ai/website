// lightbox.js
// Path: src/components/lightbox.js
// Desc: Fullscreen artwork viewer with zoom (1×–8×), pan, keyboard + touch support
// ============================================================
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 8
const ZOOM_STEP = 1.25

export default function Lightbox({ work, onClose }) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const pinch = useRef({ dist: 0, scaleStart: 1 })

  const reset = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s * ZOOM_STEP, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s / ZOOM_STEP, MIN_SCALE)
      if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 })
      return next
    })
  }, [])

  // reset whenever a new artwork opens
  useEffect(() => { reset() }, [work, reset])

  // keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-' || e.key === '_') zoomOut()
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, zoomIn, zoomOut, reset])

  // wheel zoom
  function onWheel(e) {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    setScale((s) => {
      const next = Math.max(MIN_SCALE, Math.min(s * factor, MAX_SCALE))
      if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 })
      return next
    })
  }

  // mouse pan (only when zoomed in)
  function onMouseDown(e) {
    if (scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = {
      x: e.clientX, y: e.clientY,
      tx: translate.x, ty: translate.y,
    }
  }
  function onMouseMove(e) {
    if (!isDragging) return
    setTranslate({
      x: dragStart.current.tx + (e.clientX - dragStart.current.x),
      y: dragStart.current.ty + (e.clientY - dragStart.current.y),
    })
  }
  function onMouseUp() { setIsDragging(false) }

  // touch: 2-finger pinch + 1-finger pan
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinch.current = { dist: Math.hypot(dx, dy), scaleStart: scale }
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true)
      dragStart.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        tx: translate.x, ty: translate.y,
      }
    }
  }
  function onTouchMove(e) {
    if (e.touches.length === 2 && pinch.current.dist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = pinch.current.scaleStart * (dist / pinch.current.dist)
      setScale(Math.max(MIN_SCALE, Math.min(next, MAX_SCALE)))
    } else if (e.touches.length === 1 && isDragging) {
      setTranslate({
        x: dragStart.current.tx + (e.touches[0].clientX - dragStart.current.x),
        y: dragStart.current.ty + (e.touches[0].clientY - dragStart.current.y),
      })
    }
  }
  function onTouchEnd() {
    setIsDragging(false)
    pinch.current.dist = 0
  }

  // backdrop click closes; clicks on image / controls do not
  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  if (!work) return null

  const meta = [work.medium, work.size, work.price].filter(Boolean).join(' · ')
  const cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'

  return (
    <div
      onClick={onBackdropClick}
      onWheel={onWheel}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* controls — top right */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 16, right: 20, zIndex: 2,
          display: 'flex', gap: '8px', alignItems: 'center',
        }}
      >
        <ControlBtn onClick={zoomOut} disabled={scale <= MIN_SCALE} title="Zoom out (-)">−</ControlBtn>
        <span style={{ color: '#fff', fontSize: '13px', minWidth: '44px', textAlign: 'center', opacity: 0.85 }}>
          {Math.round(scale * 100)}%
        </span>
        <ControlBtn onClick={zoomIn} disabled={scale >= MAX_SCALE} title="Zoom in (+)">+</ControlBtn>
        <ControlBtn onClick={reset} disabled={scale === 1 && translate.x === 0 && translate.y === 0} title="Reset (0)">⟲</ControlBtn>
        <ControlBtn onClick={onClose} title="Close (Esc)">✕</ControlBtn>
      </div>

      {/* image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={work.photo_url}
        alt={work.title || ''}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        draggable={false}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          cursor,
          willChange: 'transform',
        }}
      />

      {/* caption — bottom */}
      {(work.title || meta) && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 16, left: 0, right: 0,
            textAlign: 'center', color: '#fff',
            padding: '0 24px',
            pointerEvents: 'none',
          }}
        >
          {work.title && (
            <div style={{ fontSize: '17px', fontWeight: 500, marginBottom: '4px' }}>
              {work.title}
            </div>
          )}
          {meta && (
            <div style={{ fontSize: '13px', opacity: 0.75 }}>{meta}</div>
          )}
        </div>
      )}
    </div>
  )
}

function ControlBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: '36px', height: '36px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '18px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
    >
      {children}
    </button>
  )
}

// end of file
