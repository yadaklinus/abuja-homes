import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { PropertyUpdateSchema } from "@/lib/validations/property"

// GET: Fetch a single property
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        amenities: true,
        landlord: {
          select: {
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                phone: true,
                responseTimeHours: true,
                responseRate: true
              }
            }
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Property GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Update property
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await req.json()
    const parsed = PropertyUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.format() }, { status: 400 })
    }

    const property = await prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    // Check permissions: Owner or Admin
    if (property.landlordId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = parsed.data

    // Update the property
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        district: data.district,
        estate: data.estate,
        street: data.street,
        price: data.price,
        serviceCharge: data.serviceCharge,
        cautionFee: data.cautionFee,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        isFurnished: data.isFurnished,
        isNewlyBuilt: data.isNewlyBuilt,
        availableFrom: data.availableFrom,
        // Handling nested updates for images if provided
        ...(data.images && {
          images: {
            deleteMany: {}, // Simplest way: replace all images
            create: data.images.map(img => ({
              url: img.url,
              publicId: img.publicId,
              isCover: img.isCover,
              order: img.order
            }))
          }
        }),
        // Handling amenities if provided as string array in schema
        // Note: schema says amenities is z.array(z.string())
        // In prisma, it's PropertyAmenity[]
        ...(data.amenities && {
           amenities: {
             deleteMany: {},
             create: data.amenities.map(name => ({ name }))
           }
        })
      }
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error("Property PATCH error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE: Delete property
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const property = await prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    // Check permissions: Owner or Admin
    if (property.landlordId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Property DELETE error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}