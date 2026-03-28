// qr_code.js
// src/components/qr_code.js
// Desc: QR code component — generates from URL, shows on page,
//       download button for printing
// ============================================================
'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeWidget({ url, label }) {
  const canvasRef = useRef()
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    async function generate() {
      try {
        // Generate to canvas
        await QRCode.toCanvas(canvasRef.current, url, {
          width: 180,
          margin: 2,
          color: { dark: '#8b1a1a', light: '#ffffff' },
        })
        // Also generate data URL for download
        const du = await QRCode.toDataURL(url, {
          width: 600,
          margin: 2,
          color: { dark: '#8b1a1a', light: '#ffffff' },
        })
        setDataUrl(du)
      } catch (err) {
        console.error('QR error:', err)
      }
    }
    generate()
  }, [url])

  function handleDownload() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${label || 'farmstead'}-qr.png`
    a.click()
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: '#fff', borderRadius: '10px', padding: '12px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.08)', border: '1px solid #ede9e1',
      width: 'fit-content',
    }}>
      <canvas ref={canvasRef} style={{ borderRadius: '6px' }} />
      <div style={{ fontSize: '11px', color: '#888', marginTop: '6px', textAlign: 'center', maxWidth: '160px', lineHeight: 1.3 }}>
        Scan to view this page
      </div>
      {dataUrl && (
        <button
          onClick={handleDownload}
          style={{
            marginTop: '8px', background: '#8b1a1a', color: '#fff',
            border: 'none', borderRadius: '5px', padding: '6px 14px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          Download QR
        </button>
      )}
    </div>
  )
}

// end of file
