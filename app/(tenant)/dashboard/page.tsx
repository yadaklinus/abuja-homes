'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, Button, Badge, ScrollShadow, Avatar } from '@heroui/react'
import {
  Zap, Clock, Heart, MessageSquare,
  Calendar, CreditCard, ChevronRight, Info,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function TenantDashboard() {
  const stats = [
    { label: 'Inspection(s)', value: '2', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Saved Houses', value: '12', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Unread Chats', value: '5', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Rents', value: '0', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Hello, John 👋</h1>
        <p className="text-slate-500 font-medium">Here's what's happening with your property search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem]">
              <CardBody className="p-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Feed: Upcoming Inspections */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900">Upcoming Inspections</h3>
              <Link href="/bookings" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Luxury 3BR Flat', location: 'Maitama', date: 'Tomorrow, 10:30 AM', status: 'CONFIRMED' },
                { title: 'Modern 2BR Apt', location: 'Wuse 2', date: 'Oct 15, 2:00 PM', status: 'PENDING' },
              ].map((booking, idx) => (
                <Card key={idx} className="border border-slate-100 shadow-sm rounded-3xl group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                  <CardBody className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                        <img src="https://picsum.photos/200/200" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 mb-1">{booking.title}</h4>
                        <p className="text-sm text-slate-500 font-medium mb-1">{booking.location}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                          <Clock size={14} /> {booking.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {booking.status}
                      </div>
                      <Button isIconOnly variant="light" className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden border-none shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
                  <CreditCard size={32} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black tracking-tighter mb-2">Ready to Pay?</h4>
                  <p className="text-slate-400 font-medium">Use our secure escrow system to finalize your rental. Your funds are protected until move-in.</p>
                </div>
                <Button className="h-14 px-8 bg-white text-slate-900 font-black rounded-2xl shadow-xl active:scale-95 transition-all shrink-0">
                  View Payment Flow
                </Button>
              </div>
            </Card>
          </section>
        </div>

        {/* Sidebar: Platform Notifications / Help */}
        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Platform Care</h3>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <div>
                  <p className="font-black text-amber-900 text-sm mb-1">Incomplete Profile</p>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Verify your identity with NIN to get priority response from landlords.
                  </p>
                  <Button variant="flat" size="sm" className="mt-3 bg-amber-200 text-amber-900 font-bold rounded-lg h-8">
                    Verify Now
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <Info className="text-blue-500 shrink-0" size={24} />
                <div>
                  <p className="font-black text-blue-900 text-sm mb-1">Safety Tip</p>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Never pay outside the TrustRent platform. Our escrow only protects intra-platform payments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Messages</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <Avatar src={`https://i.pravatar.cc/150?u=${i}`} size="md" className="rounded-2xl shrink-0" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-50 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0 border-b border-slate-100 pb-4 group-last:border-none">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-sm text-slate-900 truncate">Landlord {i}</p>
                      <p className="text-[10px] font-bold text-slate-400">2h ago</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate group-hover:text-slate-900 transition-colors">
                      The property is available for inspection tomorrow...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
