'use client'
import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/artists', label: 'Artists' },
  { href: '/calendar', label: '2026 Shows' },
  { href: '/directions', label: 'Visit Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-sage-600/95 backdrop-blur-md px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-serif text-cream-50 text-lg font-semibold tracking-wide">
          Farmstead Artists
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Menu"
        >
          <span className={`block w-6 h-[2px] bg-cream-50 transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-cream-50 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-cream-50 transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream-50/85 hover:text-cream-50 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile fullscreen nav */}
      <nav
        className={`fixed inset-0 bg-sage-600 z-40 flex flex-col justify-center items-center gap-6 transition-transform duration-400 md:hidden ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-serif text-cream-50 text-2xl tracking-wide opacity-85 hover:opacity-100 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
