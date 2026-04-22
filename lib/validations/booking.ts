import { z } from "zod"

export const BookingCreateSchema = z.object({
  propertyId: z.string().cuid(),
  scheduledDate: z.coerce.date().min(new Date(), "Date must be in the future"),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  tenantName: z.string().min(2).max(100),
  tenantPhone: z.string().regex(/^0[789][01]\d{8}$/),
  notes: z.string().max(500).optional(),
})
