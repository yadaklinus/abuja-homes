'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardBody, 
  Button, 
  Badge, 
  Input, 
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip
} from '@heroui/react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Eye, 
  Trash2, 
  ArrowLeft,
  Home,
  MapPin,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export default function LandlordPropertiesPage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProperties = async () => {
    if (!session?.user?.id) return
    try {
      setLoading(true)
      const response = await axios.get(`/api/properties?landlordId=${session.user.id}`)
      setProperties(response.data)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [session?.user?.id])

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success'
      case 'RENTED': return 'primary'
      case 'PENDING': return 'warning'
      case 'DRAFT': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/landlord/dashboard">
            <Button variant="light" className="font-black text-slate-500 hover:text-slate-900 p-0 mb-4" startContent={<ArrowLeft size={18} />}>
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">My Properties</h1>
          <p className="text-slate-500 font-medium">Manage and monitor your real estate portfolio.</p>
        </div>
        <Button 
          as={Link} 
          href="/landlord/properties/new" 
          className="h-14 px-8 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
          startContent={<Plus size={20} strokeWidth={3} />}
        >
          Add New Property
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by title or location..."
          variant="flat"
          radius="lg"
          startContent={<Search className="text-slate-400" size={18} />}
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="flat" radius="lg" className="bg-white border border-slate-100 font-bold" startContent={<Filter size={18} />}>
          Filters
        </Button>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-none rounded-[3rem] bg-slate-50/50">
          <CardBody className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
              <Home size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
              {searchQuery ? "We couldn't find any properties matching your search." : "You haven't listed any properties yet. Start by adding your first one!"}
            </p>
            {!searchQuery && (
              <Button as={Link} href="/landlord/properties/new" className="bg-slate-900 text-white font-black h-12 px-8 rounded-xl">
                List a Property
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/80 transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.images[0]?.url || 'https://picsum.photos/800/600'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={property.title}
                  />
                  <div className="absolute top-6 right-6 z-10">
                    <Badge color={getStatusColor(property.status)} variant="flat" className="font-black text-[10px] bg-white/90 backdrop-blur-md px-3 py-1">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-6 left-6 z-10">
                    <Dropdown backdrop="blur">
                      <DropdownTrigger>
                        <Button isIconOnly variant="flat" className="bg-white/80 backdrop-blur-md rounded-xl">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Property Actions">
                        <DropdownItem key="view" startContent={<Eye size={16} />} as={Link} href={`/properties/${property.slug}`}>
                          View Public Listing
                        </DropdownItem>
                        <DropdownItem key="edit" startContent={<Edit3 size={16} />} as={Link} href={`/landlord/properties/${property.id}/edit`}>
                          Edit Property
                        </DropdownItem>
                        <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16} />}>
                          Delete Listing
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <CardBody className="p-8 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <MapPin size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{property.district}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{property.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                       <span className="font-black text-slate-900">{property.bedrooms}</span>
                       <span className="text-[10px] font-bold uppercase tracking-tighter">Beds</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1.5">
                       <span className="font-black text-slate-900">{property.bathrooms}</span>
                       <span className="text-[10px] font-bold uppercase tracking-tighter">Baths</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1.5">
                       <span className="font-black text-slate-900">{property.parkingSpaces}</span>
                       <span className="text-[10px] font-bold uppercase tracking-tighter">Parking</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Rent</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">₦{property.price.toLocaleString()}</p>
                    </div>
                    <Button 
                      as={Link} 
                      href={`/landlord/properties/${property.id}/edit`} 
                      variant="flat" 
                      className="bg-slate-100 font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Manage
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
