'use client'

import React from "react"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLanguage } from '@/lib/i18n/language-context'
import { type PlaceType } from '@/lib/mock-data'
import { Fuel, Zap, Wrench, Coffee, X } from 'lucide-react'

interface FilterSidebarProps {
  selectedTypes: PlaceType[]
  onTypesChange: (types: PlaceType[]) => void
  distance: number
  onDistanceChange: (distance: number) => void
  sortBy: 'nearest' | 'rating' | 'reviews'
  onSortByChange: (sortBy: 'nearest' | 'rating' | 'reviews') => void
  isOpen: boolean
  onClose: () => void
}

const serviceTypes: { type: PlaceType; icon: React.ReactNode; labelKey: 'fuelStation' | 'evCharging' | 'constructionShop' | 'cafeRestaurant' }[] = [
  { type: 'fuel_station', icon: <Fuel className="h-4 w-4" />, labelKey: 'fuelStation' },
  { type: 'ev_charging', icon: <Zap className="h-4 w-4" />, labelKey: 'evCharging' },
  { type: 'construction_shop', icon: <Wrench className="h-4 w-4" />, labelKey: 'constructionShop' },
  { type: 'cafe_restaurant', icon: <Coffee className="h-4 w-4" />, labelKey: 'cafeRestaurant' },
]

export function FilterSidebar({
  selectedTypes,
  onTypesChange,
  distance,
  onDistanceChange,
  sortBy,
  onSortByChange,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const { t } = useLanguage()

  const handleTypeToggle = (type: PlaceType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const handleClearFilters = () => {
    onTypesChange(['fuel_station', 'ev_charging', 'construction_shop', 'cafe_restaurant'])
    onDistanceChange(10)
    onSortByChange('nearest')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-80 transform bg-card shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">{t('filters')}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">{t('close')}</span>
            </Button>
          </div>

          {/* Service Types */}
          <div className="space-y-4 mb-6">
            <Label className="text-sm font-medium text-card-foreground">{t('serviceType')}</Label>
            <div className="space-y-3">
              {serviceTypes.map((service) => (
                <div key={service.type} className="flex items-center space-x-3">
                  <Checkbox
                    id={service.type}
                    checked={selectedTypes.includes(service.type)}
                    onCheckedChange={() => handleTypeToggle(service.type)}
                  />
                  <label
                    htmlFor={service.type}
                    className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer text-card-foreground"
                  >
                    {service.icon}
                    {t(service.labelKey)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-card-foreground">{t('distance')}</Label>
              <span className="text-sm text-muted-foreground">{distance} {t('km')}</span>
            </div>
            <Slider
              value={[distance]}
              onValueChange={(value) => onDistanceChange(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 {t('km')}</span>
              <span>20 {t('km')}</span>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-4 mb-6">
            <Label className="text-sm font-medium text-card-foreground">{t('sortBy')}</Label>
            <RadioGroup value={sortBy} onValueChange={(value) => onSortByChange(value as 'nearest' | 'rating' | 'reviews')}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="nearest" id="nearest" />
                <label htmlFor="nearest" className="text-sm cursor-pointer text-card-foreground">{t('nearest')}</label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="rating" id="rating" />
                <label htmlFor="rating" className="text-sm cursor-pointer text-card-foreground">{t('highestRating')}</label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="reviews" id="reviews" />
                <label htmlFor="reviews" className="text-sm cursor-pointer text-card-foreground">{t('mostReviews')}</label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-2">
            <Button onClick={onClose} className="w-full lg:hidden">
              {t('applyFilters')}
            </Button>
            <Button variant="outline" onClick={handleClearFilters} className="w-full bg-transparent">
              {t('clearFilters')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
