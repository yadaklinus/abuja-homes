'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // Note: Middleware handles auth, but we can double check here
  if (status === 'unauthenticated') redirect('/login')
  if (session?.user?.role === 'LANDLORD') redirect('/landlord/dashboard')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="TENANT" />
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="p-6 lg:p-12 pb-32">
          {children}
        </div>
      </main>
    </div>
  )
}
