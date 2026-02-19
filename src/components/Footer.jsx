import Link from 'next/link'
import site from '@/data/site.json'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/50 text-center py-8 px-6 text-sm font-light">
      <p>© {new Date().getFullYear()} <strong className="text-white/75 font-medium">{site.name}</strong></p>
      <p className="mt-1">
        {site.address.venue} · {site.address.street} · {site.address.city}, {site.address.state}
      </p>
      <p className="mt-3 opacity-60 text-xs">
        We are grateful to {site.barnOwners.names} for their generosity and friendship.
      </p>
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <Link href="/about" className="hover:text-white/70 transition-colors">About</Link>
        <Link href="/artists" className="hover:text-white/70 transition-colors">Artists</Link>
        <Link href="/calendar" className="hover:text-white/70 transition-colors">Shows</Link>
        <Link href="/contact" className="hover:text-white/70 transition-colors">Contact</Link>
      </div>
    </footer>
  )
}
