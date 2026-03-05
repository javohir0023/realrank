'use client'

import React from "react"

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from '@/components/rating-stars'
import { DistanceBadge } from '@/components/distance-badge'
import { useLanguage } from '@/lib/i18n/language-context'
import { type Place, type PlaceType, getPlaceTypeColor } from '@/lib/mock-data'
import { MapPin, Fuel, Zap, Wrench, Coffee, Navigation, Map, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceCardProps {
  place: Place
  onClick: () => void
  onViewOnMap?: () => void
  onGetDirections?: () => void
  isSelected?: boolean
}

const typeIcons: Record<PlaceType, typeof Fuel> = {
  fuel_station: Fuel,
  ev_charging: Zap,
  construction_shop: Wrench,
  cafe_restaurant: Coffee,
}

export function PlaceCard({ place, onClick, onViewOnMap, onGetDirections, isSelected }: PlaceCardProps) {
  const { t } = useLanguage()
  const Icon = typeIcons[place.type]

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewOnMap?.()
  }

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onGetDirections) {
      onGetDirections()
    } else {
      // Fallback: open Google Maps directions
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`
      window.open(url, '_blank')
    }
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden group',
        isSelected && 'ring-2 ring-primary shadow-lg'
      )}
      onClick={onClick}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={place.image || "/placeholder.svg"}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 left-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md', getPlaceTypeColor(place.type))}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="absolute top-2 right-2">
          {place.isOpen !== null && (
            <Badge variant={place.isOpen ? 'default' : 'secondary'} className={place.isOpen ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}>
              {place.isOpen ? t('open') : t('closed')}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <DistanceBadge distance={place.distance} size="sm" className="bg-white/90 text-foreground backdrop-blur-sm" />
        </div>
        {place.priceLevel && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs backdrop-blur-sm",
                place.priceLevel === 'low' && "bg-emerald-500/90 text-white",
                place.priceLevel === 'medium' && "bg-amber-500/90 text-white",
                place.priceLevel === 'high' && "bg-rose-500/90 text-white"
              )}
            >
              {place.priceLevel === 'low' && t('priceLow')}
              {place.priceLevel === 'medium' && t('priceMedium')}
              {place.priceLevel === 'high' && t('priceHigh')}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground truncate mb-1">{place.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{place.address}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RatingStars rating={place.rating} size="sm" />
            <span className="text-sm font-medium text-card-foreground">{place.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({place.reviewCount})</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 bg-transparent"
            onClick={handleViewOnMap}
          >
            <Map className="h-3.5 w-3.5" />
            {t('viewOnMap')}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleGetDirections}
          >
            <Navigation className="h-3.5 w-3.5" />
            {t('getDirections')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
