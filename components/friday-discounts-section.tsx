'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Percent, Clock, Map, Fuel, Wrench, Coffee, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DistanceBadge } from '@/components/distance-badge'
import { useLanguage } from '@/lib/i18n/language-context'
import { type Place, type PlaceType, getPlaceTypeColor } from '@/lib/mock-data'
import {
  isFriday,
  getTimeUntilFridayEnds,
  getDiscountedPlaces,
  getDiscountConfig,
  formatCountdown,
  type DiscountConfig,
} from '@/lib/friday-discounts'
import { cn } from '@/lib/utils'
import { FridayDiscountsAdmin } from './friday-discounts-admin'

const sectionTitle = {
  en: 'Friday Discounts',
  ru: 'Пятничные скидки',
  uz: 'Juma chegirmalari',
}

const sectionSubtitle = {
  en: 'Special offers only today!',
  ru: 'Специальные предложения только сегодня!',
  uz: "Faqat bugun maxsus takliflar!",
}

const endsIn = {
  en: 'Ends in',
  ru: 'Заканчивается через',
  uz: 'Tugashiga',
}

const hours = {
  en: 'h',
  ru: 'ч',
  uz: 's',
}

const minutes = {
  en: 'm',
  ru: 'м',
  uz: 'd',
}

const seconds = {
  en: 's',
  ru: 'с',
  uz: 's',
}

interface FridayDiscountsSectionProps {
  places: Place[]
  onViewOnMap: (place: Place) => void
  loading?: boolean
}

const typeIcons: Record<PlaceType, typeof Fuel> = {
  fuel_station: Fuel,
  ev_charging: Fuel,
  construction_shop: Wrench,
  cafe_restaurant: Coffee,
}

function DiscountCardSkeleton() {
  return (
    <Card className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0 overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

interface DiscountCardProps {
  place: Place & { discountPercent: number }
  onViewOnMap: (place: Place) => void
  language: 'en' | 'ru' | 'uz'
}

function DiscountCard({ place, onViewOnMap, language }: DiscountCardProps) {
  const { t } = useLanguage()
  const Icon = typeIcons[place.type]

  const typeLabels: Record<PlaceType, Record<'en' | 'ru' | 'uz', string>> = {
    fuel_station: { en: 'Fuel Station', ru: 'АЗС', uz: 'Yoqilg\'i shoxobchasi' },
    ev_charging: { en: 'EV Charging', ru: 'Зарядка ЭВ', uz: 'EV zaryadlash' },
    construction_shop: { en: 'Construction', ru: 'Стройматериалы', uz: 'Qurilish mollari' },
    cafe_restaurant: { en: 'Restaurant', ru: 'Ресторан', uz: 'Restoran' },
  }

  return (
    <Card className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0 overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={place.image || "/placeholder.svg"}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Discount Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm px-2 py-1 shadow-lg">
            <Percent className="h-3 w-3 mr-1" />
            {place.discountPercent}% OFF
          </Badge>
        </div>
        
        {/* Type Icon - Top Right */}
        <div className="absolute top-2 right-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md', getPlaceTypeColor(place.type))}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        
        {/* Distance - Bottom Right */}
        <div className="absolute bottom-2 right-2">
          <DistanceBadge distance={place.distance} size="sm" className="bg-white/90 text-foreground backdrop-blur-sm" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            {typeLabels[place.type][language]}
          </Badge>
        </div>
        <h3 className="font-semibold text-card-foreground truncate mb-3">{place.name}</h3>
        
        <Button
          variant="default"
          size="sm"
          className="w-full gap-1.5 bg-primary hover:bg-primary/90"
          onClick={() => onViewOnMap(place)}
        >
          <Map className="h-3.5 w-3.5" />
          {t('viewOnMap')}
        </Button>
      </CardContent>
    </Card>
  )
}

export function FridayDiscountsSection({ places, onViewOnMap, loading = false }: FridayDiscountsSectionProps) {
  const { language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [countdown, setCountdown] = useState(0)
  const [config, setConfig] = useState<DiscountConfig | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Load config on mount
  useEffect(() => {
    setConfig(getDiscountConfig())
    setIsVisible(isFriday())
    setCountdown(getTimeUntilFridayEnds())
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      const remaining = getTimeUntilFridayEnds()
      setCountdown(remaining)
      
      if (remaining === 0) {
        setIsVisible(false)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible])

  // Handle config update
  const handleConfigUpdate = useCallback((newConfig: DiscountConfig) => {
    setConfig(newConfig)
  }, [])

  // Don't render if not Friday or disabled
  if (!isVisible || !config || !config.enabled) {
    // Still show admin button for testing/configuration
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          onClick={() => setShowAdmin(true)}
        >
          <Settings className="h-4 w-4" />
          {language === 'uz' ? 'Juma chegirmalarini sozlash' : language === 'ru' ? 'Настройка скидок' : 'Configure Friday Discounts'}
        </Button>
        
        <FridayDiscountsAdmin
          isOpen={showAdmin}
          onClose={() => setShowAdmin(false)}
          places={places}
          onConfigUpdate={handleConfigUpdate}
        />
      </div>
    )
  }

  const discountedPlaces = getDiscountedPlaces(places, config)
  const time = formatCountdown(countdown)

  if (discountedPlaces.length === 0 && !loading) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg">
            <Percent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {sectionTitle[language]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {sectionSubtitle[language]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div className="hidden sm:flex items-center gap-2 bg-muted/80 backdrop-blur-sm rounded-full px-4 py-2">
            <Clock className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium text-foreground">
              {endsIn[language]}:
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-rose-500">
              <span>{String(time.hours).padStart(2, '0')}{hours[language]}</span>
              <span>:</span>
              <span>{String(time.minutes).padStart(2, '0')}{minutes[language]}</span>
              <span>:</span>
              <span>{String(time.seconds).padStart(2, '0')}{seconds[language]}</span>
            </div>
          </div>

          {/* Admin Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowAdmin(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Countdown */}
      <div className="flex sm:hidden items-center justify-center gap-2 bg-muted/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
        <Clock className="h-4 w-4 text-rose-500" />
        <span className="text-sm font-medium text-foreground">
          {endsIn[language]}:
        </span>
        <div className="flex items-center gap-1 font-mono font-bold text-rose-500">
          <span>{String(time.hours).padStart(2, '0')}{hours[language]}</span>
          <span>:</span>
          <span>{String(time.minutes).padStart(2, '0')}{minutes[language]}</span>
          <span>:</span>
          <span>{String(time.seconds).padStart(2, '0')}{seconds[language]}</span>
        </div>
      </div>

      {/* Cards Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <>
            <DiscountCardSkeleton />
            <DiscountCardSkeleton />
            <DiscountCardSkeleton />
          </>
        ) : (
          discountedPlaces.map((place) => (
            <DiscountCard
              key={place.id}
              place={place}
              onViewOnMap={onViewOnMap}
              language={language}
            />
          ))
        )}
      </div>

      {/* Admin Modal */}
      <FridayDiscountsAdmin
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        places={places}
        onConfigUpdate={handleConfigUpdate}
      />
    </section>
  )
}
