"use client";

import { Fuel, Zap, Wrench, Coffee, Navigation, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Place, PlaceType } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";

interface TopPickCardProps {
  place: Place;
  onViewOnMap: (place: Place) => void;
  onGetDirections: (place: Place) => void;
}

const typeConfig: Record<
  PlaceType,
  { icon: typeof Fuel; color: string; bgColor: string; label: { en: string; ru: string; uz: string } }
> = {
  fuel_station: {
    icon: Fuel,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950/50",
    label: { en: "Fuel Station", ru: "АЗС", uz: "Yoqilg'i" },
  },
  ev_charging: {
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-950/50",
    label: { en: "EV Charging", ru: "Зарядка", uz: "Zaryadlash" },
  },
  construction_shop: {
    icon: Wrench,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-950/50",
    label: { en: "Construction", ru: "Стройматериалы", uz: "Qurilish" },
  },
  cafe_restaurant: {
    icon: Coffee,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950/50",
    label: { en: "Cafe", ru: "Кафе", uz: "Kafe" },
  },
};

export function TopPickCard({ place, onViewOnMap, onGetDirections }: TopPickCardProps) {
  const { language, t } = useLanguage();
  const config = typeConfig[place.type];
  const Icon = config.icon;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card min-w-[280px] flex-shrink-0 snap-start">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={place.image || "/placeholder.svg"}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge
          className={`absolute top-3 left-3 ${config.bgColor} ${config.color} border-0 font-medium`}
        >
          <Icon className="h-3 w-3 mr-1" />
          {config.label[language]}
        </Badge>

        {/* Best Pick Badge */}
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Eng yaxshi
        </Badge>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{place.rating.toFixed(1)}</span>
          <span className="text-sm text-white/80">({place.reviewCount})</span>
        </div>

        {/* Distance */}
        {place.distance !== null && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm">
            <MapPin className="h-3 w-3" />
            {place.distance < 1
              ? `${Math.round(place.distance * 1000)}m`
              : `${place.distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
          {place.name}
        </h3>

        {/* Address */}
        <p className="text-sm text-muted-foreground truncate mb-3">
          {place.address}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-transparent"
            onClick={() => onViewOnMap(place)}
          >
            <MapPin className="h-3 w-3 mr-1" />
            {t("viewOnMap")}
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onGetDirections(place)}
          >
            <Navigation className="h-3 w-3 mr-1" />
            {t("getDirections")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton for loading state
export function TopPickCardSkeleton() {
  return (
    <Card className="min-w-[280px] flex-shrink-0 snap-start overflow-hidden">
      <div className="h-32 bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded animate-pulse flex-1" />
          <div className="h-8 bg-muted rounded animate-pulse flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
