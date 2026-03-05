"use client";

import { useMemo } from "react";
import type { Place, PlaceType } from "@/lib/mock-data";

interface TopPickResult {
  place: Place;
  score: number;
}

interface UseTopPicksResult {
  topFuelStation: Place | null;
  topCafeRestaurant: Place | null;
  topConstructionShop: Place | null;
  allTopPicks: Place[];
  loading: boolean;
}

/**
 * Calculate the "Eng mukammal" (best) score for a place
 * Based on: recent rating (60%), overall rating (30%), distance factor (10%)
 */
function calculateScore(place: Place, userLat?: number, userLng?: number): number {
  // Recent rating simulation (higher for places with more reviews = more recent activity)
  const recentRatingFactor = Math.min(place.reviewCount / 100, 1) * place.rating;
  
  // Overall rating
  const overallRating = place.rating;
  
  // Distance factor (closer = better, max 20km for consideration)
  let distanceFactor = 1;
  if (place.distance !== null && place.distance > 0) {
    // Normalize distance: 0km = 1, 20km = 0
    distanceFactor = Math.max(0, 1 - place.distance / 20);
  }
  
  // Only consider active places
  if (place.isOpen === false) {
    return 0;
  }
  
  // Calculate weighted score
  const score = (recentRatingFactor * 0.6) + (overallRating * 0.3) + (distanceFactor * 0.1 * 5);
  
  return Math.round(score * 100) / 100;
}

/**
 * Get the top pick for a specific category
 */
function getTopPickForCategory(
  places: Place[],
  type: PlaceType,
  userLat?: number,
  userLng?: number
): Place | null {
  const categoryPlaces = places.filter(
    (p) => p.type === type && p.isOpen !== false
  );

  if (categoryPlaces.length === 0) return null;

  const scoredPlaces: TopPickResult[] = categoryPlaces.map((place) => ({
    place,
    score: calculateScore(place, userLat, userLng),
  }));

  // Sort by score descending
  scoredPlaces.sort((a, b) => b.score - a.score);

  return scoredPlaces[0]?.place || null;
}

export function useTopPicks(
  places: Place[],
  userLocation: { lat: number; lng: number } | null
): UseTopPicksResult {
  const result = useMemo(() => {
    const userLat = userLocation?.lat;
    const userLng = userLocation?.lng;

    const topFuelStation = getTopPickForCategory(
      places,
      "fuel_station",
      userLat,
      userLng
    );
    const topCafeRestaurant = getTopPickForCategory(
      places,
      "cafe_restaurant",
      userLat,
      userLng
    );
    const topConstructionShop = getTopPickForCategory(
      places,
      "construction_shop",
      userLat,
      userLng
    );

    const allTopPicks: Place[] = [
      topFuelStation,
      topCafeRestaurant,
      topConstructionShop,
    ].filter((p): p is Place => p !== null);

    return {
      topFuelStation,
      topCafeRestaurant,
      topConstructionShop,
      allTopPicks,
      loading: false,
    };
  }, [places, userLocation]);

  return result;
}
