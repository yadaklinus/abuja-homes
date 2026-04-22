import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { RegisterSchema } from "@/lib/validations/auth"
import { sendEmail, templates } from "@/lib/email"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.format() }, { status: 400 })
    }

    const { email, password, displayName, phone, role } = parsed.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
        }
      })

      await tx.profile.create({
        data: {
          userId: newUser.id,
          displayName,
          phone,
        }
      })

      return newUser
    })

    // Create verification token
    const token = nanoid(32)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      }
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`
    await sendEmail(email, "Verify your TrustRent NG account", templates.verifyEmail(displayName, verificationUrl))

    return NextResponse.json({ message: "User registered successfully. Please verify your email." }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
