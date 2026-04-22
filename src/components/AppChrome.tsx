'use client'

import { usePathname } from 'next/navigation'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false

  return (
    <>
      {!isAdmin && <Background />}
      <Navbar />
      <main
        className={
          isAdmin
            ? 'flex-1 min-h-screen bg-white text-gray-900 antialiased pt-20'
            : 'flex-1'
        }
      >
        {children}
      </main>
      <Footer />
    </>
  )
}
