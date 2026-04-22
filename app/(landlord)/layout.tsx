'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user?.role === 'TENANT') redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar role="LANDLORD" />
      <main className="flex-1 overflow-y-auto h-screen relative bg-slate-50/50">
        <div className="p-6 lg:p-12 pb-32">
          {children}
        </div>
      </main>
    </div>
  )
}
