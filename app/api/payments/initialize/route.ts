import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { initializePayment } from "@/lib/payments"
import { PLATFORM } from "@/constants"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "TENANT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { propertyId, type } = await req.json()
    // type can be 'RENT' or 'INSPECTION_FEE'

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { landlord: true }
    })

    if (!property) return NextResponse.json({ message: "Property not found" }, { status: 404 })

    let amount = 0
    let platformFee = 0

    if (type === "RENT") {
      const rent = property.price
      const serviceCharge = property.serviceCharge || 0
      const cautionFee = property.cautionFee || 0
      platformFee = rent * PLATFORM.TENANT_COMMISSION
      amount = rent + serviceCharge + cautionFee + platformFee
    } else if (type === "INSPECTION_FEE") {
      amount = PLATFORM.INSPECTION_FEE
    }

    const txRef = `TR-${type}-${nanoid(10)}`

    const paymentSession = await initializePayment({
      amount,
      email: session.user.email!,
      tx_ref: txRef,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      customer_name: session.user.name || "User",
      meta: {
        userId: session.user.id!,
        propertyId: property.id,
        type,
      }
    })

    if (paymentSession.status === "success") {
       // Create initial transaction record
       await prisma.payment.create({
         data: {
           payerId: session.user.id!,
           recipientId: property.landlordId,
           propertyId: property.id,
           amount,
           platformFee,
           type: type === "RENT" ? "FIRST_RENT" : "INSPECTION_FEE",
           status: "PENDING",
           transactionRef: txRef,
         }
       })

       return NextResponse.json({ url: paymentSession.data.link })
    }

    return NextResponse.json({ message: "Payment initialization failed" }, { status: 400 })
  } catch (error) {
    console.error("Payment Init Error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
