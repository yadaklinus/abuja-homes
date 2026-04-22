import NextAuth from "next-auth"
import { authConfig } from "./lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user

  // Public routes — always accessible
  const publicRoutes = ["/", "/properties", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/rentals"]
  const isPublicRoute = publicRoutes.some(r => nextUrl.pathname.startsWith(r))
    || nextUrl.pathname.startsWith("/property/")
    || nextUrl.pathname.startsWith("/api/auth")
    || nextUrl.pathname.startsWith("/api/properties")  // public read

  if (isPublicRoute) return NextResponse.next()

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const role = session?.user?.role

  // Role-based access
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url))
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