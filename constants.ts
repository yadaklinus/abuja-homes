export const CURRENCY = '₦';
export const PLACEHOLDER_AVATAR = "https://picsum.photos/100/100";

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

export const PROPERTY_TYPES = [
  "SELF_CONTAIN", "ONE_BEDROOM", "TWO_BEDROOM", "THREE_BEDROOM",
  "DUPLEX", "BUNGALOW", "MINI_FLAT", "PENTHOUSE"
] as const

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  SELF_CONTAIN: "Self Contain",
  ONE_BEDROOM: "One Bedroom",
  TWO_BEDROOM: "Two Bedroom",
  THREE_BEDROOM: "Three Bedroom",
  DUPLEX: "Duplex",
  BUNGALOW: "Bungalow",
  MINI_FLAT: "Mini Flat",
  PENTHOUSE: "Penthouse",
}
