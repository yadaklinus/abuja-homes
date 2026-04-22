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

    // Find all bookings for this landlord's properties
    // We want to get unique tenants
    const bookings = await prisma.booking.findMany({
      where: {
        property: { landlordId }
      },
      include: {
        tenant: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                phone: true,
                verificationStatus: true
              }
            }
          }
        },
        property: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Group by tenant to get unique list with their latest booking info
    const tenantMap = new Map()
    bookings.forEach(booking => {
      if (!tenantMap.has(booking.tenantId)) {
        tenantMap.set(booking.tenantId, {
          id: booking.tenantId,
          email: booking.tenant.email,
          name: booking.tenant.profile?.displayName || "Mufti User",
          avatar: booking.tenant.profile?.avatarUrl,
          phone: booking.tenant.profile?.phone,
          verificationStatus: booking.tenant.profile?.verificationStatus,
          lastBooking: {
            id: booking.id,
            propertyTitle: booking.property.title,
            date: booking.scheduledDate,
            status: booking.status
          },
          totalBookings: 0
        })
      }
      tenantMap.get(booking.tenantId).totalBookings += 1
    })

    const tenants = Array.from(tenantMap.values())

    return NextResponse.json(tenants)
  } catch (error) {
    console.error("Landlord tenants GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
