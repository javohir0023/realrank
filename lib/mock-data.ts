import { khorezmPlaces, type KhorezmPlace, placeStats, type FuelPrice, type MenuItem, type MaterialPrice } from './khorezm-places'

// Re-export price types for convenience
export type { FuelPrice, MenuItem, MaterialPrice }

export type PlaceType = 'fuel_station' | 'ev_charging' | 'construction_shop' | 'cafe_restaurant'

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  helpful?: number
}

export interface Place {
  id: string
  name: string
  type: PlaceType
  address: string
  rating: number
  reviewCount: number
  distance: number | null
  isOpen: boolean | null
  image: string
  coordinates: {
    lat: number
    lng: number
  }
  priceLevel?: 'low' | 'medium' | 'high'
  reviews?: Review[]
  district?: string
  landmark?: string
  status?: 'active' | 'inactive'
  // Price data based on type
  fuelPrices?: FuelPrice[]
  menuItems?: MenuItem[]
  materialPrices?: MaterialPrice[]
  // Contact info
  phone?: string
}

// Khorezm region center (Urgench)
export const KHOREZM_CENTER = {
  lat: 41.5500,
  lng: 60.6333,
}

// Default map bounds for Khorezm region
export const KHOREZM_BOUNDS = {
  north: 42.0,
  south: 41.0,
  east: 61.5,
  west: 60.0,
}

export const mockUser = {
  id: '1',
  name: 'Azizbek Quronboyev',
  email: 'aziz@example.com',
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg',
}

// Place type images
const placeImages: Record<PlaceType, string[]> = {
  fuel_station: [
    'https://i.pinimg.com/736x/ab/26/1f/ab261f3cf3eace35cfe4e91ac62f54d4.jpg',

  ],
  cafe_restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  ],
  construction_shop: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
  ],
  ev_charging: [
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
  ],
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Convert Khorezm place to Place format
export function convertKhorezmPlaceToPlace(place: KhorezmPlace, userLat?: number, userLng?: number): Place {
  let distance: number | null = null
  if (userLat !== undefined && userLng !== undefined) {
    distance = calculateDistance(userLat, userLng, place.coordinates.lat, place.coordinates.lng)
  }

  // Generate consistent rating based on place id
  const rating = 3.5 + (place.id % 15) / 10
  const reviewCount = 10 + (place.id % 90)
  
  // Get appropriate image based on type
  const typeImages = placeImages[place.type as PlaceType] || placeImages.fuel_station
  const image = typeImages[place.id % typeImages.length]

  return {
    id: `khorezm-${place.type}-${place.id}`,
    name: place.name,
    type: place.type as PlaceType,
    address: `${place.address}, ${place.district}`,
    rating: Math.min(5, Math.round(rating * 10) / 10),
    reviewCount,
    distance,
    isOpen: place.status === 'active',
    image,
    coordinates: place.coordinates,
    district: place.district,
    landmark: place.landmark,
    status: place.status,
    priceLevel: place.priceLevel,
    fuelPrices: place.fuelPrices,
    menuItems: place.menuItems,
    materialPrices: place.materialPrices,
    phone: place.phone,
  }
}

// Get all Khorezm places as Place[]
export function getKhorezmPlaces(userLat?: number, userLng?: number): Place[] {
  return khorezmPlaces.map(place => convertKhorezmPlaceToPlace(place, userLat, userLng))
}

// Get active Khorezm places only
export function getActiveKhorezmPlaces(userLat?: number, userLng?: number): Place[] {
  return khorezmPlaces
    .filter(p => p.status === 'active')
    .map(place => convertKhorezmPlaceToPlace(place, userLat, userLng))
}

// Mock places now use Khorezm data by default
export const mockPlaces: Place[] = getKhorezmPlaces(KHOREZM_CENTER.lat, KHOREZM_CENTER.lng)

// Export place stats for display
export { placeStats }

// Mock reviews in Uzbek
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Aziz Karimov',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: "Ajoyib xizmat! Tez va sifatli. Xodimlar juda xushmuomala.",
    date: '2025-01-15',
    helpful: 12,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Malika Rustamova',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    comment: "Yaxshi joy, lekin ba'zan navbat ko'p bo'ladi. Narxlar bozor narxida.",
    date: '2025-01-10',
    helpful: 8,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Bobur Alimov',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    comment: "Har doim shu yerga kelaman. Ishonchli va qulay.",
    date: '2025-01-05',
    helpful: 15,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Nilufar Saidova',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    comment: "Sifati a'lo darajada. Tavsiya qilaman!",
    date: '2024-12-28',
    helpful: 6,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Sardor Yusupov',
    userAvatar: 'https://i.pravatar.cc/150?img=7',
    rating: 3,
    comment: "O'rtacha xizmat. Narxlar biroz baland, lekin joylashuvi qulay.",
    date: '2024-12-20',
    helpful: 4,
  },
]

// Get unique districts from Khorezm data
export const khorezmDistricts = [...new Set(khorezmPlaces.map(p => p.district))]

export const getPlaceTypeIcon = (type: PlaceType) => {
  switch (type) {
    case 'fuel_station':
      return 'Fuel'
    case 'ev_charging':
      return 'Zap'
    case 'construction_shop':
      return 'Wrench'
    case 'cafe_restaurant':
      return 'Coffee'
    default:
      return 'MapPin'
  }
}

export const getPlaceTypeColor = (type: PlaceType) => {
  switch (type) {
    case 'fuel_station':
      return 'bg-red-500'
    case 'ev_charging':
      return 'bg-green-500'
    case 'construction_shop':
      return 'bg-amber-500'
    case 'cafe_restaurant':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}
