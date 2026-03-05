'use client'

import { cn } from '@/lib/utils'
import { Navigation } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

interface DistanceBadgeProps {
  distance: number
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DistanceBadge({ 
  distance, 
  className, 
  showIcon = true,
  size = 'md' 
}: DistanceBadgeProps) {
  const { t } = useLanguage()

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-0.5',
    md: 'text-sm px-2 py-1 gap-1',
    lg: 'text-base px-3 py-1.5 gap-1.5',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }

  // Format distance nicely
  const formattedDistance = distance < 1 
    ? `${(distance * 1000).toFixed(0)}m` 
    : `${distance.toFixed(1)} ${t('km')}`

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 text-primary font-medium',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Navigation className={cn(iconSizes[size], 'flex-shrink-0')} />}
      <span>{formattedDistance}</span>
    </div>
  )
}
