import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { startOfMonth, endOfMonth } from "date-fns"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const landlordId = session.user.id
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // 1. Basic Counts
    const totalProperties = await prisma.property.count({
      where: { landlordId }
    })

    const rentedProperties = await prisma.property.count({
      where: { landlordId, status: "RENTED" }
    })

    const pendingBookings = await prisma.booking.count({
      where: { 
        property: { landlordId },
        status: "PENDING" 
      }
    })

    // 2. Earnings (Current Month)
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        recipientId: landlordId,
        status: "COMPLETED",
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      },
      select: { amount: true }
    })

    const monthlyEarnings = monthlyPayments.reduce((sum, p) => sum + p.amount, 0)

    // 3. Upcoming Inspections
    const upcomingInspections = await prisma.booking.findMany({
      where: {
        property: { landlordId },
        scheduledDate: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] }
      },
      include: {
        property: {
          include: {
            images: { where: { isCover: true }, take: 1 }
          }
        },
        tenant: {
          select: {
            profile: {
              select: { displayName: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { scheduledDate: "asc" },
      take: 5
    })

    // 4. Top Performing Properties (by views)
    const topProperties = await prisma.property.findMany({
      where: { landlordId },
      orderBy: { views: "desc" },
      take: 3,
      select: {
        title: true,
        views: true,
        inquiries: true
      }
    })

    // 5. Calculate Occupancy Rate
    const occupancyRate = totalProperties > 0 
      ? Math.round((rentedProperties / totalProperties) * 100) 
      : 0

    return NextResponse.json({
      stats: {
        totalProperties,
        rentedProperties,
        occupancyRate,
        monthlyEarnings,
        pendingBookings
      },
      upcomingInspections,
      topProperties,
      user: {
        name: session.user.name,
        image: session.user.image,
        isVerified: true // This would ideally come from the profile NIN/BVN status
      }
    })

  } catch (error) {
    console.error("Landlord stats GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
