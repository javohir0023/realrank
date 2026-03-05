'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/lib/i18n/language-context'
import { type Place, type PlaceType } from '@/lib/mock-data'
import {
  getDiscountConfig,
  saveDiscountConfig,
  DISCOUNT_RATES,
  type DiscountConfig,
} from '@/lib/friday-discounts'
import { Fuel, Wrench, Coffee, Save, Percent } from 'lucide-react'
import { cn } from '@/lib/utils'

const translations = {
  title: {
    en: 'Friday Discounts Settings',
    ru: 'Настройки пятничных скидок',
    uz: 'Juma chegirmalari sozlamalari',
  },
  description: {
    en: 'Manage which places participate in Friday discounts and customize discount rates.',
    ru: 'Управляйте участниками пятничных скидок и настраивайте размер скидок.',
    uz: 'Juma chegirmalarida ishtirok etadigan joylarni boshqaring va chegirma miqdorini sozlang.',
  },
  enableDiscounts: {
    en: 'Enable Friday Discounts',
    ru: 'Включить пятничные скидки',
    uz: 'Juma chegirmalarini yoqish',
  },
  discountRates: {
    en: 'Discount Rates',
    ru: 'Размер скидок',
    uz: 'Chegirma miqdori',
  },
  selectPlaces: {
    en: 'Select Places',
    ru: 'Выбрать места',
    uz: 'Joylarni tanlash',
  },
  fuelStations: {
    en: 'Fuel Stations',
    ru: 'АЗС',
    uz: "Yoqilg'i shoxobchalari",
  },
  restaurants: {
    en: 'Cafes & Restaurants',
    ru: 'Кафе и рестораны',
    uz: 'Kafe va restoranlar',
  },
  constructionShops: {
    en: 'Construction Shops',
    ru: 'Строительные магазины',
    uz: "Qurilish do'konlari",
  },
  saveChanges: {
    en: 'Save Changes',
    ru: 'Сохранить изменения',
    uz: "O'zgarishlarni saqlash",
  },
  saved: {
    en: 'Saved!',
    ru: 'Сохранено!',
    uz: 'Saqlandi!',
  },
  selected: {
    en: 'selected',
    ru: 'выбрано',
    uz: 'tanlangan',
  },
  selectAll: {
    en: 'Select All',
    ru: 'Выбрать все',
    uz: 'Barchasini tanlash',
  },
  deselectAll: {
    en: 'Deselect All',
    ru: 'Снять выбор',
    uz: 'Tanlashni bekor qilish',
  },
}

const typeIcons: Record<PlaceType, typeof Fuel> = {
  fuel_station: Fuel,
  ev_charging: Fuel,
  construction_shop: Wrench,
  cafe_restaurant: Coffee,
}

interface FridayDiscountsAdminProps {
  isOpen: boolean
  onClose: () => void
  places: Place[]
  onConfigUpdate: (config: DiscountConfig) => void
}

