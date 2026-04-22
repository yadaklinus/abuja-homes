# TrustRent NG — Next.js Full-Stack Architecture
## Part 1: Project Overview & Prisma Schema

---

## 1. PROJECT OVERVIEW

**TrustRent NG** is a verified property rental marketplace built exclusively for Abuja, Nigeria.  
It connects verified landlords with tenants through a trust-first platform featuring escrow payments via Flutterwave, in-app messaging with fraud detection, virtual property tours, and a full admin moderation layer.

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 (Auth.js) |
| Styling | Tailwind CSS + shadcn/ui |
| Payments | Flutterwave |
| Real-time | Pusher (messages) |
| File Storage | Cloudinary (property images) |
| Email | Resend |
| Validation | Zod |
| State Management | Zustand + React Query (TanStack) |
| Deployment | Vercel + Supabase PostgreSQL |

---

## 2. PRISMA SCHEMA

**File:** `prisma/schema.prisma`

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum UserRole {
  TENANT
  LANDLORD
  ADMIN
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum PropertyStatus {
  DRAFT
  PENDING_REVIEW
  AVAILABLE
  UNDER_INSPECTION
  RENTED
  ARCHIVED
}

enum PropertyType {
  SELF_CONTAIN
  ONE_BEDROOM
  TWO_BEDROOM
  THREE_BEDROOM
  DUPLEX
  BUNGALOW
  MINI_FLAT
  PENTHOUSE
}

enum AbujaDistrict {
  MAITAMA
  ASOKORO
  WUSE
  WUSE_2
  GWARINPA
  KUBWA
  LUGBE
  LOKOGOMA
  UTAKO
  JAHI
  KARMO
  GARKI
  APO
  LIFE_CAMP
  DURUMI
  GUDU
  KADO
  KATAMPE
  MABUSHI
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum MessageType {
  TEXT
  SYSTEM
  PAYMENT_NOTIFICATION
  DOCUMENT
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  DISPUTED
}

enum PaymentType {
  INSPECTION_FEE
  FIRST_RENT
  SECOND_RENT
  LISTING_FEE
  PLATFORM_COMMISSION
  REFUND
}

enum NotificationType {
  BOOKING_REQUEST
  BOOKING_CONFIRMED
  BOOKING_CANCELLED
  MESSAGE_RECEIVED
  PAYMENT_RECEIVED
  PAYMENT_FAILED
  PROPERTY_APPROVED
  PROPERTY_REJECTED
  ACCOUNT_VERIFIED
  ACCOUNT_SUSPENDED
  SYSTEM_ALERT
  NEW_REVIEW
}

enum FlagSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// ─────────────────────────────────────────────
// CORE MODELS
// ─────────────────────────────────────────────

/// Core user account — one per person regardless of role
model User {
  id                String             @id @default(cuid())
  email             String             @unique
  emailVerified     DateTime?
  passwordHash      String?
  role              UserRole           @default(TENANT)
  isActive          Boolean            @default(true)
  isSuspended       Boolean            @default(false)
  suspendedAt       DateTime?
  suspensionReason  String?
  suspendedBy       String?            // Admin user ID
  lastLoginAt       DateTime?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  // Relations
  profile           Profile?
  properties        Property[]         @relation("LandlordProperties")
  tenantBookings    Booking[]          @relation("TenantBookings")
  landlordBookings  Booking[]          @relation("LandlordBookings")
  sentMessages      Message[]          @relation("SentMessages")
  tenantConversations  Conversation[]  @relation("TenantConversations")
  landlordConversations Conversation[] @relation("LandlordConversations")
  payerPayments     Payment[]          @relation("PayerPayments")
  recipientPayments Payment[]          @relation("RecipientPayments")
  reviews           Review[]           @relation("TenantReviews")
  receivedReviews   Review[]           @relation("LandlordReviews")
  favorites         Favorite[]
  notifications     Notification[]
  flaggedReports    FlaggedContent[]   @relation("ReportedByUser")
  flaggedContent    FlaggedContent[]   @relation("FlaggedUser")
  sessions          Session[]
  auditLogs         AuditLog[]         @relation("ActorLogs")

  @@index([email])
  @@index([role])
  @@index([isSuspended])
  @@map("users")
}

/// Extended profile information for users
model Profile {
  id                String             @id @default(cuid())
  userId            String             @unique
  displayName       String
  phone             String?
  whatsappNumber    String?
  bio               String?
  avatarUrl         String?
  nin               String?            // National ID Number (hashed)
  ninVerified       Boolean            @default(false)
  bvn               String?            // Bank Verification Number (hashed)
  bvnVerified       Boolean            @default(false)
  verificationStatus VerificationStatus @default(PENDING)
  verificationDocs  String[]           // Array of Cloudinary URLs
  verifiedAt        DateTime?
  verifiedBy        String?            // Admin user ID
  loyaltyPoints     Int                @default(0)
  totalTransactions Int                @default(0)
  responseRate      Float?             // For landlords (0–100%)
  responseTimeHours Float?             // Average response time in hours
  address           String?
  stateOfOrigin     String?
  occupation        String?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([verificationStatus])
  @@map("profiles")
}

/// NextAuth sessions table
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

/// NextAuth verification tokens (email confirm, password reset)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  type       String   @default("email_verification") // email_verification | password_reset

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─────────────────────────────────────────────
// PROPERTY MODELS
// ─────────────────────────────────────────────

/// A property listing created by a landlord
model Property {
  id                String          @id @default(cuid())
  landlordId        String
  title             String
  slug              String          @unique
  description       String
  type              PropertyType
  status            PropertyStatus  @default(DRAFT)
  district          AbujaDistrict
  estate            String
  street            String
  fullAddress       String
  latitude          Float?
  longitude         Float?
  price             Int             // Annual rent in NGN (kobo-safe, no decimals)
  serviceCharge     Int             @default(0)
  cautionFee        Int             @default(0) // refundable deposit
  agencyFee         Int             @default(0)
  bedrooms          Int
  bathrooms         Int
  toilets           Int             @default(0)
  sittingRooms      Int             @default(1)
  totalFloors       Int             @default(1)
  floorNumber       Int             @default(0)
  parkingSpaces     Int             @default(0)
  isFurnished       Boolean         @default(false)
  isNewlyBuilt      Boolean         @default(false)
  isVerified        Boolean         @default(false)
  isFeatured        Boolean         @default(false)
  verifiedAt        DateTime?
  verifiedBy        String?
  availableFrom     DateTime?
  yearBuilt         Int?
  leaseDuration     Int             @default(12) // months
  views             Int             @default(0)
  inquiries         Int             @default(0)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  publishedAt       DateTime?
  rejectionReason   String?

  // Relations
  landlord          User            @relation("LandlordProperties", fields: [landlordId], references: [id], onDelete: Cascade)
  images            PropertyImage[]
  amenities         PropertyAmenity[]
  virtualTourScenes VirtualTourScene[]
  bookings          Booking[]
  conversations     Conversation[]
  payments          Payment[]
  reviews           Review[]
  favorites         Favorite[]

  @@index([landlordId])
  @@index([district])
  @@index([status])
  @@index([type])
  @@index([price])
  @@index([isVerified])
  @@index([isFeatured])
  @@index([slug])
  @@map("properties")
}

/// Property images (stored on Cloudinary)
model PropertyImage {
  id          String   @id @default(cuid())
  propertyId  String
  url         String
  publicId    String   // Cloudinary public_id for deletion
  altText     String?
  caption     String?
  isThumbnail Boolean  @default(false)
  isCover     Boolean  @default(false)
  order       Int      @default(0)
  width       Int?
  height      Int?
  createdAt   DateTime @default(now())

  property    Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@index([propertyId])
  @@map("property_images")
}

/// Property amenities (many per property)
model PropertyAmenity {
  id         String   @id @default(cuid())
  propertyId String
  name       String   // "24/7 Power", "Swimming Pool", etc.
  icon       String?  // lucide-react icon name
  category   String?  // "security", "utilities", "recreation", etc.

  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@index([propertyId])
  @@map("property_amenities")
}

/// 360° virtual tour scenes (panoramic images)
model VirtualTourScene {
  id           String          @id @default(cuid())
  propertyId   String
  name         String          // "Living Room", "Master Bedroom", etc.
  panoramaUrl  String          // Cloudinary URL — equirectangular image
  order        Int             @default(0)
  createdAt    DateTime        @default(now())

  property     Property        @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  hotspots     TourHotspot[]

  @@index([propertyId])
  @@map("virtual_tour_scenes")
}

/// Clickable hotspots inside a virtual tour scene
model TourHotspot {
  id          String           @id @default(cuid())
  sceneId     String
  label       String
  description String?
  positionX   Float
  positionY   Float
  positionZ   Float
  linkSceneId String?          // Navigate to another scene

  scene       VirtualTourScene @relation(fields: [sceneId], references: [id], onDelete: Cascade)

  @@index([sceneId])
  @@map("tour_hotspots")
}

// ─────────────────────────────────────────────
// BOOKING / INSPECTION
// ─────────────────────────────────────────────

/// Inspection booking made by a tenant
model Booking {
  id              String        @id @default(cuid())
  tenantId        String
  landlordId      String
  propertyId      String
  scheduledDate   DateTime
  scheduledTime   String        // "10:00 AM"
  status          BookingStatus @default(PENDING)
  tenantName      String
  tenantPhone     String
  notes           String?
  landlordNotes   String?
  cancelledBy     String?
  cancellationReason String?
  completedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  tenant          User          @relation("TenantBookings", fields: [tenantId], references: [id])
  landlord        User          @relation("LandlordBookings", fields: [landlordId], references: [id])
  property        Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([landlordId])
  @@index([propertyId])
  @@index([status])
  @@index([scheduledDate])
  @@map("bookings")
}

// ─────────────────────────────────────────────
// MESSAGING
// ─────────────────────────────────────────────

/// A conversation thread between a tenant and a landlord about a property
model Conversation {
  id               String    @id @default(cuid())
  propertyId       String
  tenantId         String
  landlordId       String
  contactRevealed  Boolean   @default(false)
  contactRevealedAt DateTime?
  isFlagged        Boolean   @default(false)
  flagReason       String?
  isArchived       Boolean   @default(false)
  lastMessageAt    DateTime?
  lastMessageText  String?
  unreadTenant     Int       @default(0)
  unreadLandlord   Int       @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  property         Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  tenant           User      @relation("TenantConversations", fields: [tenantId], references: [id])
  landlord         User      @relation("LandlordConversations", fields: [landlordId], references: [id])
  messages         Message[]
  payments         Payment[]

  @@unique([propertyId, tenantId, landlordId])
  @@index([tenantId])
  @@index([landlordId])
  @@index([propertyId])
  @@index([isFlagged])
  @@map("conversations")
}

/// Individual messages in a conversation
model Message {
  id             String      @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  type           MessageType @default(TEXT)
  isFlagged      Boolean     @default(false)
  flagReason     String?
  isRead         Boolean     @default(false)
  readAt         DateTime?
  editedAt       DateTime?
  deletedAt      DateTime?   // Soft delete
  metadata       Json?       // Extra data for system messages (payment refs, etc.)
  createdAt      DateTime    @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])

  @@index([conversationId, createdAt])
  @@index([senderId])
  @@index([isFlagged])
  @@map("messages")
}

