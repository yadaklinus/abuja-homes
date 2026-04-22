'use client'

import React from 'react'
import { Card, CardBody, CardFooter, Image, Button, Badge } from '@heroui/react'
import { MapPin, Bed, Bath, Maximize, Heart, ShieldCheck, Star } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface PropertyCardProps {
  property: {
    id: string
    slug: string
    title: string
    price: number
    district: string
    type: string
    bedrooms: number
    bathrooms: number
    sqft?: number
    isVerified?: boolean
    isFeatured?: boolean
    image: string
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl shadow-slate-200/50 border-none rounded-[2rem] overflow-hidden group">
        <CardBody className="p-0 relative aspect-[4/3]">
          <Image
            removeWrapper
            alt={property.title}
            className="z-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            src={property.image}
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {property.isVerified && (
              <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={14} /> Verified
              </div>
            )}
            {property.isFeatured && (
              <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                <Star size={14} fill="currentColor" /> Featured
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            isIconOnly
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-lg transition-all"
            size="sm"
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </Button>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl font-black text-lg shadow-2xl">
              ₦{property.price.toLocaleString()}<span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/yr</span>
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex flex-col items-start p-6 bg-white gap-4">
          <div className="w-full">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">{property.type.replace('_', ' ')}</p>
            <Link href={`/property/${property.slug}`}>
              <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 hover:text-emerald-600 transition-colors line-clamp-1">
                {property.title}
              </h4>
            </Link>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
              <MapPin size={14} className="text-slate-400" />
              {property.district.replace('_', ' ')}, Abuja
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Bed size={16} className="text-slate-400" />
                <span className="text-xs font-black text-slate-900">{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath size={16} className="text-slate-400" />
                <span className="text-xs font-black text-slate-900">{property.bathrooms}</span>
              </div>
              {property.sqft && (
                <div className="flex items-center gap-1.5">
                  <Maximize size={16} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-900">{property.sqft} m²</span>
                </div>
              )}
            </div>
            
            <Button
              as={Link}
              href={`/property/${property.slug}`}
              size="sm"
              variant="light"
              className="text-slate-600 font-black hover:text-emerald-600 px-2"
            >
              Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
