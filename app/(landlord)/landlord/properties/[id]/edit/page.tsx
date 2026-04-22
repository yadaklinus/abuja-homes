'use client'

import React, { useState, useEffect } from 'react'
import PropertyForm from '@/components/landlord/PropertyForm'
import { Button, Spinner, Skeleton, Badge } from '@heroui/react'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

export default function EditPropertyPage() {
  const params = useParams()
  const id = params.id as string
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/properties/${id}`)
        setProperty(response.data)
      } catch (err) {
        console.error('Failed to fetch property:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProperty()
    }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-48 h-10 rounded-xl" />
          <Skeleton className="w-full h-20 rounded-[2.5rem]" />
        </div>
        <Skeleton className="w-full h-[600px] rounded-[3rem]" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <AlertCircle size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Property Not Found</h2>
          <p className="text-slate-500 font-medium">We couldn't find the property you're looking for or you don't have access to it.</p>
        </div>
        <Link href="/landlord/properties">
          <Button className="bg-slate-900 text-white font-black h-12 px-8 rounded-xl">
             Back to My Properties
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/landlord/properties">
          <Button variant="light" className="font-black text-slate-500 hover:text-slate-900 p-0 mb-4" startContent={<ArrowLeft size={20} />}>
            Back to Properties
          </Button>
        </Link>
        <div className="flex items-end justify-between">
            <div>
                 <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Edit <span className="text-blue-600">{property.title}</span></h1>
                 <p className="text-slate-500 font-medium">Update your property details and media.</p>
            </div>
            <Badge color="primary" variant="flat" className="font-black text-[10px] px-3 py-1">
                ID: {id.slice(0, 8)}...
            </Badge>
        </div>
      </div>
      <PropertyForm initialData={property} isEditing={true} />
    </div>
  )
}