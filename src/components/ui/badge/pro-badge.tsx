import type React from 'react'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { proBadgeVariants, type ProBadgeVariantProps } from './pro-badge.variants'

const ICON_SIZES: Record<NonNullable<ProBadgeVariantProps['size']>, number> = {
	xs: 9,
	sm: 10,
	md: 12,
	lg: 14,
}

export interface ProBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		ProBadgeVariantProps {
	iconOnly?: boolean
	text?: string
}

export function ProBadge({
	size = 'sm',
	variant = 'indigo',
	rounded = 'full',
	iconOnly = false,
	text = 'پرو',
	className,
	...props
}: ProBadgeProps) {
	const iconSize = ICON_SIZES[size || 'sm'] || 10

	return (
		<span
			className={cn(
				proBadgeVariants({ variant, size, rounded }),
				iconOnly ? 'aspect-square px-0 w-fit justify-center' : '',
				className
			)}
			{...props}
		>
			<Icon name="crown" size={iconSize} />
			{!iconOnly && <span>{text}</span>}
		</span>
	)
}

export const VipBadge = ProBadge
export type VipBadgeProps = ProBadgeProps