// ─────────────────────────────────────────────
// PAYMENTS (FLUTTERWAVE ESCROW)
// ─────────────────────────────────────────────

/// Payment record for all platform transactions
model Payment {
  id                String        @id @default(cuid())
  payerId           String
  recipientId       String
  propertyId        String
  conversationId    String?
  bookingId         String?
  type              PaymentType
  status            PaymentStatus @default(PENDING)
  amount            Int           // in NGN (no decimals)
  platformFee       Int           @default(0)
  flutterwaveRef    String?       // FLW reference from Flutterwave
  flutterwaveTxId   String?       // Transaction ID from webhook
  transactionRef    String        @unique // our internal reference
  callbackUrl       String?
  metadata          Json?         // Extra data (customer info, etc.)
  description       String?
  failureReason     String?
  verifiedAt        DateTime?
  refundedAt        DateTime?
  refundAmount      Int?
  refundReason      String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  payer             User          @relation("PayerPayments", fields: [payerId], references: [id])
  recipient         User          @relation("RecipientPayments", fields: [recipientId], references: [id])
  property          Property      @relation(fields: [propertyId], references: [id])
  conversation      Conversation? @relation(fields: [conversationId], references: [id])

  @@index([payerId])
  @@index([recipientId])
  @@index([propertyId])
  @@index([status])
  @@index([type])
  @@index([flutterwaveRef])
  @@index([transactionRef])
  @@map("payments")
}

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

/// Tenant review for a property and/or landlord after completed rental
model Review {
  id            String   @id @default(cuid())
  tenantId      String
  landlordId    String
  propertyId    String
  overallRating Int      // 1–5
  cleanRating   Int?
  locationRating Int?
  valueRating   Int?
  landlordRating Int?
  comment       String
  response      String?  // Landlord's response
  respondedAt   DateTime?
  isVerified    Boolean  @default(false)
  isFlagged     Boolean  @default(false)
  isPublic      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        User     @relation("TenantReviews", fields: [tenantId], references: [id])
  landlord      User     @relation("LandlordReviews", fields: [landlordId], references: [id])
  property      Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([tenantId, propertyId]) // one review per tenant per property
  @@index([propertyId])
  @@index([landlordId])
  @@map("reviews")
}

// ─────────────────────────────────────────────
// MODERATION
// ─────────────────────────────────────────────

/// Content flagged for admin review
model FlaggedContent {
  id             String       @id @default(cuid())
  reportedById   String?
  flaggedUserId  String
  contentType    String       // "message" | "property" | "review" | "profile"
  contentId      String
  reason         String
  severity       FlagSeverity @default(MEDIUM)
  details        String?
  isResolved     Boolean      @default(false)
  resolvedAt     DateTime?
  resolvedBy     String?
  resolutionNote String?
  createdAt      DateTime     @default(now())

  reportedBy     User?        @relation("ReportedByUser", fields: [reportedById], references: [id])
  flaggedUser    User         @relation("FlaggedUser", fields: [flaggedUserId], references: [id])

  @@index([flaggedUserId])
  @@index([isResolved])
  @@index([contentType])
  @@index([severity])
  @@map("flagged_content")
}

// ─────────────────────────────────────────────
// MISCELLANEOUS
// ─────────────────────────────────────────────

/// Saved/favorited properties
model Favorite {
  id         String   @id @default(cuid())
  userId     String
  propertyId String
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([userId, propertyId])
  @@index([userId])
  @@map("favorites")
}