export function FridayDiscountsAdmin({ isOpen, onClose, places, onConfigUpdate }: FridayDiscountsAdminProps) {
  const { language } = useLanguage()
  const [config, setConfig] = useState<DiscountConfig>(() => getDiscountConfig())
  const [saved, setSaved] = useState(false)
  const [customRates, setCustomRates] = useState<Record<PlaceType, number>>({
    fuel_station: DISCOUNT_RATES.fuel_station,
    cafe_restaurant: DISCOUNT_RATES.cafe_restaurant,
    construction_shop: DISCOUNT_RATES.construction_shop,
    ev_charging: 0,
  })

  // Load config on open
  useEffect(() => {
    if (isOpen) {
      const loadedConfig = getDiscountConfig()
      setConfig(loadedConfig)
      if (loadedConfig.customRates) {
        setCustomRates({
          ...customRates,
          ...loadedConfig.customRates,
        })
      }
    }
  }, [isOpen])

  // Group places by type
  const placesByType = useMemo(() => {
    const grouped: Record<string, Place[]> = {
      fuel_station: [],
      cafe_restaurant: [],
      construction_shop: [],
    }

    places.forEach(place => {
      if (grouped[place.type]) {
        grouped[place.type].push(place)
      }
    })

    return grouped
  }, [places])

  // Handle place selection
  const togglePlace = (placeId: string) => {
    setConfig(prev => {
      const isSelected = prev.participatingPlaceIds.includes(placeId)
      return {
        ...prev,
        participatingPlaceIds: isSelected
          ? prev.participatingPlaceIds.filter(id => id !== placeId)
          : [...prev.participatingPlaceIds, placeId],
      }
    })
  }

  // Handle select/deselect all for a type
  const toggleAllForType = (type: PlaceType, select: boolean) => {
    const typeIds = placesByType[type]?.map(p => p.id) || []
    
    setConfig(prev => {
      const otherIds = prev.participatingPlaceIds.filter(
        id => !typeIds.includes(id)
      )
      return {
        ...prev,
        participatingPlaceIds: select ? [...otherIds, ...typeIds] : otherIds,
      }
    })
  }

  // Count selected for a type
  const getSelectedCount = (type: PlaceType) => {
    const typeIds = placesByType[type]?.map(p => p.id) || []
    return config.participatingPlaceIds.filter(id => typeIds.includes(id)).length
  }

  // Handle save
  const handleSave = () => {
    const finalConfig: DiscountConfig = {
      ...config,
      customRates,
    }
    saveDiscountConfig(finalConfig)
    onConfigUpdate(finalConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const t = (key: keyof typeof translations) => translations[key][language]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-rose-500" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <Label htmlFor="enable-discounts" className="font-medium">
              {t('enableDiscounts')}
            </Label>
            <Switch
              id="enable-discounts"
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Discount Rates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">{t('discountRates')}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  {t('fuelStations')}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={customRates.fuel_station}
                    onChange={(e) => setCustomRates(prev => ({ ...prev, fuel_station: Number(e.target.value) }))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  {t('restaurants')}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={customRates.cafe_restaurant}
                    onChange={(e) => setCustomRates(prev => ({ ...prev, cafe_restaurant: Number(e.target.value) }))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  {t('constructionShops')}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={customRates.construction_shop}
                    onChange={(e) => setCustomRates(prev => ({ ...prev, construction_shop: Number(e.target.value) }))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Place Selection Tabs */}
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-sm mb-3">{t('selectPlaces')}</h3>
            <Tabs defaultValue="fuel_station" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fuel_station" className="gap-1 text-xs">
                  <Fuel className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('fuelStations')}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getSelectedCount('fuel_station')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="cafe_restaurant" className="gap-1 text-xs">
                  <Coffee className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('restaurants')}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getSelectedCount('cafe_restaurant')}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="construction_shop" className="gap-1 text-xs">
                  <Wrench className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('constructionShops')}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getSelectedCount('construction_shop')}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {(['fuel_station', 'cafe_restaurant', 'construction_shop'] as const).map(type => (
                <TabsContent key={type} value={type} className="flex-1 overflow-hidden mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {getSelectedCount(type)} / {placesByType[type]?.length || 0} {t('selected')}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => toggleAllForType(type, true)}
                      >
                        {t('selectAll')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => toggleAllForType(type, false)}
                      >
                        {t('deselectAll')}
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-3">
                      {placesByType[type]?.map(place => {
                        const Icon = typeIcons[place.type]
                        const isSelected = config.participatingPlaceIds.includes(place.id)
                        
                        return (
                          <div
                            key={place.id}
                            className={cn(
                              'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                              isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                            )}
                            onClick={() => togglePlace(place.id)}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => togglePlace(place.id)}
                            />
                            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{place.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                            </div>
                            {isSelected && (
                              <Badge className="bg-rose-500 text-white text-xs">
                                {customRates[type]}%
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSave} 
            className="w-full gap-2"
            disabled={saved}
          >
            {saved ? (
              <>
                <Save className="h-4 w-4" />
                {t('saved')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('saveChanges')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
