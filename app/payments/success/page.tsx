'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardBody } from '@heroui/react'
import { CheckCircle2, Home, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-xl w-full"
        >
           <Card className="border-none shadow-2xl shadow-emerald-200/50 rounded-[4rem] bg-white p-12 text-center">
              <CardBody className="p-0">
                 <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 size={48} />
                 </div>
                 
                 <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Payment Secured!</h1>
                 <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                    Your payment has been successfully placed in TrustRent Escrow. The funds will be released to the landlord only after you confirm move-in.
                 </p>

                 <div className="bg-slate-50 rounded-3xl p-6 mb-12 flex items-start gap-4 text-left border border-slate-100">
                    <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                    <p className="text-xs text-slate-600 font-medium">
                       Transaction reference: <span className="font-mono font-black">TR-RENT-90XJ7K2</span>. A receipt has been sent to your email.
                    </p>
                 </div>

                 <div className="flex flex-col gap-4">
                    <Button 
                      as={Link} 
                      href="/dashboard" 
                      color="primary" 
                      className="h-16 bg-slate-900 rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-900/20"
                    >
                       Go to Dashboard
                    </Button>
                    <Button 
                      as={Link} 
                      href="/properties" 
                      variant="light" 
                      className="font-black text-slate-500"
                      endContent={<ArrowRight size={18} />}
                    >
                       Explore More Properties
                    </Button>
                 </div>
              </CardBody>
           </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
