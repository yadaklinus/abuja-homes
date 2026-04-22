'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardBody,
  Button,
  Badge,
  Skeleton,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Tooltip
} from '@heroui/react'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ShieldCheck,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { format } from 'date-fns'

export default function TenantDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/landlord/tenants/${id}`)
        setData(response.data)
      } catch (err) {
        console.error('Failed to fetch tenant details:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTenantData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <Skeleton className="w-32 h-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-1 h-[500px] rounded-[2.5rem]" />
          <Skeleton className="lg:col-span-2 h-[700px] rounded-[2.5rem]" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <AlertCircle size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Tenant Not Found</h2>
          <p className="text-slate-500 font-medium">We couldn't find the tenant details you're looking for.</p>
        </div>
        <Link href="/landlord/tenants">
          <Button className="bg-slate-900 text-white font-black h-12 px-8 rounded-xl">
            Back to My Tenants
          </Button>
        </Link>
      </div>
    )
  }

  const { tenant, stats, bookings, payments } = data

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <Link href="/landlord/tenants">
        <Button 
          variant="light" 
          className="font-black text-slate-500 hover:text-slate-900 p-0 mb-2" 
          startContent={<ArrowLeft size={18} />}
        >
          Back to My Tenants
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden">
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <Avatar
                  src={tenant.avatar}
                  className="w-32 h-32 text-4xl bg-slate-800 text-emerald-400 font-black border-8 border-white shadow-2xl"
                  name={tenant.name}
                />
              </div>
            </div>
            <CardBody className="pt-20 pb-8 px-8 text-center bg-white">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{tenant.name}</h2>
                {tenant.verificationStatus === 'VERIFIED' && (
                  <Tooltip content="Verified Identity">
                    <ShieldCheck className="text-emerald-500" size={24} />
                  </Tooltip>
                )}
              </div>
              <p className="text-slate-400 font-bold mb-6 italic">{tenant.email}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                  <p className="text-2xl font-black text-slate-900">{stats.totalBookings}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-blue-600">₦{(stats.totalPaid / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                    <p className="text-sm">{tenant.phone || 'Not provided'}</p>
                  </div>
                </div>
                {tenant.whatsapp && (
                  <div className="flex items-center gap-3 text-slate-600 font-bold">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                      <p className="text-sm">{tenant.whatsapp}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Member Since</p>
                    <p className="text-sm">{format(new Date(tenant.createdAt), 'MMMM yyyy')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-3">
                <Button className="bg-slate-900 text-white font-black h-14 rounded-2xl shadow-lg">
                  Send Message
                </Button>
                <Button variant="flat" className="h-14 font-black rounded-2xl">
                  Call Now
                </Button>
              </div>
            </CardBody>
          </Card>

          {tenant.bio && (
            <Card className="rounded-[2.5rem] shadow-sm border border-slate-100">
              <CardBody className="p-8">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">About Tenant</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{tenant.bio}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <Tabs 
            aria-label="Tenant Tabs" 
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-slate-900",
              tab: "max-w-fit px-0 h-12 font-black text-slate-400",
              tabContent: "group-data-[selected=true]:text-slate-900"
            }}
          >
            <Tab 
              key="bookings" 
              title={
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Booking History</span>
                  <Badge color="default" size="sm" variant="flat" className="ml-1">{bookings.length}</Badge>
                </div>
              }
            >
              <div className="pt-8 space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-dashed border-2 border-slate-200">
                    <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                    <h4 className="text-xl font-black text-slate-900">No bookings found</h4>
                    <p className="text-slate-500 font-medium">This tenant has not made any bookings for your properties.</p>
                  </div>
                ) : (
                  bookings.map((booking: any, idx: number) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all overflow-hidden group">
                        <CardBody className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                              <img 
                                src={booking.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} 
                                alt={booking.propertyTitle}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-xl font-black text-slate-900">{booking.propertyTitle}</h4>
                                    <Badge size="sm" variant="flat" color={booking.status === 'CONFIRMED' ? 'success' : 'default'} className="font-black text-[10px]">
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                                    <div className="flex items-center gap-1">
                                      <MapPin size={14} /> {booking.district}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Home size={14} /> {booking.propertyType.replace('_', ' ')}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xl font-black text-slate-900">₦{booking.price.toLocaleString()}</p>
                              </div>
                              
                              <Divider className="my-4 bg-slate-50" />
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-black">
                                    <Clock size={14} /> {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                                  </div>
                                </div>
                                <Button size="sm" variant="flat" className="font-black rounded-lg" endContent={<ExternalLink size={14} />}>
                                  View Property
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </Tab>

            <Tab 
              key="payments" 
              title={
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <span>Payment Log</span>
                  <Badge color="primary" size="sm" variant="flat" className="ml-1">{payments.length}</Badge>
                </div>
              }
            >
              <div className="pt-8 space-y-4">
                {payments.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-dashed border-2 border-slate-200">
                    <CreditCard className="mx-auto text-slate-300 mb-4" size={48} />
                    <h4 className="text-xl font-black text-slate-900">No payments yet</h4>
                    <p className="text-slate-500 font-medium">No completed transactions found for this tenant.</p>
                  </div>
                ) : (
                  payments.map((payment: any, idx: number) => (
                    <Card key={payment.id} className="rounded-2xl border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                              <CheckCircle2 size={24} />
                            </div>
                            <div>
                              <h5 className="font-black text-slate-900">{payment.propertyTitle}</h5>
                              <p className="text-xs font-bold text-slate-400">{payment.type.replace('_', ' ')} • Ref: {payment.reference.slice(0, 8)}...</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900">₦{payment.amount.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(payment.date), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
