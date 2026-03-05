'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RatingStars } from '@/components/rating-stars'
import { TimeWeightedRating } from '@/components/time-weighted-rating'
import { PublicCommentsFeed } from '@/components/public-comments-feed'
import { useLanguage } from '@/lib/i18n/language-context'
import { type Place, type Review, getPlaceTypeColor } from '@/lib/mock-data'
import { MapPin, Navigation, Clock, Fuel, Zap, Wrench, Coffee, X, DollarSign, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceDetailsModalProps {
  place: Place | null
  isOpen: boolean
  onClose: () => void
}

import type { PlaceType } from '@/lib/mock-data'

const typeIcons: Record<PlaceType, typeof Fuel> = {
  fuel_station: Fuel,
  ev_charging: Zap,
  construction_shop: Wrench,
  cafe_restaurant: Coffee,
}

export function PlaceDetailsModal({ place, isOpen, onClose }: PlaceDetailsModalProps) {
  const { t } = useLanguage()
  const [reviews] = useState<Review[]>(place?.reviews || [])

  if (!place) return null

  const Icon = typeIcons[place.type]

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-48 w-full">
          <Image
            src={place.image || "/placeholder.svg"}
            alt={place.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('close')}</span>
          </Button>

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', getPlaceTypeColor(place.type))}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{place.name}</h2>
                <div className="flex items-center gap-2">
                  <RatingStars rating={place.rating} size="sm" />
                  <span className="text-white/90 text-sm font-medium">{place.rating.toFixed(1)}</span>
                  <span className="text-white/70 text-sm">({place.reviewCount} {t('reviews').toLowerCase()})</span>
                </div>
              </div>
              {place.isOpen !== null && (
                <Badge variant={place.isOpen ? 'default' : 'secondary'} className={place.isOpen ? 'bg-emerald-500 text-white' : ''}>
                  {place.isOpen ? t('open') : t('closed')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <div className="p-6 space-y-6">
            {/* Address & Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{place.address}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button className="gap-2">
                  <Navigation className="h-4 w-4" />
                  {t('getDirections')}
                </Button>
              </div>
            </div>

            {/* Phone & Call Button for Cafes/Restaurants */}
            {place.phone && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('phoneNumber')}</p>
                    <p className="text-sm text-muted-foreground">{place.phone}</p>
                  </div>
                </div>
                <Button 
                  asChild
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <a href={`tel:${place.phone}`}>
                    <Phone className="h-4 w-4" />
                    {t('callNow')}
                  </a>
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold text-foreground">{place.rating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{t('highestRating')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold text-foreground">{place.reviewCount}</p>
                <p className="text-xs text-muted-foreground">{t('reviews')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-2xl font-bold text-foreground">{place.distance}</p>
                <p className="text-xs text-muted-foreground">{t('km')}</p>
              </div>
            </div>

            {/* Prices Section */}
            {(place.fuelPrices || place.menuItems || place.materialPrices) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {place.type === 'fuel_station' ? t('fuelPrices') : 
                     place.type === 'cafe_restaurant' ? t('menuPrices') : t('materialPrices')}
                    {place.priceLevel && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "ml-auto text-xs",
                          place.priceLevel === 'low' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                          place.priceLevel === 'medium' && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          place.priceLevel === 'high' && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {place.priceLevel === 'low' && t('priceLow')}
                        {place.priceLevel === 'medium' && t('priceMedium')}
                        {place.priceLevel === 'high' && t('priceHigh')}
                      </Badge>
                    )}
                  </h3>
                  <div className="space-y-2">
                    {/* Fuel Prices */}
                    {place.fuelPrices && place.fuelPrices.map((fuel, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-foreground">
                          {fuel.type === 'metan' && t('metan')}
                          {fuel.type === 'propan' && t('propan')}
                          {fuel.type === 'benzin' && t('benzin')}
                          {fuel.type === 'dizel' && t('dizel')}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {fuel.price.toLocaleString()} {t('uzs')}{fuel.unit === 'litr' ? t('perLiter') : t('perM3')}
                        </span>
                      </div>
                    ))}
                    {/* Menu Items */}
                    {place.menuItems && place.menuItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                        <span className="text-sm font-bold text-primary">
                          {item.price.toLocaleString()} {t('uzs')}
                        </span>
                      </div>
                    ))}
                    {/* Material Prices */}
                    {place.materialPrices && place.materialPrices.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium text-foreground">{material.name}</span>
                        <span className="text-sm font-bold text-primary">
                          {material.price.toLocaleString()} {t('uzs')}/{material.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Time-Weighted Rating Section */}
            <TimeWeightedRating reviews={reviews} />

            <Separator />

            {/* Public Comments Feed - replaces old review system */}
            <PublicCommentsFeed placeId={place.id} placeName={place.name} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
