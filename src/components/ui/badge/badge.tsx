import type React from 'react'
import { formatBadgeCount } from './badge-count'
import { cn } from '@/common/utils/cn'
import { type BadgeVariantProps, badgeVariants } from './badge.variants'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	count: number
}

export function CountBadge({ count, className, ...props }: CountBadgeProps) {
	return (
		<span
			dir="ltr"
			className={cn(
				'absolute flex items-center justify-center min-w-4 h-4 px-1 text-3xs font-bold leading-none rounded-full bg-danger text-on-danger ring-2 ring-danger-fill-2',
				className
			)}
			{...props}
		>
			{formatBadgeCount(count)}
		</span>
	)
}

export function NewBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn(
				'absolute w-2 h-2 rounded-full bg-danger animate-pulse ring-2 ring-danger-fill-2',
				className
			)}
			{...props}
		/>
	)
}
