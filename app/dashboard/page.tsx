'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'
import { FilterSidebar } from '@/components/filter-sidebar'
import { PlacesList, type PlacesListRef } from '@/components/places-list'
import { PlaceFilters } from '@/components/place-filters'
import { PlaceDetailsModal } from '@/components/place-details-modal'
import { TopPicksSection } from '@/components/top-picks-section'
import { FridayDiscountsSection } from '@/components/friday-discounts-section'
import { AIChatbot } from '@/components/ai-chatbot'
import { useLanguage } from '@/lib/i18n/language-context'
import { useTopPicks } from '@/hooks/use-top-picks'
import { mockPlaces, type Place, type PlaceType, placeStats } from '@/lib/mock-data'
import { useGeolocation } from '@/hooks/use-geolocation'
import { List, Map, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Dynamic import MapView with SSR disabled (Leaflet requires window)
const MapView = dynamic(() => import('@/components/map-view').then(mod => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading map...</span>
      </div>
    </div>
  ),
})

export default function DashboardPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<PlaceType[]>(['fuel_station', 'ev_charging', 'construction_shop', 'cafe_restaurant'])
  const [distance, setDistance] = useState(50) // Increased default distance for Khorezm region
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'reviews'>('nearest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Refs for bidirectional sync
  const placesListRef = useRef<PlacesListRef>(null)

  // Geolocation hook - uses browser's Geolocation API (GPS on mobile)
  const { 
    coords: userLocation, 
    loading: locationLoading, 
    accuracy: locationAccuracy,
    refresh: refreshLocation,
    permissionStatus,
    error: locationError
  } = useGeolocation({ enableHighAccuracy: true })

  // Top Picks hook - calculates best places for each category
  const { allTopPicks, loading: topPicksLoading } = useTopPicks(mockPlaces, userLocation)

  // Handle map ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapReady = useCallback((map: any) => {
    setMapInstance(map)
  }, [])

  // Filter and sort places
  const placesToShow = useMemo(() => {
    let places = mockPlaces.filter((place) => {
      // Filter by type
      if (!selectedTypes.includes(place.type)) return false
      
      // Filter by distance (skip if distance is null)
      if (place.distance !== null && place.distance > distance) return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const landmark = (place as Place & { landmark?: string }).landmark || ''
        const district = (place as Place & { district?: string }).district || ''
        return (
          place.name.toLowerCase().includes(query) ||
          place.address.toLowerCase().includes(query) ||
          landmark.toLowerCase().includes(query) ||
          district.toLowerCase().includes(query)
        )
      }
      
      return true
    })

    // Sort places
    switch (sortBy) {
      case 'nearest':
        places.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
        break
      case 'rating':
        places.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        places.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return places
  }, [selectedTypes, distance, sortBy, searchQuery])

  // Handle place selection from map - scroll list to that item
  const handlePlaceSelectFromMap = useCallback((place: Place | null) => {
    setSelectedPlace(place)
    if (place) {
      placesListRef.current?.scrollToPlace(place.id)
    }
  }, [])

  // Handle place selection from list - open modal
  const handlePlaceSelectFromList = useCallback((place: Place) => {
    setSelectedPlace(place)
    setModalOpen(true)
  }, [])

  // Handle "View on Map" button click
  const handleViewOnMap = useCallback((place: Place) => {
    setSelectedPlace(place)
    if (mapInstance) {
      mapInstance.setView([place.coordinates.lat, place.coordinates.lng], 16, { animate: true })
    }
    // On mobile, switch to map view
    setViewMode('map')
  }, [mapInstance])

  // Handle "Get Directions" button click
  const handleGetDirections = useCallback((place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`
    window.open(url, '_blank')
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          distance={distance}
          onDistanceChange={setDistance}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Friday Discounts Section */}
          <FridayDiscountsSection
            places={mockPlaces}
            onViewOnMap={handleViewOnMap}
            loading={locationLoading}
          />

          {/* Top Picks Section */}
          <TopPicksSection
            topPicks={allTopPicks}
            loading={topPicksLoading || locationLoading}
            onViewOnMap={handleViewOnMap}
            onGetDirections={handleGetDirections}
          />

          {/* Mobile View Toggle */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {placesToShow.length} {t('results')}
              </h2>
              {locationLoading ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>GPS...</span>
                </div>
              ) : userLocation ? (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>GPS</span>
                </div>
              ) : permissionStatus === 'denied' ? (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>GPS off</span>
                </div>
              ) : null}
            </div>
            <div className="flex rounded-lg bg-muted p-1">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-1"
              >
                <Map className="h-4 w-4" />
                {t('map')}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-1"
              >
                <List className="h-4 w-4" />
                {t('list')}
              </Button>
            </div>
          </div>

          {/* Desktop Header with Filters */}
          <div className="hidden lg:block mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">
                  Xorazm viloyati ({placeStats.total} joy) - {placesToShow.length} {t('results')}
                </h2>
                {locationLoading ? (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Finding GPS...</span>
                  </div>
                ) : userLocation ? (
                  <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span>GPS Active</span>
                    {locationAccuracy && (
                      <span className="text-xs text-muted-foreground">
                        ({locationAccuracy < 100 ? `${Math.round(locationAccuracy)}m` : `${(locationAccuracy / 1000).toFixed(1)}km`})
                      </span>
                    )}
                  </div>
                ) : permissionStatus === 'denied' ? (
                  <button 
                    onClick={refreshLocation}
                    className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>GPS Denied - Click to retry</span>
                  </button>
                ) : locationError ? (
                  <button 
                    onClick={refreshLocation}
                    className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>GPS Error - Click to retry</span>
                  </button>
                ) : null}
              </div>
            </div>
            <PlaceFilters
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              totalResults={placesToShow.length}
            />
          </div>

          {/* Desktop: Split View */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 h-[calc(100%-100px)]">
            {/* Map Section */}
            <div className="h-full rounded-2xl overflow-hidden shadow-lg">
              <MapView
                userLocation={userLocation}
                places={placesToShow}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelectFromMap}
                onMapReady={handleMapReady}
                locationLoading={locationLoading}
                locationAccuracy={locationAccuracy}
                onRefreshLocation={refreshLocation}
              />
            </div>

            {/* Places List */}
            <PlacesList
              ref={placesListRef}
              places={placesToShow}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelectFromList}
              onViewOnMap={handleViewOnMap}
              onGetDirections={handleGetDirections}
              loading={false}
              error={null}
              className="h-full"
            />
          </div>

          {/* Mobile: Single View */}
          <div className="lg:hidden h-[calc(100%-60px)]">
            {viewMode === 'map' ? (
              <div className="h-full rounded-2xl overflow-hidden shadow-lg">
                <MapView
                  userLocation={userLocation}
                  places={placesToShow}
                  selectedPlace={selectedPlace}
                  onPlaceSelect={(place) => {
                    if (place) handlePlaceSelectFromList(place)
                  }}
                  onMapReady={handleMapReady}
                  locationLoading={locationLoading}
                  locationAccuracy={locationAccuracy}
                  onRefreshLocation={refreshLocation}
                />
              </div>
            ) : (
              <PlacesList
                ref={placesListRef}
                places={placesToShow}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelectFromList}
                onViewOnMap={handleViewOnMap}
                onGetDirections={handleGetDirections}
                loading={false}
                error={null}
                className="h-full"
              />
            )}
          </div>
        </main>
      </div>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
      />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
