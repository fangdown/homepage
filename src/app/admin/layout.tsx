'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/admin/admin.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}