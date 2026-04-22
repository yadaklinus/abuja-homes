'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, Button, Badge, Avatar, Progress, Tooltip, Skeleton } from '@heroui/react'
import {
  Home, Users, CreditCard, Calendar,
  TrendingUp, MessageSquare, Plus,
  ChevronRight, ArrowUpRight,
  ShieldCheck, AlertCircle, Eye,
  LayoutDashboard, Wallet, Settings,
  RefreshCcw
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface DashboardData {
  stats: {
    totalProperties: number
    rentedProperties: number
    occupancyRate: number
    monthlyEarnings: number
    pendingBookings: number
  }
  upcomingInspections: any[]
  topProperties: any[]
  user: {
    name: string
    image: string
    isVerified: boolean
  }
}

export default function LandlordDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/landlord/stats')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading && !data) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="w-48 h-8 rounded-full" />
            <Skeleton className="w-96 h-12 rounded-2xl" />
            <Skeleton className="w-64 h-6 rounded-lg" />
          </div>
          <Skeleton className="w-48 h-14 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 rounded-[2.5rem]" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <Skeleton className="h-96 rounded-[3rem]" />
            <Skeleton className="h-64 rounded-[3rem]" />
          </div>
          <Skeleton className="h-full rounded-[3rem]" />
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Properties', value: data?.stats.totalProperties || 0, icon: Home, color: 'text-blue-500', bg: 'bg-blue-50', change: 'Total listed' },
    { label: 'Occupancy Rate', value: `${data?.stats.occupancyRate || 0}%`, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', change: 'Rental status' },
    { label: 'Monthly Earnings', value: `₦${(data?.stats.monthlyEarnings || 0).toLocaleString()}`, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50', change: 'Current month' },
    { label: 'Pending Inquiries', value: data?.stats.pendingBookings || 0, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50', change: 'Action required' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              Landlord Dashboard
            </div>
            {data?.user.isVerified && (
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} />
                Identity Verified
              </div>
            )}
            <Button 
              isIconOnly 
              variant="flat" 
              size="sm" 
              className="rounded-full bg-slate-100 text-slate-500 hover:rotate-180 transition-transform duration-500"
              onClick={fetchData}
            >
              <RefreshCcw size={14} />
            </Button>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tighter text-slate-900 leading-tight"
          >
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{data?.user.name.split(' ')[0]}</span> 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium mt-2"
          >
            Here's what's happening with your portfolio today.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Button 
            as={Link} 
            href="/landlord/properties/new" 
            className="h-14 px-8 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:shadow-slate-200 hover:-translate-y-1 active:scale-95 transition-all"
            startContent={<Plus size={20} strokeWidth={3} />}
          >
            List New Property
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.4 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/60 transition-all group cursor-default">
              <CardBody className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                    <Badge 
                      color={stat.color.includes('emerald') ? 'success' : stat.color.includes('amber') ? 'warning' : 'primary'} 
                      variant="flat" 
                      className="font-black text-[10px]"
                    >
                      ACTIVE
                    </Badge>
                  </div>
                </div>
                <p className="text-4xl font-black text-slate-900 mb-2 tracking-tighter leading-none truncate">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <span className={`text-[10px] font-bold ${stat.color.includes('emerald') || stat.color.includes('purple') ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Section (Left) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Upcoming Inspections */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                <Calendar className="text-blue-600" />
                Upcoming Inspections
              </h3>
              <Button as={Link} href="/landlord/bookings" variant="light" className="text-blue-600 font-black text-sm hover:underline p-0">
                Manage All Bookings <ChevronRight size={16} strokeWidth={3} />
              </Button>
            </div>

            <div className="space-y-4">
              {!data?.upcomingInspections.length ? (
                <Card className="border-dashed border-2 border-slate-200 shadow-none rounded-3xl bg-slate-50/50">
                  <CardBody className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
                      <Calendar size={32} />
                    </div>
                    <p className="font-black text-slate-900 mb-1">No upcoming inspections</p>
                    <p className="text-sm text-slate-400 font-medium">When tenants book an inspection, they will show up here.</p>
                  </CardBody>
                </Card>
              ) : (
                data.upcomingInspections.map((booking, idx) => (
                  <Card 
                    key={booking.id} 
                    className="border border-slate-100 shadow-sm rounded-3xl group hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden"
                  >
                    <CardBody className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-inner">
                          <img 
                            src={booking.property.images[0]?.url || `https://picsum.photos/seed/${idx}/200/200`} 
                            alt={booking.property.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-xl text-slate-900 truncate">{booking.property.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                              booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium mb-3 flex items-center gap-1">
                            Tenant: <span className="text-slate-900 font-bold">{booking.tenant.profile?.displayName || 'Mufti User'}</span>
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                              <Calendar size={14} strokeWidth={2.5} /> {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
                               {booking.property.district}, {booking.property.estate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Tooltip content="Chat with Tenant">
                            <Button isIconOnly variant="flat" className="bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors">
                              <MessageSquare size={18} />
                            </Button>
                          </Tooltip>
                          <Button as={Link} href={`/landlord/bookings/${booking.id}`} className="h-12 px-6 bg-slate-900 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Quick Stats / Wallet Preview */}
          <section>
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-[3rem] p-12 relative overflow-hidden border-none shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -mr-24 -mt-24" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 -ml-24 -mb-24" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Wallet size={32} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black tracking-tighter mb-2">Escrow Wallet Balance</h4>
                    <p className="text-slate-400 font-medium">Your payouts are ready to be settled. All funds are secured via Flutterwave Escrow.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Monthly Earnings</p>
                      <p className="text-2xl font-black text-white leading-none">₦{(data?.stats.monthlyEarnings || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-2xl font-black text-emerald-400 leading-none">Healthy</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 space-y-6">
                  <h5 className="font-black text-lg flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-400" />
                    Earnings Report
                  </h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-slate-400">Monthly Performance</span>
                        <span className="text-white">Active</span>
                      </div>
                      <Progress 
                        value={data?.stats.occupancyRate || 0} 
                        className="h-3" 
                        classNames={{
                          indicator: "bg-gradient-to-r from-blue-500 to-indigo-500",
                          base: "bg-slate-700/50"
                        }} 
                      />
                    </div>
                  </div>
                  <Button as={Link} href="/wallet" className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-colors">
                    Withdraw Funds
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-12">
          {/* Quick Actions */}
          <section>
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Management</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'My Properties', icon: Home, link: '/landlord/properties', desc: 'Manage your listings' },
                { label: 'Tenancy History', icon: Users, link: '/landlord/tenants', desc: 'Review past rentals' },
                { label: 'Platform Wallet', icon: Wallet, link: '/wallet', desc: 'View payout history' },
                { label: 'Account Settings', icon: Settings, link: '/profile', desc: 'Verification & Profile' },
              ].map((action, idx) => (
                <Card 
                  key={idx} 
                  as={Link}
                  href={action.link}
                  className="border border-slate-100 shadow-sm rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
                >
                  <CardBody className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <action.icon size={22} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{action.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{action.desc}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

          {/* Performance Overview */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900">Top Performing</h3>
              <Tooltip content="Based on total property views">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                  <ArrowUpRight size={16} />
                </div>
              </Tooltip>
            </div>

            <div className="space-y-6">
              {!data?.topProperties.length ? (
                <p className="text-sm text-slate-400 font-medium text-center py-8">No property data available yet.</p>
              ) : (
                data.topProperties.map((prop, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <p className="text-sm font-black text-slate-900 truncate pr-4">{prop.title}</p>
                      <div className="flex items-center gap-1 group/eye cursor-pointer">
                         <Eye size={14} className="text-slate-300 group-hover/eye:text-blue-500 transition-colors" />
                         <span className="text-[10px] font-black text-slate-400 group-hover/eye:text-blue-600 transition-colors">{prop.views}</span>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(100, (prop.views / (data.topProperties[0].views || 1)) * 100)} 
                      className="h-2" 
                      color="primary"
                      classNames={{
                        indicator: idx === 0 ? "bg-blue-600" : idx === 1 ? "bg-indigo-500" : "bg-slate-400",
                        base: "bg-slate-100"
                      }}
                    />
                    <div className="flex justify-between px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prop.inquiries} Inquiries</span>
                      <span className="text-[10px] font-black text-slate-900">{prop.views} Views</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Account Health */}
          <section>
            <Card className="bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center text-amber-900 shrink-0">
                  <AlertCircle size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 text-lg leading-tight mb-1">Increase Response Rate</h4>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Landlords with sub-2h response times get 3x more bookings. Try to respond soon!
                  </p>
                </div>
              </div>
              <Button as={Link} href="/profile" className="w-full h-12 bg-amber-900 text-white font-black rounded-xl shadow-lg shadow-amber-900/20 active:scale-95 transition-all">
                Improve My Profile
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
