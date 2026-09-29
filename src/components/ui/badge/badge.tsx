import type React from 'react'
import { cn } from '@/common/utils/cn'
import { type BadgeVariantProps, badgeVariants } from './badge.variants'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
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
