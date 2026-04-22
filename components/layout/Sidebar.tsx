'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Search, Heart, MessageSquare, 
  Calendar, CreditCard, User, LogOut, ShieldCheck, 
  ChevronLeft, BarChart3, Home, Settings, Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, Button, ScrollShadow, Divider } from '@heroui/react'

interface SidebarProps {
  role: 'TENANT' | 'LANDLORD' | 'ADMIN'
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const tenantLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse', href: '/properties', icon: Search },
    { label: 'Favorites', href: '/favorites', icon: Heart },
    { label: 'Bookings', href: '/bookings', icon: Calendar },
    { label: 'Payments', href: '/payments', icon: CreditCard },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
  ]

  const landlordLinks = [
    { label: 'Overview', href: '/landlord/dashboard', icon: BarChart3 },
    { label: 'My Listings', href: '/landlord/properties', icon: Home },
    { label: 'Tenants', href: '/landlord/tenants', icon: Users },
    { label: 'Revenue', href: '/landlord/revenue', icon: CreditCard },
    { label: 'Messages', href: '/landlord/messages', icon: MessageSquare },
    { label: 'Profile', href: '/landlord/profile', icon: User },
  ]

  const adminLinks = [
    { label: 'Admin Panel', href: '/admin', icon: LayoutDashboard },
    { label: 'Moderation', href: '/admin/moderation', icon: ShieldCheck },
    { label: 'Users', href: '/admin/users', icon: User },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'LANDLORD' ? landlordLinks : tenantLinks

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen sticky top-0 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-50 shrink-0"
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 justify-between overflow-hidden">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <ShieldCheck size={24} className="text-white" />
          </div>
          {!isCollapsed && (
             <span className="font-black text-xl tracking-tighter text-white">TrustRent.</span>
          )}
        </Link>
        <Button 
          isIconOnly 
          variant="light" 
          className="text-slate-400 hover:text-white hidden lg:flex"
          onPress={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Navigation Links */}
      <ScrollShadow className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-4 h-14 px-4 rounded-2xl transition-all group overflow-hidden whitespace-nowrap ${
                isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <link.icon size={22} className={`shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
              {!isCollapsed && <span className="font-bold text-sm tracking-wide">{link.label}</span>}
            </Link>
          )
        })}
      </ScrollShadow>

      {/* Sidebar Footer (User Profile) */}
      <div className="p-4 bg-slate-800/30">
        <div className={`flex items-center gap-4 p-2 rounded-2xl overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
           <Avatar 
             src="https://picsum.photos/100/100" 
             size="sm" 
             isBordered 
             className="ring-emerald-500 shrink-0"
           />
           {!isCollapsed && (
             <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">John Doe</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{role}</p>
             </div>
           )}
           {!isCollapsed && (
             <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-red-400" onPress={() => signOut()}>
                <LogOut size={16} />
             </Button>
           )}
        </div>
      </div>
    </motion.aside>
  )
}