/// In-app notifications
model Notification {
  id         String           @id @default(cuid())
  userId     String
  type       NotificationType
  title      String
  body       String
  data       Json?            // Extra context (propertyId, conversationId, etc.)
  isRead     Boolean          @default(false)
  readAt     DateTime?
  createdAt  DateTime         @default(now())

  user       User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

/// Immutable audit trail of admin actions
model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  action     String   // "SUSPEND_USER" | "APPROVE_PROPERTY" | etc.
  entityType String   // "User" | "Property" | "Payment"
  entityId   String
  before     Json?    // Snapshot before change
  after      Json?    // Snapshot after change
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  actor      User     @relation("ActorLogs", fields: [actorId], references: [id])

  @@index([actorId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

/// Platform-wide settings (key/value store for admin config)
model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  type      String   @default("string") // "string" | "number" | "boolean" | "json"
  label     String
  group     String   @default("general")
  updatedAt DateTime @updatedAt
  updatedBy String?

  @@index([group])
  @@map("system_settings")
}

/// Loyalty points ledger (every transaction that changes points)
model LoyaltyLedger {
  id          String   @id @default(cuid())
  userId      String
  points      Int      // positive = earned, negative = spent
  balance     Int      // running balance after this entry
  reason      String
  referenceId String?  // payment ID or booking ID
  createdAt   DateTime @default(now())

  @@index([userId])
  @@map("loyalty_ledger")
}
```

---

## 3. ENVIRONMENT VARIABLES

**File:** `.env.local`

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/trustrent_ng"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK-..."
FLUTTERWAVE_SECRET_KEY="FLWSECK-..."
FLUTTERWAVE_ENCRYPTION_KEY="..."
FLUTTERWAVE_WEBHOOK_HASH="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Pusher (Real-time)
PUSHER_APP_ID="..."
PUSHER_APP_KEY="..."
PUSHER_APP_SECRET="..."
PUSHER_CLUSTER="mt1"
NEXT_PUBLIC_PUSHER_APP_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"

# Resend (Email)
RESEND_API_KEY="..."
EMAIL_FROM="noreply@trustrent.ng"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TrustRent NG"

# Admin seed (used only during CLI admin creation)
ADMIN_SEED_EMAIL="admin@trustrent.ng"
ADMIN_SEED_PASSWORD="ChangeMe@2026!"

# Fees (in NGN)
NEXT_PUBLIC_INSPECTION_FEE=5000
NEXT_PUBLIC_LISTING_FEE=2000
NEXT_PUBLIC_PLATFORM_COMMISSION_RATE=0.10
```

---

## 4. DIRECTORY STRUCTURE

```
trustrent-ng/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                    # Platform settings seed
│   └── migrations/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (public)/              # No auth required
│   │   │   ├── page.tsx           # Home
│   │   │   ├── properties/
│   │   │   │   └── page.tsx       # Browse listings
│   │   │   └── property/
│   │   │       └── [slug]/
│   │   │           └── page.tsx   # Property detail
│   │   │
│   │   ├── (auth)/                # Auth pages (redirect if logged in)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (tenant)/              # Protected — TENANT role
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   ├── favorites/
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── payments/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (landlord)/            # Protected — LANDLORD role
│   │   │   ├── layout.tsx
│   │   │   ├── landlord/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── listings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── edit/page.tsx
│   │   │   │   ├── bookings/page.tsx
│   │   │   │   ├── messages/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │
│   │   ├── (admin)/               # Protected — ADMIN role
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── properties/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── bookings/page.tsx
│   │   │   │   ├── messages/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── flags/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── reviews/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── properties/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── favorite/route.ts
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── messages/route.ts
│   │   │   ├── payments/
│   │   │   │   ├── initialize/route.ts
│   │   │   │   ├── verify/route.ts
│   │   │   │   └── webhook/route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   ├── notifications/
│   │   │   │   └── route.ts
│   │   │   └── admin/
│   │   │       ├── users/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── properties/route.ts
│   │   │       ├── flags/route.ts
│   │   │       └── stats/route.ts
│   │   │
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── TenantSidebar.tsx
│   │   │   ├── LandlordSidebar.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── AmenityPicker.tsx
│   │   │   └── VirtualTourManager.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── payment/
│   │   │   ├── EscrowCard.tsx
│   │   │   └── PaymentHistory.tsx
│   │   ├── admin/
│   │   │   ├── UserTable.tsx
│   │   │   ├── PropertyTable.tsx
│   │   │   ├── FlagsTable.tsx
│   │   │   └── StatsGrid.tsx
│   │   └── shared/
│   │       ├── SearchBar.tsx
│   │       ├── MapEmbed.tsx
│   │       ├── VirtualTour.tsx
│   │       ├── RatingStars.tsx
│   │       └── NotificationBell.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   ├── flutterwave.ts         # Flutterwave helpers
│   │   ├── cloudinary.ts          # Upload helpers
│   │   ├── pusher.ts              # Real-time client/server
│   │   ├── email.ts               # Resend templates
│   │   ├── validations/           # Zod schemas per domain
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── useConversation.ts
│   │   ├── useNotifications.ts
│   │   └── useFlutterwave.ts
│   │
│   ├── stores/                    # Zustand stores
│   │   ├── useAuthStore.ts
│   │   └── useUIStore.ts
│   │
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts         # Extended session types
│
├── scripts/
│   └── create-admin.ts            # CLI: npx ts-node scripts/create-admin.ts
│
├── public/
│   └── assets/
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```
# TrustRent NG — Next.js Full-Stack Architecture
## Part 2: Complete Frontend Architecture

---

## ROUTE GROUPS EXPLAINED

Next.js App Router uses **route groups** `(groupName)` to share layouts without affecting the URL.

| Route Group | URL Pattern | Auth Guard | Layout |
|---|---|---|---|
| `(public)` | `/`, `/properties`, `/property/[slug]` | None | `Navbar + Footer` |
| `(auth)` | `/login`, `/register`, etc. | Redirect if logged in | Minimal centered layout |
| `(tenant)` | `/dashboard`, `/favorites`, `/messages`, etc. | Must be TENANT | Tenant sidebar layout |
| `(landlord)` | `/landlord/*` | Must be LANDLORD | Landlord sidebar layout |
| `(admin)` | `/admin/*` | Must be ADMIN | Admin sidebar layout |

---

## PUBLIC PAGES

---

### PAGE: Home (`/`)
**File:** `src/app/(public)/page.tsx`  
**Purpose:** Marketing landing page — converts visitors into registered users.

**Layout Sections (top to bottom):**
1. **Sticky Navbar** — Logo, nav links (Properties, How It Works, For Landlords), Sign In / Register CTA buttons
2. **Hero Section** — Full-screen background image of Abuja skyline with overlay. Headline: "Find Your Verified Home in Abuja". Sub-headline about no scams. Hero `<SearchBar>` component (district, type, max budget) that navigates to `/properties`. Trust badges: "2,000+ renters", "NIN-verified landlords", "Escrow protected"
3. **How It Works** — 4-step horizontal card strip: (1) Search, (2) Contact Landlord, (3) Pay Inspection Fee, (4) Move In
4. **Featured Properties** — 6-card grid of `PropertyCard` components. Fetched server-side (SSG with ISR every 30 min). "View all" button → `/properties`
5. **Why TrustRent NG** — Feature highlight grid: Verified Landlords, Escrow Payments, No Fake Agents, In-App Chat
6. **Explore by District** — Pill-shaped clickable district chips. Clicking navigates to `/properties?district=MAITAMA`
7. **Are You a Landlord?** — Green gradient CTA: "List Your Property for Free" → `/register?role=landlord`
8. **Platform Stats** — 4-column counter: 2,000+ Tenants, 500+ Properties, 14 Districts, 4.8★ Average
9. **Testimonials** — 3 static review cards from fake tenants (social proof)
10. **Footer** — Links, districts, company, legal, copyright

**Data fetching:**
```typescript
// Server Component
const featuredProperties = await prisma.property.findMany({
  where: { status: "AVAILABLE", isVerified: true, isFeatured: true },
  take: 6,
  include: { images: { where: { isCover: true }, take: 1 }, amenities: true },
  orderBy: { publishedAt: "desc" }
})
```

---

### PAGE: Browse Properties (`/properties`)
**File:** `src/app/(public)/properties/page.tsx`  
**Purpose:** Full searchable, filterable property listing page.

**Layout:**
- **Top Bar:** Page heading "Properties in Abuja" with count, `<SearchBar>` for inline re-filtering
- **Two-column layout (desktop):**
  - **Left sidebar (280px):** Filter panel
    - District (multi-select checkboxes with counts)
    - Property Type (radio or multi-select)
    - Price Range (dual-handle slider, min ₦0 – max ₦20M)
    - Bedrooms (1, 2, 3, 4+)
    - Amenities (checkboxes: Power, Pool, Security, Parking, etc.)
    - Sort by (Newest, Price ↑, Price ↓, Most Popular, Top Rated)
    - "Clear Filters" button
  - **Right main area:** 
    - Results count + active filter chips (each removable with ×)
    - Toggle: Grid view / List view
    - `<PropertyGrid>` — Responsive grid of `<PropertyCard>` components
    - Pagination (cursor-based, 12 per page)
    - Empty state illustration when no results

**URL params:**  
`/properties?district=MAITAMA&type=TWO_BEDROOM&maxPrice=3000000&bedrooms=2&sort=price_asc&page=2`

**Data fetching (Server Component with searchParams):**
```typescript
const filters = parseSearchParams(searchParams)
const properties = await prisma.property.findMany({
  where: {
    status: "AVAILABLE",
    isVerified: true,
    ...(filters.district && { district: filters.district }),
    ...(filters.type && { type: filters.type }),
    ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
    ...(filters.bedrooms && { bedrooms: { gte: filters.bedrooms } }),
  },
  include: { images: { where: { isCover: true }, take: 1 }, amenities: true },
  orderBy: buildOrderBy(filters.sort),
  skip: (filters.page - 1) * 12,
  take: 12,
})
```

---

### PAGE: Property Detail (`/property/[slug]`)
**File:** `src/app/(public)/property/[slug]/page.tsx`  
**Purpose:** Full property showcase with gallery, tour, booking, and landlord contact.

**Layout (Two-column on desktop):**

**LEFT COLUMN (2/3 width):**
1. Breadcrumb: Home > Properties > Maitama > {property title}
2. **Image Gallery** — Main large image (4:3), thumbnail strip below. Click thumbnail = swap main. Lightbox on click of main image.
3. **Virtual Tour Button** — Prominent button if tour scenes exist: "🎥 Take Virtual Tour (3 rooms)" — opens `<VirtualTour>` modal
4. **Status & Badges** — "Available", "Verified", property type chip
5. **Title & Location** — H1 title, district/estate with map pin icon, rating stars + review count
6. **Quick Stats Strip** — Bedrooms, Bathrooms, Parking, Floor, Furnished? (icon + value)
7. **Description** — Full text, expandable "Read more"
8. **Amenities** — Icon grid (power, pool, gym, security, etc.)
9. **Location Map** — Google Maps embed or Leaflet iframe centered on district
10. **Reviews Section** — Overall rating breakdown (5-star bars), individual review cards with avatar, date, rating, comment
11. **Similar Properties** — 3-card horizontal scroll of other listings in same district

**RIGHT COLUMN (1/3 width, sticky):**
1. **Price Card**
   - Annual rent (large bold)
   - Commission breakdown (10% total: 5% you pay + 5% landlord pays)
   - Service charge, caution fee if any
2. **Landlord Card**
   - Avatar, name, "Verified Landlord" badge
   - Member since, response rate, response time
   - Properties count
3. **Action Buttons**
   - "Book Inspection" (primary green CTA) → opens booking modal
   - "Message Landlord" (secondary) → creates conversation, redirects to `/messages/[id]` (requires login)
   - "Save Property" (heart toggle) → adds to favorites (requires login)
   - "Share" → Web Share API or copy link

**Booking Modal (inline dialog):**
- Full Name, Phone, Preferred Date (date picker, min = today), Time Slot, Notes
- Zod-validated form
- Submits to `POST /api/bookings`
- Success: toast + close modal

**generateStaticParams:** Pre-generates top 50 properties at build time. ISR revalidate = 60s.

---

## AUTH PAGES

---

### PAGE: Login (`/login`)
**File:** `src/app/(auth)/login/page.tsx`  
**Purpose:** Secure sign-in for tenants, landlords, and admins.

**Layout:** Split screen on desktop — left: platform branding/value props, right: form card.

**Form fields:**
- Email (with mail icon)
- Password (with show/hide toggle)
- "Remember me" checkbox
- Forgot Password link → `/forgot-password`
- Submit button "Sign In"

**Below form:**
- Divider "OR"
- "Don't have an account? Register" → `/register`

**Logic:**
- Uses `signIn("credentials", {...})` from NextAuth
- On success: redirect to role-based dashboard
  - ADMIN → `/admin/dashboard`
  - LANDLORD → `/landlord/dashboard`
  - TENANT → `/dashboard`
- Suspended users: show "Account suspended" error, link to support email
- Unverified email: show "Please verify your email" warning

**Error states:**
- Invalid credentials → red inline error
- Suspended account → orange alert banner
- Rate limited (5 failed attempts) → cooldown message

---

### PAGE: Register (`/register`)
**File:** `src/app/(auth)/register/page.tsx`  
**Purpose:** New account creation. Supports both tenant and landlord registration.

**Layout:** Split screen matching login page.

**Form Steps (wizard, 2 steps):**

**Step 1 — Account Type:**
- Two large cards: "I'm Looking for a Home" (Tenant) and "I'm a Landlord" (Landlord)
- Each has icon, brief description, and selectable border on click

**Step 2 — Details:**
- Full Name
- Email
- Phone (Nigerian number validation: `0[789][01]\d{8}`)
- Password (strength indicator: Weak / Fair / Strong)
- Confirm Password
- If Landlord: NIN field (optional at registration, required to publish listings)
- Terms checkbox with link to `/terms` and `/privacy`
- Submit button

**Post-registration:**
- Account created, email verification sent via Resend
- Redirect to `/register/verify-email` page with "Check your inbox" message
- Resend verification email button (rate limited to 1/min)

---

### PAGE: Forgot Password (`/forgot-password`)
**File:** `src/app/(auth)/forgot-password/page.tsx`

- Email field
- Submit → `POST /api/auth/forgot-password`
- Creates VerificationToken with type "password_reset", emails link
- Confirmation message shown (same regardless of whether email exists — prevents enumeration)

---

### PAGE: Reset Password (`/reset-password`)
**File:** `src/app/(auth)/reset-password/page.tsx`

- Token validated from URL query `?token=...`
- New password + confirm password fields
- On success: redirect to `/login` with "Password updated" toast

---

## TENANT PAGES

All pages wrapped in `TenantLayout` with sidebar navigation.

**Tenant Sidebar Links:**
- 🏠 Dashboard
- 🔍 Search Properties
- ❤️ Saved Properties
- 📅 Bookings
- 💬 Messages (with unread badge)
- 💳 Payments
- 👤 My Profile
- ⚙️ Settings

---

### PAGE: Tenant Dashboard (`/dashboard`)
**File:** `src/app/(tenant)/dashboard/page.tsx`

**Sections:**
1. **Welcome banner** — "Good morning, {firstName}! 🌅" with today's date
2. **Stats row (4 cards):**
   - Saved Properties (count)
   - Upcoming Inspections (count + next date)
   - Unread Messages (count)
   - Total Paid via Escrow (formatted NGN)
3. **Verification Status Banner** — If profile not verified, yellow banner: "Complete your profile to unlock all features" → `/dashboard/profile`
4. **Active Bookings** — List of upcoming/pending bookings with property card, date, status badge, cancel button
5. **Recent Messages** — Last 3 conversations with preview
6. **Recommended Properties** — 6-card grid (same district as user, within budget estimate from previous payments)
7. **Recent Payments** — Table: date, property, type, amount, status

---

### PAGE: Search Properties (`/search`)
**File:** `src/app/(tenant)/search/page.tsx`  
**Same as public `/properties` page but wrapped in tenant layout with saved state for filters**

---

### PAGE: Saved Properties (`/favorites`)
**File:** `src/app/(tenant)/favorites/page.tsx`

- Grid of `<PropertyCard>` for all favorited properties
- Remove from favorites button on each card
- Empty state: "No saved properties yet. Start browsing!"
- Sort by: Date saved, Price, District

---

### PAGE: My Bookings (`/bookings`)
**File:** `src/app/(tenant)/bookings/page.tsx`

- Tabs: All | Pending | Confirmed | Completed | Cancelled
- Booking cards: property thumbnail, address, date/time, landlord name, status badge
- Actions per status:
  - Pending: Cancel
  - Confirmed: View directions (Google Maps link), Cancel
  - Completed: Leave Review (if not yet reviewed)
  - Cancelled: Rebook

**Booking Detail (`/bookings/[id]`):**
- Full booking info
- Property mini-card
- Landlord contact (visible if contact_revealed = true on conversation, or booking confirmed)
- Timeline: Requested → Confirmed → Completed
- Cancel button with reason modal

---

### PAGE: Messages (`/messages`)
**File:** `src/app/(tenant)/messages/page.tsx`  
**Dynamic sub-route:** `/messages/[id]`

**Layout (3-column on desktop):**

**Column 1 — Conversation List:**
- Search conversations by property name or landlord
- Each row: landlord avatar, name, property snippet, last message preview, timestamp, unread count badge
- Flagged conversations shown with ⚠️ icon
- "New Message" button

**Column 2 — Active Chat Window (`/messages/[id]`):**
- Header: landlord name, property address, "Protected" shield badge
- Message list (reverse-chron, newest at bottom)
  - Own messages (right-aligned, green background)
  - Their messages (left-aligned, white/gray)
  - System messages (centered, amber background) — warnings, payment notifications
  - Flagged messages show ⚠️ overlay
- Fraud detection: Real-time check as user types. If pattern matches (phone/email/WhatsApp), show inline warning: "⚠️ Sharing contacts before escrow payment violates platform terms"
- Send box: text input, Enter to send, Shift+Enter newline, max 1000 chars, character counter
- Contact lock banner at top if contact not yet revealed

**Column 3 — Escrow Sidebar:**
- Property price card
- 3-step payment progress:
  - Step 1: Pay Inspection Fee (₦5,000) → unlocks scheduling
  - Step 2: Pay First Rent → unlocks landlord contact
  - Step 3: Contact Revealed ✅
- "Pay via Flutterwave" button (calls `/api/payments/initialize`)
- Transaction history for this conversation
- Loyalty points earned

---

### PAGE: Payments (`/payments`)
**File:** `src/app/(tenant)/payments/page.tsx`

- Summary cards: Total paid, Escrow held, Refunds received
- Transaction table: Date, Property, Type, Amount, Status, Reference
- Download receipt button (generates PDF via API)
- Filter by: All, Inspection Fees, Rent, Refunds
- Pagination

---

### PAGE: My Profile (`/dashboard/profile`)
**File:** `src/app/(tenant)/profile/page.tsx`

**Sections:**
1. **Avatar upload** — Cloudinary direct upload with crop modal
2. **Personal Info** — Full name, phone, WhatsApp, bio, occupation, address, state of origin
3. **Verification** — NIN upload, document upload. Shows verification status badge
4. **Email & Password** — Change email (requires re-verification), change password
5. **Notifications** — Toggle which emails/in-app notifications to receive
6. **Danger Zone** — "Delete Account" (requires password confirmation)

---

## LANDLORD PAGES

All under `/landlord/` prefix with `LandlordLayout` sidebar.

**Landlord Sidebar Links:**
- 📊 Dashboard
- 🏠 My Listings
- ➕ Add Property
- 📅 Bookings
- 💬 Messages (badge)
- 💰 Earnings
- 📈 Analytics
- 👤 Profile
- ⚙️ Settings

---

### PAGE: Landlord Dashboard (`/landlord/dashboard`)

**Sections:**
1. **Welcome + verification status** — If NIN not verified: banner "Verify your NIN to publish listings"
2. **Stats row (5 cards):**
   - Active Listings
   - Pending Bookings (this week)
   - Unread Messages
   - Revenue this month
   - Vacancy rate (%)
3. **Quick Actions** — "Add Listing", "View Bookings", "Check Messages"
4. **Listing Performance** — Table of all listings: views, inquiries, bookings, conversion rate
5. **Recent Bookings** — Next 5 upcoming inspections
6. **Recent Messages** — Last 3 unread conversations
7. **Earnings Overview** — Bar chart: last 6 months revenue
8. **Payout Status** — Next payout amount, expected date, bank details link

---

### PAGE: My Listings (`/landlord/listings`)

- Tabs: All | Active | Draft | Pending Review | Archived
- Cards with:
  - Cover image
  - Title, district
  - Price
  - Stats: views, inquiries, bookings
  - Status badge
  - Actions: Edit, View, Archive, Delete
- "Add New Listing" FAB button

---

### PAGE: Add Listing (`/landlord/listings/new`)
**Purpose:** Multi-step form to create a property listing.

**Step 1 — Basic Info:**
- Title, Description, Property Type
- District (dropdown), Estate, Street/Address
- Geolocation: "Use current location" or manual lat/lng input
- Available From date picker, Lease Duration

**Step 2 — Pricing:**
- Annual Rent (NGN)
- Service Charge, Caution Fee, Agency Fee (all optional)
- isFurnished toggle, isNewlyBuilt toggle

**Step 3 — Rooms & Features:**
- Bedrooms slider (1–6)
- Bathrooms slider (1–6)
- Toilets, Sitting Rooms, Parking Spaces
- Total Floors, Floor Number
- Year Built

**Step 4 — Amenities:**
- Checkbox grid with icons. Categories: Utilities, Security, Recreation, Transport, Outdoor
- Custom amenity text field (+ Add button)

**Step 5 — Photos:**
- Drag-and-drop multi-image uploader (max 15 photos, min 3)
- Reorder via drag
- Mark one as Cover, one as Thumbnail
- Each photo uploaded instantly to Cloudinary, URL stored
- Remove button per image

**Step 6 — Virtual Tour (Optional):**
- "Add 360° panoramic images"
- Upload per room/scene
- Name each scene (e.g., "Living Room")
- Preview in mini 3D viewer

**Step 7 — Review & Submit:**
- Preview of how listing will look
- Summary of all entered data
- "Save as Draft" or "Submit for Review"
- Submitting triggers admin review notification

**After submission:**
- Toast: "Listing submitted for review. Our team will review within 24 hours."
- Redirect to `/landlord/listings` with new draft/pending entry

---

### PAGE: Edit Listing (`/landlord/listings/[id]/edit`)
- Same multi-step form pre-filled with existing data
- "Save Changes" button
- Cannot edit while listing is Under Review (locked with message)

---

### PAGE: Listing Detail (`/landlord/listings/[id]`)
- Performance stats (views, inquiries, bookings)
- All bookings for this property
- All conversations for this property
- Reviews received
- Quick edit shortcut

---

### PAGE: Landlord Bookings (`/landlord/bookings`)
- Tabs: Pending | Confirmed | Completed | Cancelled
- Each booking card: tenant avatar, name, phone (if contact_revealed), property, date, notes
- Actions: Confirm, Reschedule, Cancel, Mark Complete
- Calendar view option (full month calendar with color-coded bookings)

---

### PAGE: Landlord Messages (`/landlord/messages` and `/landlord/messages/[id]`)
- Identical layout to tenant messages
- Column 3 replaced with: "Request Escrow Payment" option, tenant verification status card

---

### PAGE: Earnings (`/landlord/payments`)
- Total earned, pending payout, total paid to platform
- Transaction table
- "Add / Update Bank Account" for payouts (Flutterwave bank details)
- Payout history

---

### PAGE: Analytics (`/landlord/analytics`)
- Charts (Recharts):
  - Monthly earnings line chart
  - Views vs Inquiries vs Bookings conversion funnel
  - Performance by district
  - Average time to rent per property type
- Top performing listing cards
- Peak inquiry days heatmap

---

### PAGE: Landlord Profile (`/landlord/profile`)
- Same as tenant profile but includes:
  - NIN verification (required to publish)
  - Bank account for payouts
  - Business name (optional)
  - Company registration number (optional)

---

## ADMIN PAGES

All under `/admin/` prefix with `AdminLayout` sidebar.  
**Admin accounts are created ONLY via CLI terminal script (no self-registration).**

**Admin Sidebar Links:**
- 📊 Dashboard
- 👥 Users (Tenants + Landlords)
- 🏠 Properties
- 📅 Bookings
- 💬 Messages (moderation)
- 💰 Payments
- 🚩 Flags & Reports
- ⭐ Reviews
- 📈 Analytics
- ⚙️ Platform Settings
- 📋 Audit Log

---

### PAGE: Admin Dashboard (`/admin/dashboard`)

**Top Stats Grid (8 cards):**
- Total Users (Tenants + Landlords)
- Active Listings
- Pending Review (listings awaiting approval)
- Pending Bookings Platform-wide
- Total Payments processed (NGN)
- Open Flags/Reports
- New Users Today
- Revenue Today (platform fees)

**Quick Actions:**
- "Review Pending Listings" → `/admin/properties?status=PENDING_REVIEW`
- "Resolve Open Flags" → `/admin/flags?resolved=false`

**Live Activity Feed:**
- Real-time list of latest platform events (new registrations, payments, flags)
- Powered by Pusher admin channel

**Charts:**
- User growth (7 days)
- Payment volume (30 days)
- Listing approval rate (30 days)

---

### PAGE: User Management (`/admin/users`)

**Filters:**
- Search (name, email, phone)
- Role: All | Tenant | Landlord
- Status: All | Active | Suspended | Unverified
- Verification: All | Verified | Pending | Rejected
- Date range

**User Table columns:**
- Avatar + Name
- Email
- Phone
- Role badge
- Verification badge
- Registration date
- Last active
- Suspension status
- Actions: View, Verify, Suspend/Unsuspend, Delete

**Bulk Actions:**
- Select multiple → Bulk Suspend | Bulk Verify | Export CSV

---

### PAGE: User Detail (`/admin/users/[id]`)

**Sections:**
1. **Profile summary** — All profile fields
2. **Verification docs** — Preview of uploaded NIN/documents, Approve/Reject buttons
3. **Activity** — All bookings, conversations, payments, reviews
4. **Flagged content** — Any flags against this user
5. **Audit trail** — All admin actions taken on this user
6. **Suspension** — Suspend form (reason required), or Unsuspend button
7. **Loyalty Points** — Manual adjust

---

### PAGE: Property Management (`/admin/properties`)

**Filters:**
- Status: All | Available | Pending Review | Draft | Archived
- District
- Type
- Verified: All | Yes | No
- Featured: All | Yes | No

**Property Table:**
- Cover image thumbnail
- Title + address
- Landlord name (clickable)
- Type, Bedrooms
- Price
- Status badge
- Submitted date
- Actions: View, Approve, Reject, Feature/Unfeature, Archive

---

### PAGE: Property Review (`/admin/properties/[id]`)

- Full property preview (same as public view)
- Landlord info panel
- Verification checklist: photos quality, address accuracy, price reasonableness, NIN verified
- Approve button → sets status=AVAILABLE, sends email to landlord
- Reject button → modal to enter rejection reason, sends email

---

### PAGE: Bookings (`/admin/bookings`)

- All platform bookings table
- Filter by status, date range, district
- Stats: total, confirmed, completed, cancellation rate
- Export CSV

---

### PAGE: Message Moderation (`/admin/messages`)

**Flagged Conversations Table:**
- Tenant name | Landlord name | Property | Flag reason | Flagged at | Resolved?
- Click "View Chat" → opens `<ConversationDetailModal>` with full message thread, flagged messages highlighted in red

**Actions per flag:**
- Mark Resolved
- Warn User (sends system message to their account)
- Suspend User (quick action from modal)

---

### PAGE: Payment Management (`/admin/payments`)

- All payments table: payer, recipient, property, type, amount, status, Flutterwave ref, date
- Disputed payments highlighted in amber
- Actions: View transaction on Flutterwave dashboard (external link), Issue Refund (with reason), Resolve Dispute

---

### PAGE: Flags & Reports (`/admin/flags`)

- Table of all FlaggedContent records
- Filter: Open | Resolved | By Severity (Low/Medium/High/Critical)
- Each row: reporter, flagged user, content type, content snippet, reason, severity, date
- Actions: View content, Warn User, Suspend User, Dismiss Flag, Resolve

---

### PAGE: Reviews (`/admin/reviews`)

- All platform reviews
- Filter: All | Flagged | Unverified
- Flag inappropriate reviews
- Delete review (with reason logged in audit)
- Mark verified

---

### PAGE: Platform Settings (`/admin/settings`)

**Editable system settings:**
| Setting | Key | Default |
|---|---|---|
| Inspection Fee | `inspection_fee` | 5000 |
| Listing Fee | `listing_fee` | 2000 |
| Platform Commission | `commission_rate` | 0.10 |
| Tenant Commission Split | `tenant_commission` | 0.05 |
| Landlord Commission Split | `landlord_commission` | 0.05 |
| Max Images Per Property | `max_images` | 15 |
| Max Properties Per Landlord | `max_listings` | 20 |
| Maintenance Mode | `maintenance_mode` | false |
| Featured Badge Price | `featured_fee` | 10000 |

All settings are validated before save and changes logged in AuditLog.

---

### PAGE: Audit Log (`/admin/audit-log`)

- Immutable table of all admin actions
- Actor, action, entity type, entity ID, IP address, timestamp
- Filter by actor, action type, date range
- Export CSV

---

## SHARED COMPONENTS SPEC

### `<PropertyCard />`
Props: `property`, `showSaveButton?`, `variant?: "grid" | "list"`  
Shows: cover image, verified badge, status badge, virtual tour badge, title, district, bedrooms/bathrooms, rating, price/year, heart save button

### `<SearchBar />`
Props: `variant?: "hero" | "inline"`, `onSearch?`  
Fields: District (select), Type (select), Max Budget (select)  
Submit navigates to `/properties?{params}` or calls `onSearch`

### `<VirtualTour />`
Full-screen modal with Three.js panoramic sphere renderer. Prev/next scene, hotspots, fullscreen mode, keyboard close.

### `<EscrowCard />`
Shows 3-step payment flow. Integrates Flutterwave payment modal. Shows paid/unpaid state.

### `<NotificationBell />`
Dropdown with latest 10 notifications. Pusher subscription for real-time. Mark all read. Link to relevant page.

### `<RatingStars />`
Props: `value`, `onChange?`, `readonly?`, `size?`  
Renders 5 stars, interactive or display-only.
# TrustRent NG — Next.js Full-Stack Architecture
## Part 3: Complete Backend Architecture

---

## AUTHENTICATION SETUP

### File: `src/lib/auth.ts`
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8)
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { profile: true }
        })

        if (!user || !user.passwordHash) return null
        if (!user.isActive) return null
        if (user.isSuspended) throw new Error("Account suspended")
        if (!user.emailVerified) throw new Error("Email not verified")

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName,
          role: user.role,
          image: user.profile?.avatarUrl,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
})
```

### File: `src/types/next-auth.d.ts`
```typescript
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "TENANT" | "LANDLORD" | "ADMIN"
      image?: string
    }
  }
}
```

### Middleware: `src/middleware.ts`
```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user

  // Public routes — always accessible
  const publicRoutes = ["/", "/properties", "/login", "/register", "/forgot-password", "/reset-password"]
  const isPublicRoute = publicRoutes.some(r => nextUrl.pathname.startsWith(r))
    || nextUrl.pathname.startsWith("/property/")
    || nextUrl.pathname.startsWith("/api/auth")
    || nextUrl.pathname.startsWith("/api/properties")  // public read

  if (isPublicRoute) return NextResponse.next()

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const role = session?.user?.role

  // Role-based access
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", req.url))
  }

  if (nextUrl.pathname.startsWith("/landlord") && role !== "LANDLORD" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Tenant dashboard routes — tenants only
  if ((nextUrl.pathname.startsWith("/dashboard") ||
       nextUrl.pathname.startsWith("/favorites") ||
       nextUrl.pathname.startsWith("/bookings") ||
       nextUrl.pathname.startsWith("/messages") ||
       nextUrl.pathname.startsWith("/payments"))
    && role === "LANDLORD") {
    return NextResponse.redirect(new URL("/landlord/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api/webhooks).*)"],
}
```

---

## API ROUTES — PROPERTIES

### `POST /api/properties` — Create new property listing
```
Auth: LANDLORD | ADMIN
Body: PropertyCreateSchema (see validations)
```
**Logic:**
1. Validate session, confirm role = LANDLORD
2. Check landlord's active listing count vs `max_listings` setting
3. Generate unique slug from title (`slugify(title) + "-" + nanoid(6)`)
4. Create `Property` record with `status: DRAFT`
5. Create `PropertyImage` records for uploaded URLs
6. Create `PropertyAmenity` records
7. Create `VirtualTourScene` records if any
8. Create `Payment` for listing fee (`type: LISTING_FEE`, `status: PENDING`)
9. Redirect landlord to Flutterwave to pay listing fee
10. On webhook callback: set payment confirmed, property can be submitted for review
11. Notify admin via email about new pending listing
12. Return `{ propertyId, slug }`

---

### `GET /api/properties` — Browse properties
```
Auth: None (public)
Query: district, type, minPrice, maxPrice, bedrooms, sort, page, limit
```
**Logic:**
1. Build Prisma `where` clause from query params
2. Only return `status: AVAILABLE, isVerified: true`
3. Include cover image, amenities (for icon display)
4. Return paginated results with total count for pagination UI

---

### `GET /api/properties/[id]` — Single property detail
```
Auth: None (public)
```
**Logic:**
1. Find by ID or slug
2. Increment `views` counter (background, non-blocking)
3. Return full property with all relations
4. If authed user is the landlord: include draft/review status fields

---

### `PATCH /api/properties/[id]` — Update property
```
Auth: LANDLORD (own property) | ADMIN
```
**Logic:**
1. Verify ownership or admin role
2. Cannot edit while `status: PENDING_REVIEW`
3. Merge changed fields, re-validate
4. If significant change (price, address): set `status: DRAFT`, require re-submission
5. Log change to AuditLog

---

### `DELETE /api/properties/[id]` — Archive property
```
Auth: LANDLORD (own) | ADMIN
```
**Logic:** Set `status: ARCHIVED`. Soft delete. Cancel any active bookings for this property with notification to tenants.

---

### `POST /api/properties/[id]/favorite` — Toggle favorite
```
Auth: TENANT
```
**Logic:** Upsert or delete `Favorite` record. Return `{ isFavorited: boolean }`.

---

## API ROUTES — BOOKINGS

### `POST /api/bookings` — Create inspection booking
```
Auth: TENANT
Body: { propertyId, scheduledDate, scheduledTime, tenantName, tenantPhone, notes }
```
**Logic:**
1. Validate tenant is not the property owner
2. Check property status = AVAILABLE
3. Check no existing active booking for same tenant + property
4. Check landlord has no other confirmed booking at same date+time (conflict check)
5. Create `Booking` with `status: PENDING`
6. Create `Notification` for landlord: "New inspection request from {tenantName}"
7. Send email to landlord via Resend
8. Return booking record

---

### `PATCH /api/bookings/[id]` — Update booking status
```
Auth: TENANT (own, for cancel) | LANDLORD (own property, for confirm/reschedule/complete) | ADMIN
Body: { status, notes?, cancelReason? }
```
**Logic by status transition:**

`PENDING → CONFIRMED` (landlord action):
- Set status, send email + notification to tenant
- Auto-update property status to `UNDER_INSPECTION`

`PENDING → CANCELLED` (tenant or landlord action):
- Require cancellation reason
- Send notification to other party
- Restore property to AVAILABLE if this was the only active booking

`CONFIRMED → COMPLETED` (landlord action):
- Set completedAt = now()
- Notify tenant: "Inspection completed! Leave a review"

`CONFIRMED → CANCELLED`:
- Same as above + note about cancellation

---

## API ROUTES — CONVERSATIONS & MESSAGES

### `POST /api/conversations` — Start a conversation
```
Auth: TENANT
Body: { propertyId, landlordId }
```
**Logic:**
1. Check tenant is not the landlord
2. `upsert` Conversation (unique on propertyId + tenantId + landlordId)
3. If new conversation: insert system message "⚠️ Do not share personal contacts outside the platform. All transactions must go through TrustRent NG escrow."
4. Increment property `inquiries` counter
5. Notify landlord: "New inquiry about {property title}"
6. Return `{ conversationId }`

---

### `GET /api/conversations` — List user's conversations
```
Auth: Any logged-in user
```
**Logic:** Return all conversations where `tenantId = userId OR landlordId = userId`, ordered by `lastMessageAt DESC`. Include last message preview, unread counts, other party's profile.

---

### `GET /api/conversations/[id]/messages` — Load messages
```
Auth: Conversation participant | ADMIN
Query: cursor (for pagination), limit=50
```
**Logic:**
1. Verify access (participant or admin)
2. Return messages ordered by `createdAt ASC`
3. Mark all unread messages as read, reset `unreadTenant` or `unreadLandlord` counter
4. Pusher: trigger `read-receipt` event to sender

---

### `POST /api/conversations/[id]/messages` — Send message
```
Auth: Conversation participant
Body: { content }
```
**Logic:**
1. Verify participant
2. **Fraud detection** — run content against CONTACT_PATTERNS:
   ```
   patterns: [
     /\b0[789][01]\d{8}\b/,    // Nigerian phone
     /\b\d{11}\b/,              // 11-digit number
     /[\w.-]+@[\w.-]+\.\w{2,}/, // Email address
     /whatsapp|telegram|facebook|instagram|snapchat/i,
     /\+234\d{10}/,             // Intl Nigerian phone
     /pay\s*me|send\s*money|transfer/i, // Payment requests
   ]
   ```
3. If suspicious:
   - Set `message.isFlagged = true`, `message.flagReason = "contact_sharing"`
   - Update `conversation.isFlagged = true`, `conversation.flagReason = "Contact sharing detected"`
   - Insert system message warning
   - Create `FlaggedContent` record
   - Create `Notification` for admin
4. Save message, update conversation `lastMessageAt` and `lastMessageText`
5. Increment unread counter for the other party
6. **Pusher push** to channel `conversation-{id}`: event `new-message` with full message object
7. Send email notification to recipient if offline
8. Return created message

---

## API ROUTES — PAYMENTS (FLUTTERWAVE)

### File: `src/lib/flutterwave.ts`
```typescript
const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!
const FLW_PUBLIC = process.env.FLUTTERWAVE_PUBLIC_KEY!

export async function initializePayment({
  amount,
  email,
  name,
  phone,
  txRef,
  meta,
  redirectUrl,
}: InitPaymentParams) {
  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FLW_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: "NGN",
      redirect_url: redirectUrl,
      customer: { email, name, phonenumber: phone },
      customizations: {
        title: "TrustRent NG",
        description: meta.description,
        logo: "https://trustrent.ng/logo.png",
      },
      meta,
    }),
  })
  const data = await response.json()
  if (data.status !== "success") throw new Error(data.message)
  return data.data.link as string // Flutterwave hosted payment page URL
}

