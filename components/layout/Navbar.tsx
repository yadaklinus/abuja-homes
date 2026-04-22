'use client'

import React from 'react'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from '@heroui/react'
import { ShieldCheck, Search, Bell, Heart, MessageSquare, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const menuItems = [
    { label: "Browse Properties", href: "/properties" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ]

  const userRole = session?.user?.role
  const dashboardHref = userRole === 'ADMIN' ? '/admin' : userRole === 'LANDLORD' ? '/landlord/dashboard' : '/dashboard'

  return (
    <HeroUINavbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="xl" 
      className="bg-white/70 backdrop-blur-md border-b border-slate-100 h-20"
      position="sticky"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <p className="font-black text-2xl tracking-tighter text-slate-900">
              TrustRent<span className="text-emerald-500">.</span>
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link 
              href={item.href} 
              className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-emerald-600 ${
                pathname === item.href ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {status === 'authenticated' ? (
          <div className="flex items-center gap-4">
            <NavbarItem className="hidden lg:flex">
              <Badge content="5" color="danger" size="sm" shape="circle">
                <Button isIconOnly variant="light" radius="full">
                  <Bell size={20} className="text-slate-600" />
                </Button>
              </Badge>
            </NavbarItem>
            
            <Dropdown placement="bottom-end" className="p-0 border-none shadow-2xl">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-emerald-500"
                  color="primary"
                  name={session.user?.name || "User"}
                  size="sm"
                  src={session.user?.image}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat" className="p-2 w-64">
                <DropdownItem key="profile" className="h-14 gap-2 opacity-100">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-medium text-slate-500">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem 
                  key="dashboard" 
                  startContent={<LayoutDashboard size={18} />}
                  className="rounded-xl h-12"
                  href={dashboardHref}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem 
                  key="messages" 
                  startContent={<MessageSquare size={18} />}
                  className="rounded-xl h-12"
                  href="/messages"
                >
                  Messages
                </DropdownItem>
                <DropdownItem 
                  key="favorites" 
                  startContent={<Heart size={18} />}
                  className="rounded-xl h-12"
                  href="/favorites"
                >
                  Favorites
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger" 
                  className="text-danger rounded-xl h-12"
                  startContent={<LogOut size={18} />}
                  onPress={() => signOut()}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 uppercase tracking-widest transition-colors">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                color="primary" 
                href="/auth/register" 
                variant="solid"
                className="bg-slate-900 text-white font-bold h-12 px-6 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
              >
                Join Now
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-white/95 backdrop-blur-lg pt-8 px-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              className="w-full text-3xl font-black text-slate-900 py-4 block hover:text-emerald-600 transition-colors"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {status === 'authenticated' && (
           <NavbarMenuItem>
           <Link
             className="w-full text-3xl font-black text-emerald-600 py-4 block"
             href={dashboardHref}
             onClick={() => setIsMenuOpen(false)}
           >
             Go to Dashboard
           </Link>
         </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  )
}
