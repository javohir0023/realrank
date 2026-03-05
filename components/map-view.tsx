"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Navigation, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import type { Place, PlaceType } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";

// Leaflet will be loaded from CDN and accessed via window.L
declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

interface MapViewProps {
  userLocation: { lat: number; lng: number } | null;
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapReady?: (map: any) => void;
  locationLoading?: boolean;
  locationAccuracy?: number | null;
  onRefreshLocation?: () => void;
}

const placeTypeIcons: Record<PlaceType, string> = {
  fuel_station: "⛽",
  ev_charging: "🔌",
  construction_shop: "🔧",
  cafe_restaurant: "☕",
};

const placeTypeColors: Record<PlaceType, string> = {
  fuel_station: "#ef4444",
  ev_charging: "#22c55e",
  construction_shop: "#f59e0b",
  cafe_restaurant: "#8b5cf6",
};

// Khorezm center (Urgench)
const DEFAULT_CENTER = { lat: 41.5500, lng: 60.6333 };

export function MapView({
  userLocation,
  places,
  selectedPlace,
  onPlaceSelect,
  onMapReady,
  locationLoading,
  locationAccuracy,
  onRefreshLocation,
}: MapViewProps) {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const center = userLocation || DEFAULT_CENTER;

  // Load Leaflet from CDN (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        setupLeaflet();
        return;
      }

      // Load Leaflet CSS
      const existingLink = document.querySelector('link[href*="leaflet"]');
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load Leaflet JS from CDN
      const existingScript = document.querySelector('script[src*="leaflet"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => {
          setupLeaflet();
        };
        document.head.appendChild(script);
      } else {
        // Script exists, wait for it to load
        const checkLoaded = setInterval(() => {
          if (window.L) {
            clearInterval(checkLoaded);
            setupLeaflet();
          }
        }, 100);
      }
    };

    const setupLeaflet = () => {
      // Add custom styles for animations
      const existingStyle = document.getElementById("leaflet-custom-styles");
      if (!existingStyle) {
        const style = document.createElement("style");
        style.id = "leaflet-custom-styles";
        style.textContent = `
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
          }
          .leaflet-popup-content {
            margin: 12px 16px !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Fix default marker icons
      if (window.L) {
        delete (window.L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });
      }
      
      setIsLoaded(true);
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current || !window.L) return;

    const map = window.L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 12,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    onMapReady?.(map);
  }, [isLoaded, center.lat, center.lng, onMapReady]);

  // Update user location marker
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !userLocation || !window.L) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create custom user icon
    const userIcon = window.L.divIcon({
      className: "user-location-marker",
      html: `
        <div style="position: relative;">
          <div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
          </div>
          <div style="position: absolute; inset: -8px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    userMarkerRef.current = window.L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      title: "Your Location",
    }).addTo(mapInstanceRef.current);

  }, [isLoaded, userLocation]);

  // Update place markers
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create new markers
    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const color = placeTypeColors[place.type];
      const icon = placeTypeIcons[place.type];

      const markerIcon = window.L.divIcon({
        className: "place-marker",
        html: `
          <div style="cursor: pointer; transition: transform 0.2s; transform: scale(${isSelected ? 1.3 : 1});">
            <div style="
              width: 36px; 
              height: 36px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 16px; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
              border: 2px solid white;
              background-color: ${color};
            ">
              ${icon}
            </div>
            ${isSelected ? `
              <div style="
                position: absolute; 
                bottom: -4px; 
                left: 50%; 
                transform: translateX(-50%); 
                width: 0; 
                height: 0; 
                border-left: 6px solid transparent; 
                border-right: 6px solid transparent; 
                border-top: 8px solid ${color};
              "></div>
            ` : ""}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = window.L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: markerIcon,
        title: place.name,
      }).addTo(mapInstanceRef.current!);

      marker.on("click", () => {
        onPlaceSelect(place);
      });

      // Add popup with place name
      marker.bindPopup(`
        <div style="text-align: center; min-width: 150px;">
          <strong>${place.name}</strong>
          <br/>
          <small>${place.address}</small>
          ${place.rating ? `<br/><span style="color: #f59e0b;">★</span> ${place.rating.toFixed(1)}` : ""}
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [isLoaded, places, selectedPlace, onPlaceSelect]);

  // Center on selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return;
    mapInstanceRef.current.setView(
      [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
      15,
      { animate: true }
    );
  }, [selectedPlace]);

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  const handleCenterOnUser = useCallback(() => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
      });
    }
  }, [userLocation]);

  if (!isLoaded) {
    return (
      <div className="relative h-full w-full bg-muted rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loadingMap")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-card hover:bg-accent"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-card hover:bg-accent"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Center on User Button */}
      <div className="absolute right-4 bottom-4 z-[1000] flex flex-col items-end gap-2">
        {/* Accuracy indicator */}
        {userLocation && locationAccuracy && (
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md text-xs text-muted-foreground">
            GPS: {locationAccuracy < 100 ? `${Math.round(locationAccuracy)}m` : `${(locationAccuracy / 1000).toFixed(1)}km`}
          </div>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-card hover:bg-accent relative"
          onClick={() => {
            if (userLocation) {
              handleCenterOnUser();
            } else if (onRefreshLocation) {
              onRefreshLocation();
            }
          }}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : userLocation ? (
            <Navigation className="h-5 w-5 text-primary" />
          ) : (
            <Navigation className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg z-[1000]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {Object.entries(placeTypeIcons).map(([type, icon]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: placeTypeColors[type as PlaceType] }}
              >
                {icon}
              </span>
              <span className="text-muted-foreground capitalize">
                {t(type as PlaceType)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
