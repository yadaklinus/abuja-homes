'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, Select, SelectItem, Slider, CheckboxGroup, Checkbox, Card, CardBody, Badge } from '@heroui/react'
import { Search, MapPin, Filter, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/property/PropertyCard'
import { ABUJA_DISTRICTS, DISTRICT_LABELS, PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '@/constants'

// Mock Data
const MOCK_PROPERTIES = [
  { id: '1', slug: 'luxury-3-bedroom-maitama', title: 'Luxury 3 Bedroom Flat with BQ', price: 8500000, district: 'MAITAMA', type: 'THREE_BEDROOM', bedrooms: 3, bathrooms: 4, sqft: 220, isVerified: true, isFeatured: true, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
  { id: '2', slug: 'modern-2-bedroom-wuse', title: 'Modern 2 Bedroom Apartment', price: 4500000, district: 'WUSE_2', type: 'TWO_BEDROOM', bedrooms: 2, bathrooms: 2, sqft: 140, isVerified: true, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' },
  { id: '3', slug: 'self-contain-gwarinpa', title: 'Premium Self Contain', price: 850000, district: 'GWARINPA', type: 'SELF_CONTAIN', bedrooms: 1, bathrooms: 1, isVerified: true, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
  { id: '4', slug: 'bungalow-kubwa', title: 'Newly Built 3 Bedroom Bungalow', price: 2000000, district: 'KUBWA', type: 'BUNGALOW', bedrooms: 3, bathrooms: 3, isVerified: false, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800' },
]

export default function PropertiesPage() {
  const [showFilters, setShowFilters] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header / Search Area */}
        <section className="bg-white border-b border-slate-200 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-4">Properties in Abuja.</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Browse {MOCK_PROPERTIES.length}+ Verified Listings</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <Input
                    placeholder="Search by keywords (estate, street, amenity...)"
                    variant="bordered"
                    className="w-full"
                    classNames={{
                      inputWrapper: "h-16 pl-12 rounded-2xl border-slate-200 bg-white hover:border-slate-300 transition-all",
                      input: "font-bold text-slate-700"
                    }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onPress={() => setShowFilters(!showFilters)}
                    className={`lg:hidden h-16 px-6 font-black rounded-2xl gap-3 ${showFilters ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-slate-100 text-slate-700'}`}
                  >
                    <Filter size={20} /> Filters
                  </Button>

                  <div className="hidden lg:flex bg-white p-1.5 rounded-2xl border border-slate-200 gap-1">
                    <Button
                      isIconOnly
                      variant={viewMode === 'grid' ? 'solid' : 'light'}
                      className={viewMode === 'grid' ? "bg-slate-900 text-white rounded-xl" : "text-slate-400 rounded-xl"}
                      onPress={() => setViewMode('grid')}
                    >
                      <LayoutGrid size={20} />
                    </Button>
                    <Button
                      isIconOnly
                      variant={viewMode === 'list' ? 'solid' : 'light'}
                      className={viewMode === 'list' ? "bg-slate-900 text-white rounded-xl" : "text-slate-400 rounded-xl"}
                      onPress={() => setViewMode('list')}
                    >
                      <List size={20} />
                    </Button>
                  </div>

                  <Select
                    placeholder="Sort By"
                    variant="flat"
                    className="w-48 hidden sm:block"
                    classNames={{
                      trigger: "h-16 rounded-2xl bg-white border-2 border-slate-100",
                      value: "font-black text-slate-700"
                    }}
                  >
                    <SelectItem key="newest" value="newest">Newest First</SelectItem>
                    <SelectItem key="price_low" value="price_low">Price: Low to High</SelectItem>
                    <SelectItem key="price_high" value="price_high">Price: High to Low</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0 space-y-10">
              <div className="sticky top-28">
                <Card className="shadow-none border border-slate-200 rounded-[2.5rem] bg-white overflow-visible">
                  <CardBody className="p-8 space-y-10">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <h3 className="font-black text-xl text-slate-900">Filters</h3>
                      <button className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">Clear All</button>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">District</h4>
                      <Select
                        placeholder="All Abuja"
                        variant="bordered"
                        classNames={{ trigger: "rounded-2xl h-14 border-slate-200" }}
                      >
                        {Array.from(ABUJA_DISTRICTS).map(d => (
                          <SelectItem key={d} value={d}>{DISTRICT_LABELS[d]}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">Property Type</h4>
                      <CheckboxGroup color="success" className="gap-4">
                        {Array.from(PROPERTY_TYPES).slice(0, 5).map(t => (
                          <Checkbox key={t} value={t} classNames={{ label: "font-bold text-slate-600 text-sm" }}>
                            {PROPERTY_TYPE_LABELS[t]}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>

                    <div className="space-y-10">
                      <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">Price Range</h4>
                      <Slider
                        label="₦ 0 - ₦ 10M+"
                        step={100000}
                        maxValue={10000000}
                        minValue={100000}
                        defaultValue={[500000, 5000000]}
                        showSteps={false}
                        showOutline={false}
                        id="price-range"
                        className="max-w-md"
                        color="success"
                        size="sm"
                        formatOptions={{ style: 'currency', currency: 'NGN' }}
                        classNames={{
                          filler: "bg-emerald-500",
                          label: "font-black text-slate-700 mb-6",
                          value: "font-bold text-slate-500 text-xs"
                        }}
                      />
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">Bedrooms</h4>
                      <div className="flex gap-2">
                        {['ANY', '1', '2', '3', '4+'].map(num => (
                          <button key={num} className={`flex-1 h-10 rounded-xl border-2 font-black text-xs transition-all ${num === 'ANY' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'}`}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Checkbox color="success" classNames={{ label: "font-black text-slate-900" }}>Newly Built Only</Checkbox>
                      <Checkbox color="success" classNames={{ label: "font-black text-slate-900" }}>Fully Furnished</Checkbox>
                      <Checkbox color="success" defaultSelected classNames={{ label: "font-black text-slate-900" }}>NIN Verified Only</Checkbox>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1 space-y-12">
              {/* Dynamic Filter Tags */}
              <div className="flex flex-wrap gap-3">
                <Badge content={<X size={12} />} variant="solid" color="success" className="cursor-pointer">
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">Wuse 2</div>
                </Badge>
                <Badge content={<X size={12} />} variant="solid" color="success" className="cursor-pointer">
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">2+ Bedrooms</div>
                </Badge>
              </div>

              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {MOCK_PROPERTIES.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {/* Pagination Placeholder */}
              <div className="flex items-center justify-center pt-12 pb-24">
                <Button color="primary" variant="bordered" className="h-16 px-12 rounded-[2rem] border-slate-200 text-slate-900 font-black text-lg hover:bg-slate-50 transition-all">
                  Load More Properties
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
