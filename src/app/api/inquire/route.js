// inquire_route.js
// Path: src/app/api/inquire/route.js
// Desc: Handles artwork inquiry submissions from the gallery "I'm
//       Interested" button. Sends an email via Brevo's transactional
//       API to the Farmstead Artists inbox, with reply-to set to the
//       inquiring buyer so replies go straight to them.
// ============================================================

import { NextResponse } from 'next/server'

const BREVO_API_URL   = 'https://api.brevo.com/v3/smtp/email'
const RECIPIENT_EMAIL = 'farmsteadartists@gmail.com'
const SENDER_EMAIL    = 'info@farmsteadartists.org'
const SENDER_NAME     = 'Farmstead Artists Website'

export async function POST(request) {
  try {
    const body = await request.json()
    const { artworkId, artworkTitle, artistName, buyerName, buyerEmail, message } = body

    // Basic validation
    if (!buyerName || !buyerEmail || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(buyerEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const subject = artworkTitle
      ? `Inquiry: "${artworkTitle}"${artistName ? ` by ${artistName}` : ''}`
      : 'New artwork inquiry'

    const artworkLink = artworkId
      ? `https://farmsteadartists.org/gallery/${artworkId}`
      : ''

    const htmlContent = `
      <p><strong>New inquiry from the gallery page</strong></p>
      <p><strong>Artwork:</strong> ${escapeHtml(artworkTitle || 'Unknown')}<br/>
      <strong>Artist:</strong> ${escapeHtml(artistName || 'Unknown')}<br/>
      ${artworkLink ? `<strong>Link:</strong> <a href="${artworkLink}">${artworkLink}</a><br/>` : ''}
      </p>
      <p><strong>From:</strong> ${escapeHtml(buyerName)} (${escapeHtml(buyerEmail)})</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `

    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: RECIPIENT_EMAIL, name: 'Farmstead Artists' }],
        replyTo: { email: buyerEmail, name: buyerName },
        subject,
        htmlContent
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Brevo send failed:', res.status, errText)
      return NextResponse.json(
        { error: 'Failed to send inquiry. Please try again shortly.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquire API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// Minimal HTML escaping for user-submitted content in the email body
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// end of file
