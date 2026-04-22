'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Select, SelectItem, Card, CardBody, Badge, Image } from '@heroui/react'
import { Search, MapPin, ShieldCheck, Home, ArrowRight, Star, Clock, Heart, Users } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ABUJA_DISTRICTS, DISTRICT_LABELS } from '@/constants'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] animate-pulse delay-700" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-8">
                  <ShieldCheck size={16} /> Verified Properties Only
                </div>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 mb-8">
                  Find a Home in Abuja <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Without the Stress.</span>
                </h1>
                <p className="text-lg sm:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                  The only marketplace using mandatory identity verification and secure escrow to protect your rental payments in Abuja.
                </p>
              </motion.div>

              {/* Hero Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="p-3 sm:p-4 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 px-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0">
                  <MapPin className="text-slate-400 shrink-0" size={20} />
                  <Select 
                    placeholder="Where in Abuja?" 
                    variant="bordered"
                    className="w-full"
                    classNames={{
                      trigger: "shadow-none border-none px-0 h-10 min-h-0",
                      value: "font-bold text-slate-700",
                    }}
                  >
                    {ABUJA_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {DISTRICT_LABELS[d]}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex-1 px-4 flex items-center gap-3 pb-3 sm:pb-0">
                  <Home className="text-slate-400 shrink-0" size={20} />
                  <Select 
                    placeholder="Property Type" 
                    variant="bordered"
                    className="w-full"
                    classNames={{
                      trigger: "shadow-none border-none px-0 h-10 min-h-0",
                      value: "font-bold text-slate-700",
                    }}
                  >
                     <SelectItem key="flats" value="flats">Apartments/Flats</SelectItem>
                     <SelectItem key="houses" value="houses">Houses/Duplexes</SelectItem>
                     <SelectItem key="rooms" value="rooms">Rooms/Shared</SelectItem>
                  </Select>
                </div>
                <Button 
                  as={Link}
                  href="/properties"
                  color="primary" 
                  size="lg" 
                  className="bg-slate-900 text-white font-black h-16 sm:px-10 rounded-[1.5rem] text-lg active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                  startContent={<Search size={22} />}
                >
                  Search
                </Button>
              </motion.div>
            </div>

            {/* Trusted By / Stats */}
            <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-2"><div className="w-10 h-10 bg-slate-200 rounded-full" /><span className="font-bold text-slate-400">ABUJA LANDS</span></div>
               <div className="flex items-center gap-2"><div className="w-10 h-10 bg-slate-200 rounded-full" /><span className="font-bold text-slate-400">FCT HOUSING</span></div>
               <div className="flex items-center gap-2"><div className="w-10 h-10 bg-slate-200 rounded-full" /><span className="font-bold text-slate-400">NG PROPERTIES</span></div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-6">Discover by District.</h2>
                <p className="text-lg text-slate-500 font-medium">Explore the best rentals in Abuja's most sought-after neighborhoods.</p>
              </div>
              <Button 
                as={Link} 
                href="/properties" 
                variant="light" 
                className="font-black text-emerald-600 group"
                endContent={<ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
              >
                View All Districts
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[
                { name: "Maitama", count: "142", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400", district: "MAITAMA" },
                { name: "Asokoro", count: "98", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400", district: "ASOKORO" },
                { name: "Wuse 2", count: "215", img: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=400", district: "WUSE_2" },
                { name: "Gwarinpa", count: "310", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400", district: "GWARINPA" },
              ].map((item, idx) => (
                <Link key={idx} href={`/properties?district=${item.district}`} className="group relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-slate-200">
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                    <p className="text-white text-3xl font-black tracking-tight mb-2">{item.name}</p>
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">{item.count} Listings</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why TrustRent NG */}
        <section className="py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 mb-12">Built to End <br /> <span className="text-red-500 italic">Rental Scams.</span></h2>
                
                <div className="space-y-12">
                  {[
                    { icon: ShieldCheck, title: "Identity Verified", desc: "Every landlord must verify their identity using NIN or BVN before listing. No ghosts, no fakes.", color: "bg-emerald-50 text-emerald-600" },
                    { icon: Clock, title: "Escrow Protection", desc: "Your rent stays in our secure escrow and is only released to the landlord after you've moved in.", color: "bg-blue-50 text-blue-600" },
                    { icon: Users, title: "Verified Reviews", desc: "Real reviews from past tenants. Know the building and the landlord's reputation before you sign.", color: "bg-amber-50 text-amber-600" },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-8">
                      <div className={`w-16 h-16 rounded-[1.5rem] shrink-0 flex items-center justify-center ${feature.color}`}>
                        <feature.icon size={28} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-2">{feature.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-slate-50 rounded-[4rem] relative overflow-hidden border border-slate-100 shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" alt="App Preview" className="w-[85%] rounded-[2rem] shadow-2xl rotate-2" />
                  </div>
                </div>
                {/* Floating Cards */}
                <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl shadow-emerald-200 border border-emerald-50 flex items-center gap-4 animate-bounce duration-[3000ms]">
                   <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                      <Star fill="currentColor" size={24} />
                   </div>
                   <div>
                      <p className="font-black text-slate-900">Verified Listing</p>
                      <p className="text-xs font-bold text-slate-500">100% Genuine</p>
                   </div>
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl shadow-blue-200 border border-blue-50 flex items-center gap-4 animate-pulse">
                   <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                      <Heart fill="currentColor" size={24} />
                   </div>
                   <div>
                      <p className="font-black text-slate-900">Escrow Active</p>
                      <p className="text-xs font-bold text-slate-500">Payment Secured</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-30">
                  <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[150px]" />
                  <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px]" />
               </div>
               
               <div className="relative z-10">
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-8">Ready to find your <br /> next home?</h2>
                  <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-16">
                    Join thousands of Nigerians renting with confidence. No more agents running with your money.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                     <Button 
                       as={Link} 
                       href="/register" 
                       size="lg" 
                       className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl px-12 h-20 rounded-3xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                     >
                       Start Searching
                     </Button>
                     <Button 
                       as={Link} 
                       href="/landlord/register" 
                       size="lg" 
                       variant="bordered"
                       className="border-white/20 text-white hover:bg-white/10 font-black text-xl px-12 h-20 rounded-3xl active:scale-95 transition-all"
                     >
                       List your Property
                     </Button>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
