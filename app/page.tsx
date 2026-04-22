'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Shield, MapPin, Key, Home, Building, ChevronRight,
  Menu, X, CheckCircle2, ArrowRight, ShieldCheck, Wallet, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────── DATA ─────────────────────────── */

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '100% Verified Landlords',
    desc: 'Every landlord undergoes strict NIN & BVN verification. No more scams or fake agents.',
  },
  {
    icon: Wallet,
    title: 'Escrow Payments',
    desc: 'Your rent is held securely until you move in and approve the property.',
  },
  {
    icon: Home,
    title: 'Virtual 360° Tours',
    desc: 'Inspect properties remotely with high-quality panoramic tours before visiting.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    desc: 'Chat directly with verified property owners securely within the platform.',
  },
];

const POPULAR_DISTRICTS = [
  { name: 'Maitama', properties: '124+', image: 'https://images.unsplash.com/photo-1542314831-c6a4d1424b94?auto=format&fit=crop&q=80&w=600' },
  { name: 'Wuse 2', properties: '98+', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600' },
  { name: 'Asokoro', properties: '85+', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { name: 'Gwarinpa', properties: '210+', image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80&w=600' },
];

const NAV_LINKS = [
  { name: 'Browse Properties', href: '/properties' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'For Landlords', href: '/register?role=LANDLORD' },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <h1 className="sr-only">TrustRent NG — Verified Property Rentals in Abuja</h1>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
              <Shield size={24} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              TrustRent<span className="text-primary">.ng</span>
            </span>
          </Link>

          <nav className="hidden lg:flex gap-8 text-sm font-semibold text-slate-600">
            {NAV_LINKS.map((l) => (
              <Link key={l.name} href={l.href} className="hover:text-primary transition-colors">
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primaryDark transition-all shadow-md active:scale-95"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col p-6 gap-6"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-slate-800 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <Link href="/login" className="text-lg font-semibold text-slate-800">Sign In</Link>
              <Link
                href="/register"
                className="bg-primary text-white text-center py-3 rounded-xl text-lg font-semibold"
              >
                Create Account
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">

        {/* ══════════════════ HERO SECTION ══════════════════ */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
              alt="Abuja Luxury Home"
              fill
              className="object-cover opacity-5"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-slate-50" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-full">
                <ShieldCheck size={16} /> Abuja's Only Verified Rental Platform
              </span>
              
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                Rent with <span className="text-primary">Confidence.</span><br />
                Zero Scams, Zero Stress.
              </h2>
              
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Connect directly with verified landlords. Pay securely via escrow. Enjoy a scam-free home search experience across Abuja.
              </p>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="flex-1 flex items-center px-6 py-3 sm:py-0">
                  <MapPin className="text-slate-400 mr-3" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by district (e.g. Maitama, Wuse)" 
                    className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-lg"
                  />
                </div>
                <div className="hidden sm:block w-px bg-slate-200 my-3 mx-4"></div>
                <div className="flex-1 flex items-center px-6 py-3 sm:py-0 border-t border-slate-100 sm:border-0">
                  <Home className="text-slate-400 mr-3" size={20} />
                  <select className="w-full bg-transparent border-none outline-none text-slate-800 cursor-pointer text-lg">
                    <option value="">Property Type</option>
                    <option value="SELF_CONTAIN">Self Contain</option>
                    <option value="ONE_BEDROOM">1 Bedroom</option>
                    <option value="TWO_BEDROOM">2 Bedroom</option>
                    <option value="THREE_BEDROOM">3 Bedroom</option>
                    <option value="DUPLEX">Duplex</option>
                  </select>
                </div>
                <button className="bg-primary text-white w-full sm:w-auto px-8 py-4 sm:py-0 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primaryDark transition-colors m-1">
                  <Search size={18} /> Search
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Verified Hosts</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Escrow Protection</span>
                <span className="hidden sm:flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Virtual Tours</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════ HOW IT WORKS / FEATURES ══════════════════ */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">The New Standard for Rentals</h2>
              <p className="mt-4 text-lg text-slate-600">We've eliminated the risks associated with renting in Nigeria using technology and strict vetting processes.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
                    <feat.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ POPULAR DISTRICTS ══════════════════ */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Explore Abuja</h2>
                <p className="mt-3 text-slate-600 text-lg">Find premium listings in the city's most sought-after neighborhoods.</p>
              </div>
              <Link href="/properties" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primaryDark">
                View All Areas <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {POPULAR_DISTRICTS.map((district) => (
                <Link href={`/properties?district=${district.name.toUpperCase()}`} key={district.name} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                  <Image 
                    src={district.image}
                    alt={district.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{district.name}</h3>
                    <p className="text-blue-100 font-medium">{district.properties} Verified Properties</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <Link href="/properties" className="mt-8 flex sm:hidden items-center justify-center gap-2 text-primary font-bold">
              View All Areas <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* ══════════════════ LANDLORD CTA ══════════════════ */}
        <section className="py-24 bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
              <div className="p-10 sm:p-16 lg:w-3/5 text-white">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Are you a Landlord or Agent?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl">
                  Join thousands of verified landlords making faster, safer rentals on TrustRent NG. We handle the verification, tours, and payments so you can focus on managing your properties.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300" /> Free Property Listings</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300" /> Guaranteed Escrow Payments</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300" /> Pre-screened, serious tenants</li>
                </ul>
                <Link 
                  href="/register?role=LANDLORD"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  List a Property <ChevronRight size={20} />
                </Link>
              </div>
              <div className="hidden lg:block lg:w-2/5 relative h-full min-h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                  alt="Landlord"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="text-xl font-bold text-slate-900">TrustRent.ng</span>
              </Link>
              <p className="text-slate-500 font-medium max-w-sm mb-6">
                Nigeria's premier verified property rental platform. Bringing trust, transparency, and technology to Abuja real estate.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="/properties" className="hover:text-primary">Browse Properties</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary">How it works</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing & Fees</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/escrow-policy" className="hover:text-primary">Escrow Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} TrustRent NG. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Secured by Flutterwave</span>
              <span>100% Identity Verification</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}