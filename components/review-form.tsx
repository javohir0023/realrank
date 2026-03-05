'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RatingStars } from '@/components/rating-stars'
import { useLanguage } from '@/lib/i18n/language-context'
import { useAuth } from '@/lib/auth/auth-context'
import { LogIn, Loader2 } from 'lucide-react'

export interface ReviewData {
  rating: number
  comment: string
  authorName: string
  authorEmail: string
  createdAt: string
}

interface ReviewFormProps {
  onSubmit: (review: ReviewData) => void
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !user) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const reviewData: ReviewData = {
      rating,
      comment,
      authorName: user.name,
      authorEmail: user.email,
      createdAt: new Date().toISOString(),
    }
    
    onSubmit(reviewData)
    setRating(0)
    setComment('')
    setIsSubmitting(false)
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <Alert>
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            {t('loginToReview')}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/')}
        >
          <LogIn className="mr-2 h-4 w-4" />
          {t('loginToWriteReview')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User info display */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('yourRating')}</Label>
        <div className="flex items-center gap-2">
          <RatingStars
            rating={rating}
            size="lg"
            interactive
            onRatingChange={setRating}
          />
          {rating > 0 && (
            <span className="text-sm text-muted-foreground">({rating}/5)</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-comment">{t('yourReview')}</Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('reviewPlaceholder')}
          rows={4}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('loading')}
          </>
        ) : (
          t('submitReview')
        )}
      </Button>
    </form>
  )
}
