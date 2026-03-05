'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n/language-context'
import type { PlaceType } from '@/lib/mock-data'
import { Filter, SortAsc, Fuel, Zap, Wrench, Coffee, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceFiltersProps {
  selectedTypes: PlaceType[]
  onTypesChange: (types: PlaceType[]) => void
  sortBy: 'nearest' | 'rating' | 'reviews'
  onSortByChange: (sort: 'nearest' | 'rating' | 'reviews') => void
  totalResults: number
  className?: string
}

const placeTypes: { value: PlaceType; icon: typeof Fuel; color: string }[] = [
  { value: 'fuel_station', icon: Fuel, color: 'bg-red-500' },
  { value: 'ev_charging', icon: Zap, color: 'bg-emerald-500' },
  { value: 'construction_shop', icon: Wrench, color: 'bg-amber-500' },
  { value: 'cafe_restaurant', icon: Coffee, color: 'bg-violet-500' },
]

export function PlaceFilters({
  selectedTypes,
  onTypesChange,
  sortBy,
  onSortByChange,
  totalResults,
  className,
}: PlaceFiltersProps) {
  const { t } = useLanguage()

  const toggleType = (type: PlaceType) => {
    if (selectedTypes.includes(type)) {
      // Don't allow deselecting all
      if (selectedTypes.length > 1) {
        onTypesChange(selectedTypes.filter((t) => t !== type))
      }
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const clearFilters = () => {
    onTypesChange(['fuel_station', 'ev_charging', 'construction_shop', 'cafe_restaurant'])
    onSortByChange('nearest')
  }

  const hasActiveFilters = selectedTypes.length < 4 || sortBy !== 'nearest'

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Type Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {placeTypes.map(({ value, icon: Icon, color }) => {
          const isSelected = selectedTypes.includes(value)
          return (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                isSelected
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              <span className={cn('w-4 h-4 rounded-full flex items-center justify-center', color)}>
                <Icon className="h-2.5 w-2.5 text-white" />
              </span>
              <span className="hidden sm:inline">{t(value)}</span>
            </button>
          )
        })}
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            <SortAsc className="h-4 w-4" />
            <span className="hidden sm:inline">{t('sortBy')}</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {t(sortBy)}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{t('sortBy')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => onSortByChange(v as typeof sortBy)}>
            <DropdownMenuRadioItem value="nearest">{t('nearest')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating">{t('highestRating')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="reviews">{t('mostReviews')}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('clearFilters')}</span>
        </Button>
      )}

      {/* Results Count */}
      <div className="ml-auto text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{totalResults}</span> {t('results')}
      </div>
    </div>
  )
}
