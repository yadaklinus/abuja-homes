'use client'

import React from 'react'
import PropertyForm from '@/components/landlord/PropertyForm'
import { Button } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  return (
    <div className="space-y-8">
      <Link href="/landlord/dashboard">
        <Button variant="light" className="font-black text-slate-500 hover:text-slate-900 p-0" startContent={<ArrowLeft size={20} />}>
           Back to Dashboard
        </Button>
      </Link>
      <PropertyForm />
    </div>
  )
}
