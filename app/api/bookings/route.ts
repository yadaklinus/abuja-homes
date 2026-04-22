import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { BookingCreateSchema } from "@/lib/validations/booking"
import { sendEmail, templates } from "@/lib/email"

// GET: Fetch bookings for current user
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id! }
    })

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    let bookings: any[] = []

    if (user.role === "TENANT") {
      bookings = await prisma.booking.findMany({
        where: { tenantId: user.id },
        include: { property: { include: { images: { where: { isCover: true }, take: 1 } } } },
        orderBy: { scheduledDate: "desc" }
      })
    } else if (user.role === "LANDLORD") {
      bookings = await prisma.booking.findMany({
        where: { property: { landlordId: user.id } },
        include: {
          property: true,
          tenant: { select: { profile: { select: { displayName: true, phone: true } } } }
        },
        orderBy: { scheduledDate: "desc" }
      })
    } else if (user.role === "ADMIN") {
      bookings = await prisma.booking.findMany({
        include: { property: true, tenant: true },
        orderBy: { createdAt: "desc" },
        take: 100
      })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Booking GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST: Create booking (Tenant only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "TENANT") {
      return NextResponse.json({ message: "Only tenants can book inspections" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = BookingCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.format() }, { status: 400 })
    }

    const data = parsed.data

    // Find the property and its landlord
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: { landlord: { include: { profile: true } } }
    })

    if (!property) return NextResponse.json({ message: "Property not found" }, { status: 404 })

    const booking = await prisma.booking.create({
      data: {
        tenantId: session.user.id!,
        landlordId: property.landlordId,
        propertyId: data.propertyId,
        tenantName: data.tenantName,
        tenantPhone: data.tenantPhone,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        status: "PENDING",
        notes: data.notes,
      }
    })

    // Notify landlord via email
    if (property.landlord.email && property.landlord.profile) {
      await sendEmail(
        property.landlord.email,
        `New Inspection Request: ${property.title}`,
        templates.bookingRequest(
          property.landlord.profile.displayName,
          session.user.name || "A Tenant",
          property.title,
          data.scheduledDate.toLocaleDateString()
        )
      )
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Booking POST error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Update booking status (Landlord or Admin)
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { bookingId, status } = await req.json()
    if (!["APPROVED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true }
    })

    if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 })

    // Check permissions: Landlord must own the property or user is Admin
    if (booking.property.landlordId !== session.user.id! && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Booking PATCH error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
