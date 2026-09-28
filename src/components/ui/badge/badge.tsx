import type React from 'react'
import { cn } from '@/common/utils/cn'
import { badgeVariants, type BadgeVariantProps } from './badge.variants'

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		BadgeVariantProps {
	children?: React.ReactNode
}

export function Badge({
	variant = 'error',
	size = 'xs',
	className,
	children,
	...props
}: BadgeProps) {
	return (
		<span
			className={cn(
				badgeVariants({ variant, size: variant === 'dot' ? undefined : size }),
				className
			)}
			{...props}
		>
			{children}
		</span>
	)
}

export function NewBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
	return <Badge variant="dot" className={cn('absolute', className)} {...props} />
}
