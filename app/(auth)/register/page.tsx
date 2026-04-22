'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, Card, CardBody, Divider, Checkbox } from '@heroui/react'
import { Mail, Lock, User, Phone, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function RegisterPage() {
  const [step, setStep] = React.useState(1)
  const [role, setRole] = React.useState<'TENANT' | 'LANDLORD' | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (step === 1 && !role) {
      toast.error('Please select an account type')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      displayName: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      role: role
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (response.ok) {
        toast.success('Registration successful! Please check your email for verification.')
        router.push('/login')
      } else {
        toast.error(resData.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Branding / Benefits */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <ShieldCheck size={32} className="text-emerald-400" />
            <span className="text-2xl font-black tracking-tighter">TrustRent NG</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl font-black tracking-tighter leading-[0.95] mb-8">
              Join Nigeria's <br />
              <span className="text-emerald-400">Safest Rental Space.</span>
            </h1>
            <p className="text-xl text-emerald-100 font-medium max-w-md leading-relaxed opacity-80">
              Create an account to start browsing verified properties or list your own properties for thousands of potential tenants.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <p className="font-bold text-emerald-50">NIN Verified Landlords</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <p className="font-bold text-emerald-50">Escrow Protected Payments</p>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form Wizard */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50 overflow-y-auto">
        <motion.div
          layout
          className="w-full max-w-xl"
        >
          <Card className="shadow-2xl shadow-emerald-200/20 border-none rounded-[2rem]">
            <CardBody className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10 text-center lg:text-left">
                      <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Create Account</h2>
                      <p className="text-slate-500 font-medium">Select how you want to use TrustRent NG.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                      <button
                        type="button"
                        onClick={() => setRole('TENANT')}
                        className={`p-6 rounded-[2rem] border-3 transition-all text-left flex flex-col justify-between h-56 ${
                          role === 'TENANT' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          role === 'TENANT' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <User size={24} />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 mb-1">I'm a Renter</p>
                          <p className="text-sm font-bold text-slate-500">I want to find a verified home in Abuja.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('LANDLORD')}
                        className={`p-6 rounded-[2rem] border-3 transition-all text-left flex flex-col justify-between h-56 ${
                          role === 'LANDLORD' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          role === 'LANDLORD' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 mb-1">I'm a Landlord</p>
                          <p className="text-sm font-bold text-slate-500">I want to list my property and find tenants.</p>
                        </div>
                      </button>
                    </div>

                    <Button
                      onClick={handleNext}
                      color="primary"
                      size="lg"
                      className="w-full h-16 bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      Continue <ArrowRight size={20} />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-10 lg:text-left flex items-center gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <ArrowLeft size={20} className="text-slate-900" />
                      </button>
                      <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-1">Your Details</h2>
                        <p className="text-slate-500 font-medium">Complete your {role?.toLowerCase()} profile.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          name="name"
                          variant="bordered"
                          classNames={{
                            label: "font-bold text-slate-700",
                            inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-emerald-500 transition-all"
                          }}
                          isRequired
                        />
                        <Input
                          label="Phone Number"
                          name="phone"
                          variant="bordered"
                          classNames={{
                            label: "font-bold text-slate-700",
                            inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-emerald-500 transition-all"
                          }}
                          isRequired
                        />
                      </div>

                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        variant="bordered"
                        classNames={{
                          label: "font-bold text-slate-700",
                          inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-emerald-500 transition-all"
                        }}
                        isRequired
                      />

                      <div className="grid sm:grid-cols-2 gap-6">
                        <Input
                          label="Password"
                          name="password"
                          type="password"
                          variant="bordered"
                          classNames={{
                            label: "font-bold text-slate-700",
                            inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-emerald-500 transition-all"
                          }}
                          isRequired
                        />
                        <Input
                          label="Confirm Password"
                          name="confirmPassword"
                          type="password"
                          variant="bordered"
                          classNames={{
                            label: "font-bold text-slate-700",
                            inputWrapper: "h-14 rounded-2xl border-slate-200 hover:border-slate-300 focus-within:!border-emerald-500 transition-all"
                          }}
                          isRequired
                        />
                      </div>

                      <div className="pt-2">
                        <Checkbox
                          size="sm"
                          classNames={{ label: "text-sm font-bold text-slate-600" }}
                          isRequired
                        >
                          I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
                        </Checkbox>
                      </div>

                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        className="w-full h-16 bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-900/10 active:scale-[0.98] transition-all"
                        isLoading={isLoading}
                      >
                        Create Account
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-10">
                <div className="relative mb-8">
                  <Divider className="opacity-50" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    ALREADY HAVE AN ACCOUNT?
                  </span>
                </div>

                <p className="text-center text-slate-500 font-medium">
                  <Link href="/login">
                    <span className="text-emerald-600 font-black hover:underline underline-offset-4">Sign In Instead</span>
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
