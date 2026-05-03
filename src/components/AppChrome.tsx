'use client'

import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Background />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
