'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardBody, Divider, Image, Badge, Switch, useDisclosure } from '@heroui/react'
import { 
  MapPin, Bed, Bath, Maximize, Heart, ShieldCheck, 
  Share2, Info, Star, CheckCircle2, ChevronRight, 
  MessageSquare, Calendar, Zap, Wifi, Video, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BookingModal from '@/components/property/BookingModal'

export default function PropertyDetailPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  
  // Mock Property
  const property = {
    title: 'Luxury 3 Bedroom Flat with BQ in Maitama',
    price: 8500000,
    serviceCharge: 1200000,
    cautionFee: 500000,
    district: 'MAITAMA',
    street: 'Gana Street',
    estate: 'Emerald Court',
    type: 'THREE_BEDROOM',
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    sqft: 220,
    isFurnished: false,
    isNewlyBuilt: true,
    isVerified: true,
    isFeatured: true,
    description: 'Experience unparalleled luxury in the heart of Maitama. This stunning 3-bedroom apartment features premium finishes, massive floor-to-ceiling windows, and automated climate control. Located in an exclusive estate with 24/7 security, gym, and steady power supply.',
    amenities: ['CCTV', 'Swimming Pool', 'Gym', '24/7 Security', 'Borehole', 'Fiber Optic Internet', 'Green Area', 'Smart Home'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    ]
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-12">
          {/* Breadcrumbs & Actions */}
          <div className="flex items-center justify-between">
            <Link href="/properties" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} /> Back to Search
            </Link>
            <div className="flex gap-4">
              <Button isIconOnly variant="light" className="rounded-full"><Share2 size={20} /></Button>
              <Button isIconOnly variant="light" className="rounded-full"><Heart size={20} /></Button>
            </div>
          </div>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden group">
            <div className="md:col-span-2 md:row-span-2 h-full">
              <Image removeWrapper src={property.images[0]} alt="Hero" className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" />
            </div>
            <div className="hidden md:block md:col-span-1 md:row-span-1 h-full">
               <Image removeWrapper src={property.images[1]} alt="Gallery" className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" />
            </div>
            <div className="hidden md:block md:col-span-1 md:row-span-1 h-full">
               <Image removeWrapper src={property.images[2]} alt="Gallery" className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" />
            </div>
            <div className="hidden md:block md:col-span-2 md:row-span-1 h-full relative">
               <Image removeWrapper src={property.images[3]} alt="Gallery" className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" />
               <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Button variant="flat" className="bg-white/20 backdrop-blur-md text-white font-black border-white/20 border-2 rounded-2xl">
                    View 15 Photos
                  </Button>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-16">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {property.isVerified && (
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Verified Listing
                    </div>
                  )}
                  {property.isNewlyBuilt && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">Nearly Built</div>
                  )}
                  <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type.replace('_', ' ')}</div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">{property.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold">
                   <div className="flex items-center gap-2"><MapPin size={20} className="text-emerald-500" /> {property.street}, {property.district}, Abuja</div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-300 rounded-full" /> {property.estate}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 p-8 bg-slate-50 rounded-[2.5rem]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]"><Bed size={16} /> Bedrooms</div>
                  <p className="text-2xl font-black text-slate-900">{property.bedrooms}</p>
                </div>
                <div className="w-px h-12 bg-slate-200 self-center hidden sm:block" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]"><Bath size={16} /> Bathrooms</div>
                  <p className="text-2xl font-black text-slate-900">{property.bathrooms}</p>
                </div>
                <div className="w-px h-12 bg-slate-200 self-center hidden sm:block" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]"><Maximize size={16} /> Area</div>
                  <p className="text-2xl font-black text-slate-900">{property.sqft} m²</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">About this Space</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl">{property.description}</p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-8">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {property.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-bold text-slate-600">
                      <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Virtual Tour Teaser */}
              <Card className="bg-slate-900 text-white rounded-[3rem] overflow-hidden border-none shadow-2xl p-0">
                 <CardBody className="p-0 relative h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent z-10 flex flex-col justify-center px-12 max-w-md">
                       <h4 className="text-3xl font-black tracking-tighter mb-4">Experience a Virtual Tour</h4>
                       <p className="text-slate-400 font-medium mb-8">Take a high-definition 3D walkthrough of this property from anywhere in the world.</p>
                       <Button color="primary" className="h-14 px-8 bg-emerald-500 rounded-2xl font-black w-fit gap-3" startContent={<Video size={20} />}>
                          Start Tour
                       </Button>
                    </div>
                    <Image src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60" />
                 </CardBody>
              </Card>
            </div>

            {/* Right Column: Pricing & Booking Sidebar */}
            <aside className="space-y-8">
              <div className="sticky top-28">
                <Card className="shadow-2xl shadow-slate-200 border-none rounded-[3rem] bg-white">
                  <CardBody className="p-8 sm:p-12">
                    <div className="mb-10">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Yearly Rent</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">₦{property.price.toLocaleString()}</h2>
                        <span className="text-lg text-slate-500 font-black">/yr</span>
                      </div>
                    </div>

                    <div className="space-y-6 mb-12">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">Service Charge</span>
                        <span className="text-slate-900 font-black">₦{property.serviceCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">Caution Fee (Refundable)</span>
                        <span className="text-slate-900 font-black">₦{property.cautionFee.toLocaleString()}</span>
                      </div>
                      <Divider className="opacity-50" />
                      <div className="flex items-center justify-between">
                         <span className="text-slate-900 font-black">Total Move-in Cost</span>
                         <span className="text-2xl font-black text-emerald-600">₦{(property.price + property.serviceCharge + property.cautionFee).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        onPress={onOpen}
                        color="primary" 
                        size="lg" 
                        className="w-full h-20 bg-slate-900 hover:bg-emerald-600 text-white font-black text-xl rounded-3xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                        startContent={<Calendar size={24} />}
                      >
                        Book Inspection
                      </Button>
                      <Button 
                        variant="light" 
                        size="lg" 
                        className="w-full h-16 rounded-2xl font-black text-slate-500 hover:text-slate-900 gap-3"
                        startContent={<MessageSquare size={20} />}
                      >
                        Chat with Landlord
                      </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-start gap-4">
                       <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Secure payments via TrustRent Escrow. 100% money-back guarantee if the property doesn't match the listing.
                       </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Landlord Brief Card */}
                <Card className="mt-8 shadow-none border border-slate-100 rounded-[2.5rem] bg-slate-50">
                   <CardBody className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center">
                         <ShieldCheck className="text-emerald-500" size={32} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Managed By</p>
                         <h5 className="font-black text-slate-900">Verified Landlord</h5>
                         <p className="text-xs text-emerald-600 font-bold">NIN Verified • 12 Active Listings</p>
                      </div>
                   </CardBody>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <BookingModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        propertyTitle={property.title}
        propertyPrice={property.price}
      />
      <Footer />
    </div>
  )
}
