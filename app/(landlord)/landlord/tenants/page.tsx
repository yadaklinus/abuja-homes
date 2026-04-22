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
  Avatar,
  Tooltip
} from '@heroui/react'
import {
  Search,
  MessageSquare,
  Phone,
  Calendar,
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight, Home
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export default function LandlordTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/landlord/tenants')
        setTenants(response.data)
      } catch (error) {
        console.error('Failed to fetch tenants:', error)
        toast.error('Failed to load tenants list')
      } finally {
        setLoading(false)
      }
    }
    fetchTenants()
  }, [])

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">My Tenants</h1>
          <p className="text-slate-500 font-medium">View and contact tenants who have booked your properties.</p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl">
          <Users className="text-blue-600" size={24} />
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Residents</p>
            <p className="text-xl font-black text-slate-900 leading-none">{tenants.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name or email..."
          variant="flat"
          radius="lg"
          startContent={<Search className="text-slate-400" size={18} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tenants List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-[2rem]" />
          ))
        ) : filteredTenants.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 shadow-none rounded-[3rem] bg-slate-50/50">
            <CardBody className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No tenants yet</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                {searchQuery ? "No tenants match your search." : "When tenants start booking your properties, they will appear here."}
              </p>
            </CardBody>
          </Card>
        ) : (
          filteredTenants.map((tenant, idx) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
                <CardBody className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar
                      src={tenant.avatar}
                      className="w-20 h-20 text-large bg-slate-900 text-emerald-400 font-black border-4 border-white shadow-lg"
                      name={tenant.name}
                    />

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h4 className="text-2xl font-black text-slate-900 truncate">{tenant.name}</h4>
                        {tenant.verificationStatus === 'VERIFIED' && (
                          <Tooltip content="Identity Verified">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-slate-400 font-bold text-sm mb-4">{tenant.email}</p>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                          <Home size={14} strokeWidth={2.5} /> Last Listing: {tenant.lastBooking.propertyTitle}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                          <Clock size={14} strokeWidth={2.5} /> {tenant.totalBookings} Total Bookings
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Tooltip content="Call Tenant">
                        <Button isIconOnly variant="flat" className="bg-slate-100 text-slate-600 rounded-2xl hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                          <Phone size={20} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Send Message">
                        <Button isIconOnly variant="flat" className="bg-slate-100 text-slate-600 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-colors">
                          <MessageSquare size={20} />
                        </Button>
                      </Tooltip>
                      <Button
                        as={Link}
                        href={`/landlord/tenants/${tenant.id}`}
                        className="h-14 px-8 bg-slate-900 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                      >
                        History
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
