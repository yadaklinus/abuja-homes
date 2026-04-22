import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyTransaction } from "@/lib/payments"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const transactionId = searchParams.get("transaction_id")
    const status = searchParams.get("status")
    const txRef = searchParams.get("tx_ref")

    if (!transactionId || status !== "successful") {
       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payments/failed?ref=${txRef}`)
    }

    // Verify with Flutterwave
    const verification = await verifyTransaction(transactionId)

    if (verification.status === "success" && verification.data.status === "successful") {
       // Update database
       const payment = await prisma.payment.update({
         where: { transactionRef: txRef || "" },
         data: { 
           status: "COMPLETED",
           flutterwaveTxId: transactionId,
           flutterwaveRef: verification.data.flw_ref,
         },
         include: { property: true }
       })

       // Business Logic based on payment type
        if (payment.type === "FIRST_RENT" || payment.type === "SECOND_RENT") {
          // Update property status to RENTED? Or keep as APPROVED but active escrow
          await prisma.property.update({
            where: { id: payment.propertyId },
            data: { status: "RENTED" }
          })
       }

       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payments/success?ref=${txRef}`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payments/failed?ref=${txRef}`)
  } catch (error) {
    console.error("Payment Callback Error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
