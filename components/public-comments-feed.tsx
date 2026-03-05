'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RatingStars } from '@/components/rating-stars'
import { useLanguage } from '@/lib/i18n/language-context'
import { useAuth } from '@/lib/auth/auth-context'
import { Send, Globe, Users, MessageSquare, Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  isPublic: boolean
}

// Mock data for demonstrating public comments from multiple users
const MOCK_PUBLIC_COMMENTS: Comment[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sardor Karimov',
    userAvatar: '',
    rating: 5,
    comment: "Juda yaxshi joy! Xizmat a'lo darajada va narxlar qulay. Albatta tavsiya qilaman!",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isPublic: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Nilufar Rahimova',
    userAvatar: '',
    rating: 4,
    comment: "Yaxshi restoran, taom mazali. Faqat kutish vaqti biroz uzun bo'ldi.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isPublic: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Bekzod Tursunov',
    userAvatar: '',
    rating: 5,
    comment: "Eng yaxshi kafe Urganchda! Atmosfera juda yoqimli, xodimlar mehribon. 5 yulduz!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isPublic: true,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Aziza Yusupova',
    userAvatar: '',
    rating: 4,
    comment: "Oila bilan bordik, bolalarga juda yoqdi. Narxlar ham maqbul. Qaytib kelamiz.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isPublic: true,
  },
]

interface PublicCommentsFeedProps {
  placeId?: string
  placeName?: string
  className?: string
}

export function PublicCommentsFeed({ placeId, placeName, className }: PublicCommentsFeedProps) {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>(MOCK_PUBLIC_COMMENTS)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState<string | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return t('justNow') || 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ${t('ago') || 'ago'}`
    if (diffHours < 24) return `${diffHours}h ${t('ago') || 'ago'}`
    if (diffDays === 1) return `1 ${t('dayAgo') || 'day ago'}`
    return `${diffDays} ${t('daysAgo') || 'days ago'}`
  }

  // Handle comment submission
  const handleSubmit = async () => {
    if (!newComment.trim() || !isAuthenticated) return

    setIsSubmitting(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newCommentObj: Comment = {
      id: `new-${Date.now()}`,
      userId: user?.id || 'current-user',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.avatar || '',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString(),
      isPublic: true,
    }

    // Add new comment to the top of the list
    setComments(prev => [newCommentObj, ...prev])
    setNewComment('')
    setNewRating(5)
    setIsSubmitting(false)
    setJustSubmitted(newCommentObj.id)

    // Remove highlight after animation
    setTimeout(() => setJustSubmitted(null), 3000)
  }

  // Scroll to top when new comment is added
  useEffect(() => {
    if (justSubmitted && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
  }, [justSubmitted])

  const currentUserInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AN'

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            {t('publicReviews') || 'Public Reviews'}
          </CardTitle>
          <Badge variant="secondary" className="gap-1 text-xs font-normal">
            <Globe className="h-3 w-3" />
            {t('visibleToEveryone') || 'Visible to everyone'}
          </Badge>
        </div>
        {/* Public indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Users className="h-4 w-4" />
          <span>{comments.length} {t('publicComments') || 'public comments from verified users'}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Write Review Section */}
        <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/20">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name || 'User'} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {currentUserInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">
                  {isAuthenticated ? user?.name : (t('loginToComment') || 'Login to comment')}
                </span>
                <Badge variant="outline" className="text-xs gap-1">
                  <Globe className="h-3 w-3" />
                  {t('public') || 'Public'}
                </Badge>
              </div>
              
              {/* Rating Selection */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('yourRating')}:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      disabled={!isAuthenticated}
                      className={cn(
                        "p-0.5 rounded transition-all",
                        isAuthenticated ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 transition-colors",
                          star <= newRating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder={isAuthenticated 
                  ? (t('writeYourReview') || 'Write your review... (visible to all users)')
                  : (t('loginToWriteReview') || 'Please login to write a review')
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!isAuthenticated}
                className="min-h-[80px] resize-none bg-background"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {t('reviewsArePublic') || 'Your review will be visible to all users'}
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!isAuthenticated || !newComment.trim() || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('submitting') || 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('submitReview')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Public Comments Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {t('allPublicReviews') || 'All Public Reviews'}
            </h4>
            <span className="text-xs text-muted-foreground">
              {t('sortedByRecent') || 'Sorted by most recent'}
            </span>
          </div>

          <div ref={feedRef} className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {comments.map((comment) => {
              const initials = comment.userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              const isNew = comment.id === justSubmitted

              return (
                <div 
                  key={comment.id} 
                  className={cn(
                    "flex gap-3 p-4 rounded-xl transition-all duration-500",
                    isNew 
                      ? "bg-primary/10 border border-primary/30 animate-pulse" 
                      : "bg-muted/50 hover:bg-muted/70"
                  )}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    {comment.userAvatar ? (
                      <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                    ) : null}
                    <AvatarFallback className={cn(
                      "text-xs font-medium",
                      isNew 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{comment.userName}</span>
                        {isNew && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                            {t('you') || 'You'}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatRelativeTime(comment.date)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <RatingStars rating={comment.rating} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    {/* Public indicator per comment */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>{t('publicComment') || 'Public comment'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
