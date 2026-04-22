import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { PropertyCreateSchema } from "@/lib/validations/property"

// GET: Fetch properties with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Filters
    const district = searchParams.get("district")
    const type = searchParams.get("type")
    const minPrice = Number(searchParams.get("minPrice")) || 0
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000000
    const bedrooms = searchParams.get("bedrooms")
    const isVerified = searchParams.get("isVerified") === "true"
    const landlordId = searchParams.get("landlordId")
    const search = searchParams.get("search")

    const where: any = {
      price: { gte: minPrice, lte: maxPrice },
    }

    // If landlordId is provided, filter by it (usually for the landlord dashboard)
    // If not, only show APPROVED properties (for the public)
    if (landlordId) {
      where.landlordId = landlordId
    } else {
      where.status = "APPROVED"
    }

    if (district) where.district = district
    if (type) where.type = type
    if (isVerified) where.isVerified = true
    if (bedrooms && bedrooms !== "ANY") {
      if (bedrooms === "4+") {
        where.bedrooms = { gte: 4 }
      } else {
        where.bedrooms = Number(bedrooms)
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { street: { contains: search, mode: "insensitive" } },
        { estate: { contains: search, mode: "insensitive" } },
      ]
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: { where: { isCover: true }, take: 1 },
        landlord: {
          select: { profile: { select: { displayName: true, avatarUrl: true } } }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Property GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST: Create property (Landlord only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== "LANDLORD" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = PropertyCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.format() }, { status: 400 })
    }

    const data = parsed.data

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") + `-${Math.random().toString(36).substring(2, 7)}`

    // Construct full address
    const fullAddress = `${data.street}, ${data.estate}, ${data.district}, Abuja`

    const property = await prisma.property.create({
      data: {
        landlordId: session.user.id,
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        district: data.district,
        estate: data.estate,
        street: data.street,
        fullAddress,
        price: data.price,
        serviceCharge: data.serviceCharge,
        cautionFee: data.cautionFee,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        isFurnished: data.isFurnished,
        isNewlyBuilt: data.isNewlyBuilt,
        availableFrom: data.availableFrom,
        amenities: {
          create: data.amenities.map(name => ({
            name: name,
          }))
        },
        status: "PENDING_REVIEW", // All new listings must be approved by admin
        images: {
          create: data.images.map(img => ({
            url: img.url,
            publicId: img.publicId,
            isCover: img.isCover,
            order: img.order
          }))
        }
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Property POST error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