export async function verifyPayment(txRef: string) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
    { headers: { Authorization: `Bearer ${FLW_SECRET}` } }
  )
  const data = await response.json()
  return data.data // { status, amount, currency, tx_ref, id }
}

export function verifyWebhookHash(hash: string): boolean {
  return hash === process.env.FLUTTERWAVE_WEBHOOK_HASH
}
```

---

### `POST /api/payments/initialize` — Start a payment
```
Auth: TENANT | LANDLORD
Body: { paymentType, propertyId, conversationId?, amount?, recipientId }
```
**Logic:**
1. Validate session
2. Determine amount from type:
   - `INSPECTION_FEE` → read from `SystemSetting` key `inspection_fee` (default ₦5,000)
   - `LISTING_FEE` → read from `SystemSetting` key `listing_fee` (default ₦2,000)
   - `FIRST_RENT` → property.price
   - `PLATFORM_COMMISSION` → calculated from rent
3. Calculate platform fee
4. Generate unique `txRef` = `TRUSTRENT-${nanoid(12).toUpperCase()}`
5. Create `Payment` record with `status: PENDING`, `transactionRef: txRef`
6. Call `initializePayment()` to get Flutterwave hosted payment URL
7. Save `callbackUrl` to Payment record
8. Return `{ paymentUrl }` — frontend redirects user to this URL

---

### `GET /api/payments/verify` — Verify after redirect
```
Auth: TENANT | LANDLORD
Query: tx_ref, status, transaction_id
```
**Logic:** (This is the redirect URL Flutterwave sends users back to after payment)
1. Find Payment by `transactionRef = tx_ref`
2. Call `verifyPayment(tx_ref)` from Flutterwave API
3. If `status = "successful"`:
   - Update `Payment.status = COMPLETED`
   - Update `Payment.flutterwaveTxId`
   - Run post-payment actions (see webhook logic below)
4. If `status = "failed"`: set `Payment.status = FAILED`
5. Redirect user to appropriate page with `?payment_status=success|failed`

---

### `POST /api/payments/webhook` — Flutterwave webhook
```
Auth: Verify webhook hash header
```
**Logic:**
1. Verify `verif-hash` header matches `FLUTTERWAVE_WEBHOOK_HASH`
2. Parse event body
3. If `event = "charge.completed"` and `status = "successful"`:
   - Find Payment by `flutterwaveTxId` or `tx_ref`
   - If already COMPLETED: skip (idempotent)
   - Set `Payment.status = COMPLETED`, `verifiedAt = now()`
   - **Run post-payment actions based on payment type:**

**INSPECTION_FEE paid:**
  - Set `conversation.contactRevealed = false` (inspection fee doesn't reveal contact yet)
  - Update conversation `status` metadata
  - Send system message to conversation: "✅ Inspection fee paid. You can now schedule a visit."
  - Create notification for both parties
  - Award 5 loyalty points to payer

**LISTING_FEE paid:**
  - Allow landlord to submit property for admin review
  - Set property `status = PENDING_REVIEW`
  - Notify admin

**FIRST_RENT paid:**
  - Set `conversation.contactRevealed = true`, `contactRevealedAt = now()`
  - Send system message: "🎉 First rent paid! Landlord's contact information is now visible."
  - Award 50 loyalty points to tenant
  - Calculate and record platform commission payment records for both parties
  - Notify admin + both parties

4. Return `200 OK` immediately (Flutterwave retries on non-200)

---

## API ROUTES — ADMIN

### `GET /api/admin/stats` — Platform statistics
```
Auth: ADMIN
```
Returns counts and totals for dashboard stats cards. Uses `prisma.$transaction` for atomic multi-query.

---

### `GET /api/admin/users` — List all users
```
Auth: ADMIN
Query: role, status, verified, search, page, limit
```
Returns paginated user list with profile data.

---

### `PATCH /api/admin/users/[id]` — Update user
```
Auth: ADMIN
Body: { isSuspended?, suspensionReason?, verificationStatus? }
```
**Logic:**
1. Apply changes to User and/or Profile
2. If suspending: set `isSuspended = true`, `suspendedAt`, `suspendedBy`, `suspensionReason`
3. Send email notification to user
4. Log to AuditLog
5. If verifying: set `profile.verificationStatus = VERIFIED`, `verifiedAt`, `verifiedBy`
6. Send "Account Verified" email

---

### `PATCH /api/admin/properties/[id]` — Approve/Reject property
```
Auth: ADMIN
Body: { action: "approve" | "reject" | "feature", rejectionReason? }
```
**Logic:**
- `approve`: set `status = AVAILABLE`, `isVerified = true`, `publishedAt = now()`
- `reject`: set `status = DRAFT`, `rejectionReason`, email landlord with reason
- `feature`: toggle `isFeatured`
- Log to AuditLog, send email to landlord

---

### `PATCH /api/admin/flags/[id]` — Resolve a flag
```
Auth: ADMIN
Body: { resolved, resolutionNote }
```
Updates `FlaggedContent` record and logs action.

---

## ADMIN CLI — Create Admin User

### File: `scripts/create-admin.ts`
```typescript
#!/usr/bin/env npx ts-node
/**
 * TrustRent NG — Admin User Creator
 * 
 * Usage:
 *   npx ts-node scripts/create-admin.ts
 * 
 * Or with env vars:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass@1 npx ts-node scripts/create-admin.ts
 * 
 * This script is the ONLY way to create admin accounts.
 * Admin users cannot self-register via the web interface.
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import readline from "readline"

const prisma = new PrismaClient()

async function prompt(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    if (hidden) process.stdout.write(question)
    rl.question(hidden ? "" : question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write("\n")
      resolve(answer.trim())
    })
  })
}

async function main() {
  console.log("\n🛡️  TrustRent NG — Admin Account Creator")
  console.log("==========================================\n")

  const email = process.env.ADMIN_EMAIL || await prompt("Admin Email: ")
  const name = process.env.ADMIN_NAME || await prompt("Display Name: ")
  const password = process.env.ADMIN_PASSWORD || await prompt("Password (min 12 chars): ", true)
  const confirm = process.env.ADMIN_PASSWORD || await prompt("Confirm Password: ", true)

  // Validation
  if (!email.includes("@")) throw new Error("Invalid email address")
  if (password.length < 12) throw new Error("Password must be at least 12 characters")
  if (password !== confirm) throw new Error("Passwords do not match")
  if (!/[A-Z]/.test(password)) throw new Error("Password must contain uppercase letter")
  if (!/[0-9]/.test(password)) throw new Error("Password must contain a number")
  if (!/[!@#$%^&*]/.test(password)) throw new Error("Password must contain special character")

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (existing.role === "ADMIN") {
      throw new Error(`Admin with email ${email} already exists`)
    }
    // Promote existing user to admin
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    })
    console.log(`\n✅ Existing user ${email} promoted to ADMIN role.`)
    return
  }

  // Create new admin
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(), // Admin is pre-verified
      isActive: true,
      profile: {
        create: {
          displayName: name,
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
        }
      }
    }
  })

  console.log(`\n✅ Admin account created successfully!`)
  console.log(`   ID:    ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Role:  ${user.role}`)
  console.log(`\n⚠️  Store the password securely. It cannot be recovered.\n`)
}

main()
  .catch((e) => {
    console.error("\n❌ Error:", e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

**Usage:**
```bash
# Interactive
npx ts-node scripts/create-admin.ts

# With environment variables (for CI/CD)
ADMIN_EMAIL="admin@trustrent.ng" \
ADMIN_PASSWORD="S3cure@Admin2026!" \
ADMIN_NAME="Super Admin" \
npx ts-node scripts/create-admin.ts
```

---

## VALIDATION SCHEMAS

### File: `src/lib/validations/property.ts`
```typescript
import { z } from "zod"

export const PropertyCreateSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  type: z.enum(["SELF_CONTAIN","ONE_BEDROOM","TWO_BEDROOM","THREE_BEDROOM","DUPLEX","BUNGALOW","MINI_FLAT","PENTHOUSE"]),
  district: z.enum(["MAITAMA","ASOKORO","WUSE","WUSE_2","GWARINPA","KUBWA","LUGBE","LOKOGOMA","UTAKO","JAHI","KARMO","GARKI","APO","LIFE_CAMP","DURUMI","GUDU","KADO","KATAMPE","MABUSHI"]),
  estate: z.string().min(2).max(100),
  street: z.string().min(5).max(200),
  price: z.number().int().min(100000).max(100000000),
  serviceCharge: z.number().int().min(0).default(0),
  cautionFee: z.number().int().min(0).default(0),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(1).max(20),
  parkingSpaces: z.number().int().min(0).max(20).default(0),
  isFurnished: z.boolean().default(false),
  isNewlyBuilt: z.boolean().default(false),
  availableFrom: z.coerce.date().optional(),
  amenities: z.array(z.string()).max(50),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
    isCover: z.boolean().default(false),
    order: z.number().int().default(0),
  })).min(3).max(15),
})
```

### File: `src/lib/validations/auth.ts`
```typescript
export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .max(128),
  displayName: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^0[789][01]\d{8}$/, "Enter valid Nigerian phone (e.g. 08012345678)"),
  role: z.enum(["TENANT", "LANDLORD"]),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

### File: `src/lib/validations/booking.ts`
```typescript
export const BookingCreateSchema = z.object({
  propertyId: z.string().cuid(),
  scheduledDate: z.coerce.date().min(new Date(), "Date must be in the future"),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  tenantName: z.string().min(2).max(100),
  tenantPhone: z.string().regex(/^0[789][01]\d{8}$/),
  notes: z.string().max(500).optional(),
})
```

---

## REAL-TIME (PUSHER)

### File: `src/lib/pusher.ts` (server)
```typescript
import Pusher from "pusher"

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})
```

### Client hook: `src/hooks/useConversation.ts`
```typescript
import PusherClient from "pusher-js"

const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})

export function useConversationRealtime(conversationId: string, onMessage: (msg: Message) => void) {
  useEffect(() => {
    const channel = pusherClient.subscribe(`conversation-${conversationId}`)
    channel.bind("new-message", onMessage)
    return () => { channel.unbind_all(); pusherClient.unsubscribe(`conversation-${conversationId}`) }
  }, [conversationId])
}
```

After saving a message, the API calls:
```typescript
await pusherServer.trigger(`conversation-${conversationId}`, "new-message", {
  id: message.id,
  content: message.content,
  senderId: message.senderId,
  type: message.type,
  createdAt: message.createdAt,
  isFlagged: message.isFlagged,
})
```

---

## EMAIL TEMPLATES (RESEND)

### File: `src/lib/email.ts`
```typescript
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: `TrustRent NG <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  })
}

// Templates (kept simple — real project would use React Email)
export const templates = {
  verifyEmail: (name: string, url: string) => `
    <h2>Welcome to TrustRent NG, ${name}!</h2>
    <p>Please verify your email address to get started.</p>
    <a href="${url}" style="background:#1a7a3f;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">
      Verify Email
    </a>
    <p>Link expires in 24 hours.</p>
  `,
  bookingRequest: (landlordName: string, tenantName: string, propertyTitle: string, date: string) => `
    <h2>New Inspection Request</h2>
    <p>Hi ${landlordName},</p>
    <p><strong>${tenantName}</strong> wants to inspect <strong>${propertyTitle}</strong> on ${date}.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/landlord/bookings">View Booking</a>
  `,
  bookingConfirmed: (tenantName: string, propertyTitle: string, date: string) => `
    <h2>Inspection Confirmed!</h2>
    <p>Hi ${tenantName}, your inspection of ${propertyTitle} is confirmed for ${date}.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings">View Details</a>
  `,
  paymentReceived: (name: string, amount: string, type: string) => `
    <h2>Payment Received</h2>
    <p>Hi ${name}, we received your ${type} payment of ${amount}.</p>
  `,
  accountSuspended: (name: string, reason: string) => `
    <h2>Account Suspended</h2>
    <p>Hi ${name}, your TrustRent NG account has been suspended.</p>
    <p>Reason: ${reason}</p>
    <p>To appeal, contact <a href="mailto:support@trustrent.ng">support@trustrent.ng</a></p>
  `,
  propertyApproved: (landlordName: string, propertyTitle: string) => `
    <h2>Listing Approved! 🎉</h2>
    <p>Hi ${landlordName}, your property "${propertyTitle}" is now live on TrustRent NG.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/landlord/listings">Manage Listings</a>
  `,
  propertyRejected: (landlordName: string, propertyTitle: string, reason: string) => `
    <h2>Listing Not Approved</h2>
    <p>Hi ${landlordName}, your listing "${propertyTitle}" was not approved.</p>
    <p>Reason: ${reason}</p>
    <p>Please make the requested changes and resubmit.</p>
  `,
}
```

---

## IMAGE UPLOAD

### `POST /api/upload` — Upload to Cloudinary
```
Auth: LANDLORD | TENANT (avatar)
Body: FormData with file
```
```typescript
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file: File, folder: string) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }] },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    ).end(buffer)
  })
}
```

---

## LOYALTY POINTS SYSTEM

**Earning Points:**
| Action | Points |
|---|---|
| Complete registration | +10 |
| Verify NIN | +50 |
| Pay inspection fee | +5 |
| Pay first rent via escrow | +50 |
| Leave a review | +10 |
| Refer a new user | +25 |
| Landlord: list property | +20 |
| Landlord: complete rental | +100 |

**Spending Points:**
| Redemption | Cost |
|---|---|
| Discount on inspection fee (₦500 off) | 50 points |
| Featured listing boost (1 week) | 200 points |
| Priority support | 100 points |

Points recorded in `LoyaltyLedger` for full audit trail.

---

## PRISMA CLIENT SINGLETON

### File: `src/lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

---

## PLATFORM FEE CONSTANTS

### File: `src/lib/constants.ts`
```typescript
export const PLATFORM = {
  INSPECTION_FEE: 5_000,       // ₦5,000
  LISTING_FEE: 2_000,          // ₦2,000
  COMMISSION_RATE: 0.10,       // 10% of rent
  TENANT_COMMISSION: 0.05,     // 5% of rent (tenant pays)
  LANDLORD_COMMISSION: 0.05,   // 5% of rent (landlord pays)
  FEATURED_FEE: 10_000,        // ₦10,000 for featured badge
  MAX_IMAGES: 15,
  MAX_LISTINGS_PER_LANDLORD: 20,
  MIN_PROPERTY_PRICE: 100_000, // ₦100K minimum rent
  INSPECTION_FEE_REFUNDABLE: false,
}

export const ABUJA_DISTRICTS = [
  "MAITAMA", "ASOKORO", "WUSE", "WUSE_2", "GWARINPA",
  "KUBWA", "LUGBE", "LOKOGOMA", "UTAKO", "JAHI",
  "KARMO", "GARKI", "APO", "LIFE_CAMP", "DURUMI",
  "GUDU", "KADO", "KATAMPE", "MABUSHI"
] as const

export const DISTRICT_LABELS: Record<string, string> = {
  MAITAMA: "Maitama",
  ASOKORO: "Asokoro",
  WUSE: "Wuse",
  WUSE_2: "Wuse 2",
  GWARINPA: "Gwarinpa",
  KUBWA: "Kubwa",
  LUGBE: "Lugbe",
  LOKOGOMA: "Lokogoma",
  UTAKO: "Utako",
  JAHI: "Jahi",
  KARMO: "Karmo",
  GARKI: "Garki",
  APO: "Apo",
  LIFE_CAMP: "Life Camp",
  DURUMI: "Durumi",
  GUDU: "Gudu",
  KADO: "Kado",
  KATAMPE: "Katampe",
  MABUSHI: "Mabushi",
}
```

---

## PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "@prisma/client": "^5.19.0",
    "next-auth": "^5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.7.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.15",
    "tailwindcss-animate": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.462.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-badge": "^0.1.0",
    "@tanstack/react-query": "^5.56.0",
    "zustand": "^4.5.0",
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0",
    "cloudinary": "^2.5.0",
    "resend": "^3.5.0",
    "flutterwave-node-v3": "^1.1.6",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0",
    "three": "^0.168.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "slugify": "^1.6.6",
    "nanoid": "^5.0.0",
    "sharp": "^0.33.0",
    "sonner": "^1.5.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "embla-carousel-react": "^8.3.0"
  },
  "devDependencies": {
    "prisma": "^5.19.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/three": "^0.168.0",
    "ts-node": "^10.9.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

---

## DATABASE COMMANDS

```bash
# Initial setup
npx prisma init
npx prisma migrate dev --name init
npx prisma generate

# Seed platform settings
npx ts-node prisma/seed.ts

# Create first admin
npx ts-node scripts/create-admin.ts

# View database in browser
npx prisma studio

# After schema changes
npx prisma migrate dev --name describe_change
npx prisma generate

# Production deployment
npx prisma migrate deploy
```
# TrustRent NG — Next.js Full-Stack Architecture
## Part 4: Role-Specific Flows, Features & User Journeys

---

## TENANT JOURNEY (End-to-End)

### Step 1: Discovery
- Lands on `/` → sees hero, featured properties, district chips
- Clicks district chip or runs search → `/properties?district=MAITAMA`
- Browses property cards (no login required for browsing)

### Step 2: Property Interest
- Clicks a property card → `/property/luxury-3-bedroom-maitama-abc123`
- Views full gallery, amenities, location, reviews
- Optionally takes virtual tour (360° view)
- Clicks "❤️ Save" → prompted to register/login if not authenticated
- Clicks "Book Inspection" → prompted to login first, then booking modal opens

### Step 3: Registration / Login
- Navigates to `/register` → selects "I'm looking for a home" (Tenant)
- Fills in name, email, phone, password
- Receives verification email, clicks link → email confirmed
- Redirected to `/dashboard`

### Step 4: Booking Inspection
- Returns to property detail
- Clicks "Book Inspection"
- Fills booking form: name, phone, date, time, notes
- Submitted → `POST /api/bookings` → landlord notified
- Tenant sees booking in `/bookings` with status "Pending"

### Step 5: Pre-Inspection Payment
- Landlord confirms booking → tenant notified via email + in-app
- On `/messages/[convId]` — Escrow Sidebar shows "Pay Inspection Fee (₦5,000)"
- Tenant clicks "Pay via Flutterwave"
- Redirected to Flutterwave hosted checkout
- Enters card or bank transfer details, completes payment
- Redirected back to `/messages/[convId]?payment_status=success`
- System message in chat: "✅ Inspection fee paid. Good luck with your visit!"

### Step 6: Physical Inspection
- Tenant visits property on scheduled date
- Landlord marks booking as "Completed" in `/landlord/bookings`

### Step 7: Decision to Rent
- Tenant decides to rent → returns to `/messages/[convId]`
- Escrow sidebar now shows "Pay First Rent (₦2,500,000)"
- Tenant pays first rent via Flutterwave
- On webhook confirmation:
  - `conversation.contactRevealed = true`
  - Landlord's phone and WhatsApp now visible in chat
  - System message: "🎉 Payment confirmed! You can now contact the landlord directly."
  - Both parties get email with the other party's full contact details

### Step 8: Post-Rental
- Tenant can leave a review for the property and landlord
- Loyalty points reflected in profile
- Future rent payments processed via platform (recommended but not enforced)

---

## LANDLORD JOURNEY (End-to-End)

### Step 1: Registration
- Navigates to `/register` → selects "I'm a Landlord"
- Fills in name, email, phone, password, (optional NIN)
- Email verified → redirected to `/landlord/dashboard`

### Step 2: Profile Verification (Required to Publish)
- Dashboard shows yellow banner: "Verify your NIN to publish listings"
- Navigates to `/landlord/profile`
- Uploads NIN document photo + selfie
- Sets status to `PENDING` — admin receives notification
- Admin verifies (or rejects with reason) via `/admin/users/[id]`
- Landlord receives email: "Your account has been verified ✅"

### Step 3: Create Listing
- Clicks "Add Property" in sidebar → `/landlord/listings/new`
- Completes 7-step form wizard
- Uploads 3–15 property photos
- Optionally adds virtual tour panoramic images
- Chooses "Submit for Review"
- Redirected to Flutterwave to pay listing fee (₦2,000)
- After payment: listing moves to `PENDING_REVIEW`
- Admin receives notification

### Step 4: Admin Review
- Admin reviews listing at `/admin/properties/[id]`
- Checks: clear photos, accurate address, reasonable price, NIN verified
- Approves → listing goes `AVAILABLE`, landlord emailed

### Step 5: Receiving Inquiries
- Tenant starts conversation → landlord notified
- Landlord responds in `/landlord/messages/[id]`
- Fraud detection system monitors messages
- System message warns both parties about off-platform deals

### Step 6: Booking Management
- Tenant books inspection → notification in `/landlord/bookings`
- Landlord confirms or cancels/reschedules
- Calendar view shows all upcoming inspections

### Step 7: Receiving Payment
- Tenant pays first rent via escrow
- Flutterwave webhook confirms payment
- Platform calculates: ₦2,500,000 rent → 5% landlord commission = ₦125,000 platform fee
- Landlord receives ₦2,375,000 (rent minus landlord's 5% commission share)
- Payout to bank account registered in profile
- Landlord receives payment notification

### Step 8: Post-Rental
- Landlord marks booking complete
- Tenant review appears on listing (after moderation)
- Property status reverted to AVAILABLE when lease expires (manual or scheduled)

---

## ADMIN JOURNEY

### Step 1: Account Creation (CLI only)
```bash
npx ts-node scripts/create-admin.ts
# Enters email, name, password via terminal
# Account is immediately active and email-verified
```

### Step 2: Login
- Navigates to `/login`
- Uses admin credentials
- Redirected to `/admin/dashboard`
- Two-factor note: future enhancement with TOTP

### Step 3: Daily Moderation Tasks

**Morning review:**
1. Check `/admin/dashboard` — new registrations, pending listings, open flags
2. Review new user registrations (check NIN submissions)
3. Approve/reject new property listings
4. Review flagged conversations

**Property approval workflow:**
1. Open `/admin/properties?status=PENDING_REVIEW`
2. Click each listing → view all photos, check address on Google Maps, check price vs district
3. Verify landlord's NIN status
4. If OK: "Approve" → listing goes live
5. If issues: "Reject" → enter specific reason (sent to landlord)

**Flag resolution workflow:**
1. Open `/admin/flags?resolved=false`
2. Each flag shows: who flagged, why, the flagged content
3. Read flagged messages in conversation viewer
4. Actions:
   - Warn user (system message sent)
   - Suspend user (isSuspended = true, email sent)
   - Dismiss flag (false positive)
   - Resolve (issue handled)

**User dispute handling:**
1. User emails support
2. Admin looks up user at `/admin/users`
3. Views full activity: bookings, payments, messages
4. Can manually mark payments as verified or issue refunds
5. All actions logged in AuditLog

### Step 4: Platform Settings Management
- Navigates to `/admin/settings`
- Updates inspection fee, commission rates
- Changes take effect immediately (read from DB, not .env)

### Step 5: Analytics Review
- Monthly: pull analytics report
- Revenue by month, user growth, most popular districts
- Listings approval rate (quality score)
- Conversion: inquiries → bookings → payments

---

## FRAUD PREVENTION SYSTEM

### Contact Sharing Detection
Runs on every message sent via `POST /api/conversations/[id]/messages`.

**Detected patterns:**
```
Nigerian mobile: 0[789][01]\d{8}
International: \+234\d{10}
Generic 11 digits: \b\d{11}\b
Email: [\w.-]+@[\w.-]+\.\w{2,}
Social media: whatsapp|telegram|facebook|instagram|snapchat|tiktok
Payment apps: opay|palmpay|kuda|moniepoint|paystack
Money requests: pay me|send me money|transfer \d+
```

**Actions on detection:**
1. Message saved with `isFlagged = true`
2. Conversation flagged: `is_flagged = true`
3. System warning message inserted in conversation
4. `FlaggedContent` record created with `severity = HIGH`
5. Admin notification via Pusher admin channel
6. User's flag count incremented in profile metadata
7. If user has 3+ flags: auto-suspend for review

### Escalation Tiers
| Flag Count | Automated Action |
|---|---|
| 1 | System warning message in chat |
| 2 | Email warning to user |
| 3 | Temporary suspension (24h), admin review required |
| 5 | Permanent suspension recommendation to admin |

---

## NOTIFICATION SYSTEM

### In-App Notifications
Stored in `Notification` table. Retrieved via `GET /api/notifications`.  
Real-time delivery via Pusher channel `user-{userId}`.

### Email Notifications
Sent via Resend for critical events:
- Email verification
- Password reset
- Booking request/confirmation/cancellation
- Payment received/failed
- Listing approved/rejected
- Account verified/suspended

### Notification Preferences (per user)
Stored in Profile or a separate `NotificationPreference` table:
- Email: booking updates, payment updates, new messages, platform news
- In-app: all of the above + admin alerts

---

## PROPERTY STATUS FLOW

```
DRAFT ──(submit + pay listing fee)──▶ PENDING_REVIEW
                                            │
                          ┌─────────────────┤
                          │                 │
                        REJECT           APPROVE
                          │                 │
                          ▼                 ▼
                        DRAFT           AVAILABLE
                                            │
                          ┌─────────────────┤
                          │                 │
               (booking confirmed)     (landlord archive)
                          │                 │
                          ▼                 ▼
                   UNDER_INSPECTION      ARCHIVED
                          │
               (rent paid + landlord confirms)
                          │
                          ▼
                        RENTED
                          │
                   (lease expires)
                          │
                          ▼
                       AVAILABLE  (loop)
```

---

## ESCROW PAYMENT FLOW

```
Tenant wants to inspect:

Tenant ──[Pay ₦5,000 inspection fee]──▶ Flutterwave
                                              │
                                     [Webhook: charge.completed]
                                              │
                                   Payment record → COMPLETED
                                              │
                                   System msg: "Inspection fee paid"
                                   Booking can be scheduled
                                              │
Landlord confirms inspection ──────────────────
                                              │
Tenant inspects property ────────────────────
                                              │
Tenant decides to rent:

Tenant ──[Pay ₦X first rent]──▶ Flutterwave
                                       │
                              [Webhook: charge.completed]
                                       │
                             Payment → COMPLETED
                             conversation.contactRevealed = true
                             Landlord notified
                             Platform commission calculated
                             Payout to landlord (minus commission)
                             Landlord contact visible in chat
```

---

## SECURITY CONSIDERATIONS

### Authentication
- JWT sessions (not database sessions) for scalability
- Passwords: bcrypt with cost factor 12
- Email verification required before first login
- Rate limiting on login attempts: 5 per IP per 15 minutes (via middleware)
- Admin accounts: stricter password requirements (12+ chars, special chars)

### Authorization
- Every API route verifies session via `auth()` from NextAuth
- Ownership checks: verify resource belongs to authenticated user before mutations
- Admin-only routes guarded at middleware AND at API handler level (double check)
- Property operations: verify `landlordId === session.user.id`

### Input Validation
- All API inputs validated with Zod before reaching Prisma
- File uploads: MIME type check, max size 10MB per image
- Text fields: length limits, HTML stripped (no XSS)
- SQL injection: impossible via Prisma (parameterized queries)

### Webhook Security
- Flutterwave webhooks verified via `verif-hash` header
- Webhook handler processes events idempotently (checks if already processed)
- Pusher auth endpoint validates user session before allowing channel subscription

### Data Privacy
- NIN stored hashed (SHA-256), not in plaintext
- Phone numbers not displayed to other party until escrow payment
- Soft deletes for user data (GDPR-style: mark deleted, keep for audit)
- AuditLog for all admin actions (non-repudiation)

---

## NEXT.JS CONFIG

### File: `next.config.ts`
```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }, // for seed data
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return [
      {
        source: "/api/payments/webhook",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ]
  },
}

export default nextConfig
```

---

## SEED FILE (Platform Settings)

### File: `prisma/seed.ts`
```typescript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const settings = [
    { key: "inspection_fee", value: "5000", type: "number", label: "Inspection Fee (NGN)", group: "payments" },
    { key: "listing_fee", value: "2000", type: "number", label: "Listing Fee (NGN)", group: "payments" },
    { key: "commission_rate", value: "0.10", type: "number", label: "Platform Commission Rate", group: "payments" },
    { key: "tenant_commission", value: "0.05", type: "number", label: "Tenant Commission Share", group: "payments" },
    { key: "landlord_commission", value: "0.05", type: "number", label: "Landlord Commission Share", group: "payments" },
    { key: "max_images", value: "15", type: "number", label: "Max Images Per Property", group: "properties" },
    { key: "max_listings", value: "20", type: "number", label: "Max Listings Per Landlord", group: "properties" },
    { key: "maintenance_mode", value: "false", type: "boolean", label: "Maintenance Mode", group: "general" },
    { key: "featured_fee", value: "10000", type: "number", label: "Featured Listing Fee (NGN)", group: "payments" },
    { key: "platform_name", value: "TrustRent NG", type: "string", label: "Platform Name", group: "general" },
    { key: "support_email", value: "support@trustrent.ng", type: "string", label: "Support Email", group: "general" },
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log(`✅ Seeded ${settings.length} platform settings`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

Run with: `npx prisma db seed`

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

---

## QUICK START CHECKLIST

```
□ Clone repo
□ Copy .env.example → .env.local, fill all values
□ npm install
□ npx prisma migrate dev --name init
□ npx prisma generate
□ npx prisma db seed              (platform settings)
□ npx ts-node scripts/create-admin.ts  (create first admin)
□ npm run dev
□ Visit http://localhost:3000
□ Login as admin at /login
□ Verify admin sees /admin/dashboard

Production deployment:
□ Push to GitHub
□ Connect to Vercel
□ Add all env vars in Vercel dashboard
□ Set DATABASE_URL to production Postgres (e.g. Supabase, Railway, Neon)
□ npx prisma migrate deploy (runs in Vercel build command)
□ Configure Flutterwave webhook → https://yourdomain.com/api/payments/webhook
□ Configure Pusher app
□ Configure Cloudinary upload preset
□ Configure Resend verified sender domain
```
