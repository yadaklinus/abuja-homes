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
  Chip
} from '@heroui/react'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export default function LandlordWalletPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/landlord/wallet')
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch wallet:', error)
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }
    fetchWallet()
  }, [])

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
        <Skeleton className="w-48 h-8 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Skeleton className="h-64 rounded-[3rem]" />
           <Skeleton className="h-64 rounded-[3rem]" />
        </div>
        <Skeleton className="h-96 rounded-[3rem]" />
      </div>
    )
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
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Platform Wallet</h1>
          <p className="text-slate-500 font-medium">Manage your earnings and payout history.</p>
        </div>
        <Button 
          variant="flat"
          className="bg-white border border-slate-100 font-black h-12 px-6 rounded-xl"
          startContent={<Download size={18} />}
        >
          Download Report
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-[3rem] p-12 relative overflow-hidden border-none shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -mr-24 -mt-24" />
          <CardBody className="p-0 relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Wallet size={32} className="text-blue-400" />
               </div>
               <Badge className="font-black text-[10px] bg-emerald-500 text-white border-none py-1">SECURE</Badge>
            </div>
            <div className="mt-12">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
               <h2 className="text-6xl font-black tracking-tighter leading-none mb-6">₦{data.balance.toLocaleString()}</h2>
               <div className="flex items-center gap-4">
                  <Button className="flex-1 h-14 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all">
                    Withdraw to Bank
                  </Button>
                  <Button isIconOnly className="h-14 w-14 bg-white/10 text-white rounded-2xl border border-white/10">
                    <TrendingUp size={24} />
                  </Button>
               </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
           <CardBody className="p-0 flex flex-col justify-between h-full">
              <div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Pending (In Escrow)</p>
                 <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">₦{data.pending.toLocaleString()}</h2>
                 <p className="text-slate-400 text-sm font-medium mt-4 max-w-xs">
                    Funds are held in escrow until inspection is completed or lease is signed.
                 </p>
              </div>
              <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Clock size={20} className="text-amber-500" />
                       <span className="font-bold text-slate-700">Next Payout</span>
                    </div>
                    <span className="font-black text-slate-900">In 48 Hours</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={20} className="text-emerald-500" />
                       <span className="font-bold text-slate-700">Payment Gateway</span>
                    </div>
                    <span className="font-black text-emerald-600">Active</span>
                 </div>
              </div>
           </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <section>
        <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-8">Payout History</h3>
        <Card className="border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
           <CardBody className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50">
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {data.transactions.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                               No transactions recorded yet.
                            </td>
                         </tr>
                       ) : (
                         data.transactions.map((tx: any) => (
                           <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <Avatar src={tx.payerAvatar} size="sm" name={tx.payerName} />
                                    <div>
                                       <p className="font-black text-slate-900 leading-none mb-1">{tx.payerName}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.propertyTitle}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="font-black text-slate-900">₦{tx.amount.toLocaleString()}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.type}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <Chip 
                                    size="sm" 
                                    className={`font-black text-[9px] ${
                                       tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                       tx.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                    }`}
                                 >
                                    {tx.status}
                                 </Chip>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="font-mono text-xs text-slate-400 group-hover:text-blue-600 transition-colors uppercase">
                                    {tx.reference.slice(0, 12)}...
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex flex-col items-end">
                                    <p className="font-black text-slate-900 leading-none mb-1">{new Date(tx.date).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                 </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </CardBody>
        </Card>
      </section>
    </div>
  )
}
