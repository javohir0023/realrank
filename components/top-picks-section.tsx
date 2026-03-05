"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopPickCard, TopPickCardSkeleton } from "@/components/top-pick-card";
import type { Place } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";

interface TopPicksSectionProps {
  topPicks: Place[];
  loading?: boolean;
  onViewOnMap: (place: Place) => void;
  onGetDirections: (place: Place) => void;
}

const sectionTitle = {
  en: "Best picks for you",
  ru: "Лучшие варианты для вас",
  uz: "Sizga eng yaxshi variantlar",
};

const sectionSubtitle = {
  en: "Top rated places near you",
  ru: "Лучшие места рядом с вами",
  uz: "Sizga yaqin eng yaxshi joylar",
};

export function TopPicksSection({
  topPicks,
  loading = false,
  onViewOnMap,
  onGetDirections,
}: TopPicksSectionProps) {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Don't render if no top picks and not loading
  if (!loading && topPicks.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
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

        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-transparent"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-transparent"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cards Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading ? (
          // Loading skeletons
          <>
            <TopPickCardSkeleton />
            <TopPickCardSkeleton />
            <TopPickCardSkeleton />
          </>
        ) : (
          // Actual cards
          topPicks.map((place) => (
            <TopPickCard
              key={place.id}
              place={place}
              onViewOnMap={onViewOnMap}
              onGetDirections={onGetDirections}
            />
          ))
        )}
      </div>
    </section>
  );
}
