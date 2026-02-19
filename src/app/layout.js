import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Farmstead Artists — East Sullivan, Maine',
  description: 'Original art in a historic barn on Route 1. Four weekends each summer since 2022. Watercolors, oils, acrylics, collages, and drawings by 15 member artists.',
  keywords: 'art, gallery, Maine, Sullivan, Downeast, paintings, original art, barn gallery',
  openGraph: {
    title: 'Farmstead Artists',
    description: 'Original art in a historic barn on Route 1, East Sullivan, Maine.',
    url: 'https://farmsteadartists.art',
    siteName: 'Farmstead Artists',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
