'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { PlaceCard } from '@/components/place-card'
import { PlaceCardsSkeletonList } from '@/components/place-card-skeleton'
import { useLanguage } from '@/lib/i18n/language-context'
import type { Place } from '@/lib/mock-data'
import { MapPin, AlertCircle, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface PlacesListRef {
  scrollToPlace: (placeId: string) => void
}

interface PlacesListProps {
  places: Place[]
  selectedPlace: Place | null
  onPlaceSelect: (place: Place) => void
  onViewOnMap: (place: Place) => void
  onGetDirections: (place: Place) => void
  loading?: boolean
  error?: string | null
  className?: string
}

export const PlacesList = forwardRef<PlacesListRef, PlacesListProps>(
  function PlacesList(
    {
      places,
      selectedPlace,
      onPlaceSelect,
      onViewOnMap,
      onGetDirections,
      loading = false,
      error = null,
      className,
    },
    ref
  ) {
    const { t } = useLanguage()
    const listRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

    // Expose scroll method to parent
    useImperativeHandle(ref, () => ({
      scrollToPlace: (placeId: string) => {
        const element = itemRefs.current.get(placeId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      },
    }))

    // Scroll to selected place when it changes
    useEffect(() => {
      if (selectedPlace) {
        const element = itemRefs.current.get(selectedPlace.id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, [selectedPlace])

    // Loading state
    if (loading) {
      return (
        <div className={cn('overflow-auto', className)}>
          <PlaceCardsSkeletonList count={4} />
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('errorOccurred')}</h3>
          <p className="text-muted-foreground text-sm max-w-sm">{error}</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => window.location.reload()}>
            {t('tryAgain')}
          </Button>
        </div>
      )
    }

    // Empty state
    if (places.length === 0) {
      return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
          <div className="rounded-full bg-muted p-4 mb-4">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t('noPlacesFound')}</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {t('noPlacesFoundDescription')}
          </p>
        </div>
      )
    }

    return (
      <div ref={listRef} className={cn('overflow-auto', className)}>
        <div className="grid gap-4 pr-1">
          {places.map((place) => (
            <div
              key={place.id}
              ref={(el) => {
                if (el) itemRefs.current.set(place.id, el)
              }}
            >
              <PlaceCard
                place={place}
                onClick={() => onPlaceSelect(place)}
                onViewOnMap={() => onViewOnMap(place)}
                onGetDirections={() => onGetDirections(place)}
                isSelected={selectedPlace?.id === place.id}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)
