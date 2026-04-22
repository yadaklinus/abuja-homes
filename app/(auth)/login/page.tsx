'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Input, Button, Checkbox, Link as HeroUILink, Card, CardBody, Divider } from '@heroui/react'
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error || 'Invalid credentials')
      } else {
        toast.success('Signed in successfully!')
        router.refresh()
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Branding/Value Prop */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <ShieldCheck size={32} className="text-emerald-400" />
            <span className="text-2xl font-black tracking-tighter">TrustRent NG</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-black tracking-tighter leading-[0.95] mb-8">
              Verified Properties. <br />
              <span className="text-emerald-400">Zero Scams.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
              Sign in to your account to manage your rentals, bookings, and payments securely via our escrow system.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-12">
          <div>
            <p className="text-3xl font-black text-white">2,000+</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verified Tenants</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">500+</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Trusted Landlords</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl shadow-slate-200 border-none rounded-[2rem]">
            <CardBody className="p-8 sm:p-12">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500 font-medium">Enter your details to sign in.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="bordered"
                  startContent={<Mail className="text-slate-400" size={18} />}
                  classNames={{
                    label: "font-bold text-slate-700",
                    inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-blue-500 transition-all",
                  }}
                  isRequired
                />

                <Input
                  label="Password"
                  name="password"
                  variant="bordered"
                  startContent={<Lock className="text-slate-400" size={18} />}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <EyeOff className="text-slate-400" size={18} />
                      ) : (
                        <Eye className="text-slate-400" size={18} />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  classNames={{
                    label: "font-bold text-slate-700",
                    inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-blue-500 transition-all",
                  }}
                  isRequired
                />

                <div className="flex items-center justify-between">
                  <Checkbox
                    defaultSelected
                    size="sm"
                    classNames={{
                      label: "text-sm font-bold text-slate-600",
                      wrapper: "rounded-lg",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link href="/forgot-password">
                    <span className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot Password?
                    </span>
                  </Link>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-10">
                <div className="relative mb-8">
                  <Divider className="opacity-50" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    OR
                  </span>
                </div>

                <p className="text-center text-slate-500 font-medium">
                  Don't have an account?{" "}
                  <Link href="/register">
                    <span className="text-blue-600 font-black hover:underline underline-offset-4">Register Now</span>
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
