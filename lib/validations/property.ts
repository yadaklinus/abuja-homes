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

export const PropertyUpdateSchema = PropertyCreateSchema.partial()
