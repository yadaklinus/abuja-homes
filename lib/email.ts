export async function sendEmail(to: string, subject: string, html: string) {
  console.log("================ MOCK EMAIL SENT ================")
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log("==================================================")
}

export const templates = {
  verifyEmail: (name: string, url: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a7a3f;">Welcome to TrustRent NG, ${name}!</h2>
      <p>Please verify your email address to get started.</p>
      <div style="margin: 30px 0;">
        <a href="${url}" style="background:#1a7a3f;color:white;padding:14px 28px;text-decoration:none;border-radius:12px;font-weight:bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  `,
  bookingRequest: (landlordName: string, tenantName: string, propertyTitle: string, date: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a7a3f;">New Inspection Request</h2>
      <p>Hi ${landlordName},</p>
      <p><strong>${tenantName}</strong> wants to inspect <strong>${propertyTitle}</strong> on ${date}.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/landlord/bookings" style="background:#1a7a3f;color:white;padding:14px 28px;text-decoration:none;border-radius:12px;font-weight:bold;">
          View Booking
        </a>
      </div>
    </div>
  `,
}
