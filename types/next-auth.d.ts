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