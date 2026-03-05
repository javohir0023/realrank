'use client'

import { type PlaceType, type Place } from './mock-data'

// Discount rates by place type (special Friday-only discounts)
export const DISCOUNT_RATES: Record<PlaceType, number> = {
  fuel_station: 10, // 10% off fuel
  cafe_restaurant: 15, // 15% off food
  construction_shop: 12, // 12% off materials
  ev_charging: 0, // No discount for EV charging
}

// Place IDs that are participating in Friday Discounts
// This would typically come from a database/admin panel
export interface DiscountConfig {
  enabled: boolean
  participatingPlaceIds: string[]
  customRates?: Partial<Record<PlaceType, number>>
}

// Default participating places - only 3-4 special places get Friday discounts
// This keeps discounts exclusive and valuable
const DEFAULT_PARTICIPATING_PLACES = [
  // 1 Fuel station with best discount
  'khorezm-fuel_station-34', // REAL METAN - popular station in Urganch
  // 1 Restaurant 
  'khorezm-cafe_restaurant-114', // Ichan Qala Restaurant - famous in Khiva
  // 1 Construction shop
  'khorezm-construction_shop-207', // Tsement va Qum Bazasi - budget materials
  // 1 Additional cafe
  'khorezm-cafe_restaurant-107', // Somon Osh - popular local eatery
]

// Local storage key for discount config
const DISCOUNT_CONFIG_KEY = 'realrate_friday_discounts'

// Get discount config from localStorage
export function getDiscountConfig(): DiscountConfig {
  if (typeof window === 'undefined') {
    return {
      enabled: true,
      participatingPlaceIds: DEFAULT_PARTICIPATING_PLACES,
    }
  }
  
  try {
    const stored = localStorage.getItem(DISCOUNT_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading discount config:', e)
  }
  
  return {
    enabled: true,
    participatingPlaceIds: DEFAULT_PARTICIPATING_PLACES,
  }
}

// Save discount config to localStorage
export function saveDiscountConfig(config: DiscountConfig): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(DISCOUNT_CONFIG_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('Error saving discount config:', e)
  }
}

// Check if it's Friday
export function isFriday(): boolean {
  const now = new Date()
  return now.getDay() === 5 // 0 = Sunday, 5 = Friday
}

// Get time until Friday ends (in seconds)
export function getTimeUntilFridayEnds(): number {
  const now = new Date()
  
  if (!isFriday()) {
    return 0
  }
  
  // Calculate end of Friday (midnight)
  const endOfFriday = new Date(now)
  endOfFriday.setHours(23, 59, 59, 999)
  
  return Math.max(0, Math.floor((endOfFriday.getTime() - now.getTime()) / 1000))
}

// Get discount percentage for a place
export function getDiscountForPlace(place: Place, config: DiscountConfig): number {
  if (!config.enabled) return 0
  if (!config.participatingPlaceIds.includes(place.id)) return 0
  
  const customRate = config.customRates?.[place.type]
  if (customRate !== undefined) return customRate
  
  return DISCOUNT_RATES[place.type] || 0
}

// Filter places that have discounts
export function getDiscountedPlaces(places: Place[], config: DiscountConfig): (Place & { discountPercent: number })[] {
  if (!config.enabled) return []
  
  return places
    .filter(place => config.participatingPlaceIds.includes(place.id))
    .map(place => ({
      ...place,
      discountPercent: getDiscountForPlace(place, config),
    }))
    .filter(place => place.discountPercent > 0)
}

// Format countdown time
export function formatCountdown(seconds: number): { hours: number; minutes: number; seconds: number } {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return { hours, minutes, seconds: secs }
}
