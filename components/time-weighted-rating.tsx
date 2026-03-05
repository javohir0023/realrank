'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RatingStars } from '@/components/rating-stars'
import { useLanguage } from '@/lib/i18n/language-context'
import { Star, TrendingUp, TrendingDown, Minus, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
}

interface TimeWeightedRatingProps {
  reviews: Review[]
  loading?: boolean
  className?: string
}

// Calculate time-weighted rating
function calculateTimeWeightedRating(reviews: Review[]): { score: number; trend: 'up' | 'down' | 'stable'; recentCount: number } {
  if (reviews.length === 0) return { score: 0, trend: 'stable', recentCount: 0 }

  const now = new Date()
  let weightedSum = 0
  let totalWeight = 0
  let recentSum = 0
  let olderSum = 0
  let recentCount = 0
  let olderCount = 0

  reviews.forEach((review) => {
    const reviewDate = new Date(review.date)
    const daysSince = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Exponential decay weight - recent reviews matter more
    // Reviews from today have weight 1.0, reviews from 30 days ago have weight ~0.37
    const weight = Math.exp(-daysSince / 30)
    
    weightedSum += review.rating * weight
    totalWeight += weight

    // Track trend (last 7 days vs older)
    if (daysSince <= 7) {
      recentSum += review.rating
      recentCount++
    } else {
      olderSum += review.rating
      olderCount++
    }
  })

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0
  
  // Determine trend
  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (recentCount > 0 && olderCount > 0) {
    const recentAvg = recentSum / recentCount
    const olderAvg = olderSum / olderCount
    if (recentAvg > olderAvg + 0.3) trend = 'up'
    else if (recentAvg < olderAvg - 0.3) trend = 'down'
  }

  return { score, trend, recentCount }
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

// Get freshness color based on review age
function getFreshnessColor(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 2) return 'text-emerald-500 bg-emerald-500/10'
  if (diffDays <= 7) return 'text-blue-500 bg-blue-500/10'
  if (diffDays <= 30) return 'text-amber-500 bg-amber-500/10'
  return 'text-muted-foreground bg-muted'
}

export function TimeWeightedRating({ reviews, loading = false, className }: TimeWeightedRatingProps) {
  const { t } = useLanguage()

  const { score, trend, recentCount } = useMemo(() => calculateTimeWeightedRating(reviews), [reviews])

  // Sort reviews by date (most recent first)
  const sortedReviews = useMemo(() => 
    [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [reviews]
  )

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'
  const trendBg = trend === 'up' ? 'bg-emerald-500/10' : trend === 'down' ? 'bg-rose-500/10' : 'bg-muted'

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('timeWeightedRating') || 'Time-Weighted Rating'}
          </CardTitle>
          <Badge variant="secondary" className="gap-1 text-xs font-normal">
            <Clock className="h-3 w-3" />
            {t('basedOnRecentActivity') || 'Based on recent activity'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Section */}
        <div className="flex items-center gap-6">
          {/* Large Score Display */}
          <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <span className="text-4xl font-bold text-foreground">{score.toFixed(1)}</span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3 w-3",
                    star <= Math.round(score) 
                      ? "fill-amber-400 text-amber-400" 
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Stats & Trend */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium", trendBg, trendColor)}>
                <TrendIcon className="h-4 w-4" />
                <span>
                  {trend === 'up' ? (t('trendingUp') || 'Trending Up') : 
                   trend === 'down' ? (t('trendingDown') || 'Trending Down') : 
                   (t('stable') || 'Stable')}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{recentCount}</span> {t('recentReviews') || 'reviews in last 7 days'}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{reviews.length}</span> {t('totalReviews') || 'total reviews'}
            </div>
          </div>
        </div>

        {/* Mini Trend Chart */}
        <div className="flex items-end gap-1 h-12 px-2">
          {sortedReviews.slice(0, 10).reverse().map((review, index) => (
            <div
              key={review.id}
              className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
              style={{ height: `${(review.rating / 5) * 100}%` }}
              title={`${review.rating} stars - ${formatRelativeTime(review.date)}`}
            />
          ))}
          {sortedReviews.length < 10 && 
            Array.from({ length: 10 - sortedReviews.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1 rounded-t bg-muted h-2" />
            ))
          }
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {t('recentRatingsChart') || 'Recent ratings (newest on right)'}
        </p>

        {/* Reviews List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-foreground">{t('latestReviews') || 'Latest Reviews'}</h4>
          {sortedReviews.slice(0, 5).map((review) => {
            const initials = review.userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
            const freshnessClass = getFreshnessColor(review.date)

            return (
              <div key={review.id} className="flex gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {review.userAvatar ? (
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm truncate">{review.userName}</span>
                    {/* Highlighted Date Badge */}
                    <Badge variant="secondary" className={cn("text-xs font-medium shrink-0", freshnessClass)}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(review.date)}
                    </Badge>
                  </div>
                  <div className="mb-1.5">
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
