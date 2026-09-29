import type React from 'react'
import { cn } from '@/common/utils/cn'
import { type BadgeVariantProps, badgeVariants } from './badge.variants'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export function Badge({ variant, className, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export function NewBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
	return <Badge variant="dot" className={cn('absolute', className)} {...props} />
}
