import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"

// GET: Fetch conversations/messages
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get("conversationId")

    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: { sender: { select: { email: true, profile: { select: { avatarUrl: true, displayName: true } } } } },
        orderBy: { createdAt: "asc" }
      })
      return NextResponse.json(messages)
    }

    // Fetch all conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { tenantId: session.user.id! },
          { landlordId: session.user.id! }
        ]
      },
      include: {
        property: { select: { title: true } },
        tenant: { select: { email: true, profile: { select: { avatarUrl: true, displayName: true } } } },
        landlord: { select: { email: true, profile: { select: { avatarUrl: true, displayName: true } } } },
        messages: { take: 1, orderBy: { createdAt: "desc" } }
      }
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Messaging GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST: Send a message
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { conversationId, content, propertyId, recipientId } = await req.json()

    let activeConversationId = conversationId

    // If no conversationId, check if one exists or create it
    if (!activeConversationId) {
      const existing = await prisma.conversation.findFirst({
        where: {
          propertyId,
          OR: [
            { tenantId: session.user.id!, landlordId: recipientId },
            { tenantId: recipientId, landlordId: session.user.id! }
          ]
        }
      })

      if (existing) {
        activeConversationId = existing.id
      } else {
        const created = await prisma.conversation.create({
          data: {
            propertyId,
            tenantId: session.user.role === "TENANT" ? session.user.id! : recipientId,
            landlordId: session.user.role === "LANDLORD" ? session.user.id! : recipientId,
          }
        })
        activeConversationId = created.id
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        senderId: session.user.id!,
        content,
      },
      include: { sender: { select: { email: true, profile: { select: { avatarUrl: true, displayName: true } } } } }
    })

    // Trigger real-time event
    await pusherServer.trigger(`chat-${activeConversationId}`, 'new-message', message)

    return NextResponse.json(message)
  } catch (error) {
    console.error("Messaging POST error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
