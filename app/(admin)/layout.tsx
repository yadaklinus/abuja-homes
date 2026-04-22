'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar role="ADMIN" />
      <main className="flex-1 overflow-y-auto h-screen relative bg-slate-900">
        <div className="p-6 lg:p-12 pb-32">
          {children}
        </div>
      </main>
    </div>
  )
}
