'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, Button, Badge, ScrollShadow, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar } from '@heroui/react'
import {
   Users, ShieldAlert, CreditCard, Activity,
   AlertTriangle, CheckCircle, Search, Filter,
   Settings, MoreVertical, LayoutGrid, List, Home
} from 'lucide-react'

export default function AdminDashboard() {
   const stats = [
      { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50/10' },
      { label: 'Active Escrows', value: '₦45.2M', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50/10' },
      { label: 'Pending Verifications', value: '32', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-50/10' },
      { label: 'Platform Health', value: 'Good', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50/10' },
   ]

   return (
      <div className="space-y-12">
         {/* Header */}
         <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Admin Control Center</h1>
            <p className="text-slate-500 font-medium font-mono uppercase tracking-[0.2em] text-xs">TrustRent NG Operation Panel • Abuja, Nigeria</p>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
               >
                  <Card className="border-none shadow-none bg-slate-800/50 rounded-[2.5rem] backdrop-blur-md">
                     <CardBody className="p-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${stat.bg} ${stat.color}`}>
                           <stat.icon size={28} />
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                     </CardBody>
                  </Card>
               </motion.div>
            ))}
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            {/* Moderated Queues */}
            <section className="space-y-8">
               <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-2xl font-black tracking-tighter text-white">Pending Moderation</h3>
                  <Badge color="danger" content="12" size="sm">
                     <Button isIconOnly variant="flat" className="bg-white/5 text-white"><ShieldAlert size={20} /></Button>
                  </Badge>
               </div>

               <div className="space-y-4">
                  {[
                     { type: 'Listing', title: 'Self Contain @ Karmo', reporter: 'System (Scam Alert)', priority: 'High' },
                     { type: 'User', title: 'Landlord: Musa Bello', reporter: 'NIN Verification', priority: 'Medium' },
                     { type: 'Comment', title: 'Review by Tunde O.', reporter: 'Toxic Flag', priority: 'Low' },
                  ].map((item, idx) => (
                     <Card key={idx} className="bg-slate-800/30 border border-white/5 rounded-3xl hover:bg-slate-800/50 transition-all cursor-pointer">
                        <CardBody className="p-6 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400">
                                 {item.type === 'Listing' ? <Home size={20} /> : <Users size={20} />}
                              </div>
                              <div>
                                 <p className="font-black text-white">{item.title}</p>
                                 <p className="text-xs text-slate-500 font-medium">Flagged by: {item.reporter}</p>
                              </div>
                           </div>
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.priority === 'High' ? 'bg-red-500/10 text-red-500' : item.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                              }`}>
                              {item.priority}
                           </div>
                        </CardBody>
                     </Card>
                  ))}
               </div>
            </section>

            {/* Recent Transactions / Payouts */}
            <section className="space-y-8">
               <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-2xl font-black tracking-tighter text-white">Payments & Escrows</h3>
                  <Button isIconOnly variant="flat" className="bg-white/5 text-white"><Settings size={20} /></Button>
               </div>

               <Card className="bg-slate-800/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
                  <Table aria-label="Recent payments" removeWrapper classNames={{
                     th: "bg-white/5 text-slate-400 font-black h-12 text-[10px] uppercase tracking-widest px-6",
                     td: "px-6 py-4 font-bold text-slate-400 border-b border-white/5"
                  }}>
                     <TableHeader>
                        <TableColumn>DESC</TableColumn>
                        <TableColumn>AMOUNT</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>REF</TableColumn>
                     </TableHeader>
                     <TableBody>
                        {[
                           { desc: 'Rent Payout (Maitama)', amt: '₦8.5M', status: 'Processing', ref: 'TR_4589' },
                           { desc: 'Booking Fee (Wuse)', amt: '₦5.0K', status: 'Settled', ref: 'TR_4590' },
                           { desc: 'Refund (Gwarinpa)', amt: '₦20.0K', status: 'Scheduled', ref: 'TR_4591' },
                        ].map((tx, i) => (
                           <TableRow key={i}>
                              <TableCell className="text-white">{tx.desc}</TableCell>
                              <TableCell className="text-emerald-400 font-black">{tx.amt}</TableCell>
                              <TableCell>
                                 <span className="text-[10px] font-black uppercase">{tx.status}</span>
                              </TableCell>
                              <TableCell className="font-mono text-[10px]">{tx.ref}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>
         </div>

         {/* Global Activity Map Placeholder */}
         <section className="space-y-8">
            <h3 className="text-2xl font-black tracking-tighter text-white">Real-time Platform Activity</h3>
            <Card className="h-96 bg-slate-800/30 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/1200/800?grayscale')] bg-cover grayscale hover:opacity-20 transition-opacity" />
               <div className="relative z-10 text-center p-12">
                  <div className="flex justify-center mb-8 gap-4">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-1.5 h-8 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                     ))}
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2">Abuja Activity Monitor</h4>
                  <p className="text-slate-500 font-medium">Monitoring 245 active user sessions across 19 districts.</p>
               </div>
            </Card>
         </section>
      </div>
   )
}
