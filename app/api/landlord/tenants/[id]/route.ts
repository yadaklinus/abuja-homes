import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const landlordId = session.user.id
    const { id: tenantId } = await params

    // Fetch tenant profile
    const tenant = await prisma.user.findUnique({
      where: { id: tenantId },
      include: {
        profile: true
      }
    })

    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    // Fetch all bookings for this tenant relating to this landlord's properties
    const bookings = await prisma.booking.findMany({
      where: {
        tenantId,
        property: {
          landlordId
        }
      },
      select: {
        id: true,
        scheduledDate: true,
        status: true,
        notes: true,
        property: {
          select: {
            id: true,
            title: true,
            type: true,
            district: true,
            price: true,
            images: {
              where: { isCover: true },
              take: 1,
              select: {
                url: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledDate: "desc"
      }
    })

    // Fetch payments from this tenant to this landlord
    const payments = await prisma.payment.findMany({
      where: {
        payerId: tenantId,
        recipientId: landlordId,
        status: "COMPLETED"
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        type: true,
        transactionRef: true,
        property: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Calculate stats
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalBookings = bookings.length
    const activeBookings = bookings.filter(b => b.status === "CONFIRMED").length

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        email: tenant.email,
        name: tenant.profile?.displayName || "Mufti User",
        avatar: tenant.profile?.avatarUrl,
        phone: tenant.profile?.phone,
        verificationStatus: tenant.profile?.verificationStatus,
        createdAt: tenant.createdAt,
        bio: tenant.profile?.bio,
        whatsapp: tenant.profile?.whatsappNumber
      },
      stats: {
        totalPaid,
        totalBookings,
        activeBookings
      },
      bookings: (bookings as any[]).map(b => ({
        id: b.id,
        propertyTitle: b.property?.title,
        propertyType: b.property?.type,
        district: b.property?.district,
        price: b.property?.price,
        coverImage: b.property?.images?.[0]?.url,
        scheduledDate: b.scheduledDate,
        status: b.status,
        notes: b.notes
      })),
      payments: (payments as any[]).map(p => ({
        id: p.id,
        amount: p.amount,
        date: p.createdAt,
        propertyTitle: p.property?.title,
        type: p.type,
        reference: p.transactionRef
      }))
    })
  } catch (error) {
    console.error("Landlord tenant detail GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
