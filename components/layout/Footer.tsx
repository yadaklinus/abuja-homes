import React from 'react'
import { ShieldCheck, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'
import Link from 'next/link'
import { Divider } from '@heroui/react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <ShieldCheck className="text-emerald-400 group-hover:text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">TrustRent NG</span>
            </Link>
            <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8 text-sm sm:text-base">
              The first truly verified property marketplace in Abuja. We use mandatory NIN/BVN verification and secure escrow payments to eliminate rental fraud.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-black text-sm uppercase tracking-widest mb-8 text-emerald-400">Marketplace</h5>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><Link href="/properties?type=SELF_CONTAIN" className="hover:text-white transition-colors">Self Contains</Link></li>
              <li><Link href="/properties?type=ONE_BEDROOM" className="hover:text-white transition-colors">One Bedroom Flats</Link></li>
              <li><Link href="/properties?type=TWO_BEDROOM" className="hover:text-white transition-colors">Two Bedroom Flats</Link></li>
              <li><Link href="/properties?district=MAITAMA" className="hover:text-white transition-colors">Maitama Rentals</Link></li>
              <li><Link href="/properties?district=WUSE" className="hover:text-white transition-colors">Wuse Rentals</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-sm uppercase tracking-widest mb-8 text-emerald-400">Support</h5>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors">Safety Tips</Link></li>
              <li><Link href="/landlord/how-it-works" className="hover:text-white transition-colors">List a Property</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-sm uppercase tracking-widest mb-8 text-emerald-400"> Abuja Office</h5>
            <ul className="space-y-6 text-slate-400 font-bold text-sm">
              <li className="flex gap-3">
                <MapPin size={20} className="text-emerald-500 shrink-0" />
                <span>Suite 405, Transcorp Hilton Oladipo Diya St, Wuse, Abuja</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span>080 000 TRUST (87878)</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span>hello@trustrent.ng</span>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="bg-white/10 mb-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-sm font-bold">
          <p>© {new Date().getFullYear()} TrustRent NG. Built with ❤️ for Abuja.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/cookies" className="hover:text-slate-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
