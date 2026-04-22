'use client'

import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Card, CardBody } from '@heroui/react'
import { Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BookingModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  propertyTitle: string
  propertyPrice: number
}

export default function BookingModal({ isOpen, onOpenChange, propertyTitle, propertyPrice }: BookingModalProps) {
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSuccess(true)
    toast.success('Inspection scheduled successfully!')
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setTimeout(() => setIsSuccess(false), 300)
      }}
      size="xl"
      className="bg-white rounded-[2.5rem]"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="p-4 sm:p-8">
        {(onClose) => (
          <>
            {isSuccess ? (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Request Sent!</h2>
                <p className="text-slate-500 font-medium max-w-sm mb-12">
                   The landlord has been notified. You'll receive a confirmation message in your dashboard soon.
                </p>
                <Button color="primary" onPress={onClose} className="h-16 px-12 bg-slate-900 rounded-2xl font-black text-lg">
                  Back to Property
                </Button>
              </div>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1 p-0 mb-8 items-start">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Schedule Inspection</h2>
                  <p className="text-slate-500 font-medium">Verify the property in person before paying.</p>
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                  <ModalBody className="p-0 space-y-8">
                    <Card className="bg-slate-50 border-none shadow-none rounded-[1.5rem]">
                       <CardBody className="p-6">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Property</p>
                          <h4 className="text-lg font-black text-slate-900 mb-1">{propertyTitle}</h4>
                          <p className="text-emerald-600 font-black">₦{propertyPrice.toLocaleString()} /year</p>
                       </CardBody>
                    </Card>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Preferred Date"
                        type="date"
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<Calendar className="text-slate-400" size={18} />}
                        classNames={{ label: "font-bold text-slate-700", inputWrapper: "h-14 rounded-2xl border-slate-200" }}
                        isRequired
                      />
                      <Input
                        label="Preferred Time"
                        type="time"
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<Clock className="text-slate-400" size={18} />}
                        classNames={{ label: "font-bold text-slate-700", inputWrapper: "h-14 rounded-2xl border-slate-200" }}
                        isRequired
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Full Name"
                        placeholder="John Doe"
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<User className="text-slate-400" size={18} />}
                        classNames={{ label: "font-bold text-slate-700", inputWrapper: "h-14 rounded-2xl border-slate-200" }}
                        isRequired
                      />
                      <Input
                        label="Phone Number"
                        placeholder="08012345678"
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<Phone className="text-slate-400" size={18} />}
                        classNames={{ label: "font-bold text-slate-700", inputWrapper: "h-14 rounded-2xl border-slate-200" }}
                        isRequired
                      />
                    </div>

                    <Textarea
                      label="Additional Notes"
                      placeholder="Any specific questions or requests?"
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{ label: "font-bold text-slate-700", inputWrapper: "rounded-2xl border-slate-200 p-4" }}
                    />
                  </ModalBody>
                  <ModalFooter className="p-0 mt-12 bg-transparent">
                    <Button variant="light" onPress={onClose} className="h-14 px-8 font-black text-slate-500">
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      color="primary" 
                      className="flex-1 h-16 bg-slate-900 rounded-[1.5rem] font-black text-lg active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                      isLoading={isLoading}
                    >
                      Confirm Schedule
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
