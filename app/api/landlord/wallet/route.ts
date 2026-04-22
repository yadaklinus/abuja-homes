import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const landlordId = session.user.id

    // Fetch all payments where this landlord is the recipient
    const payments = await prisma.payment.findMany({
      where: {
        recipientId: landlordId
      },
      include: {
        payer: {
          select: {
            profile: {
              select: { displayName: true, avatarUrl: true }
            }
          }
        },
        property: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Calculate total earnings
    const totalEarnings = payments
      .filter(p => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate pending earnings (in escrow)
    const pendingEarnings = payments
      .filter(p => p.status === "PENDING" || p.status === "PROCESSING")
      .reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      balance: totalEarnings,
      pending: pendingEarnings,
      transactions: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        type: p.type,
        date: p.createdAt,
        propertyTitle: p.property.title,
        payerName: p.payer.profile?.displayName || "Mufti User",
        payerAvatar: p.payer.profile?.avatarUrl,
        reference: p.transactionRef
      }))
    })
  } catch (error) {
    console.error("Landlord wallet GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
