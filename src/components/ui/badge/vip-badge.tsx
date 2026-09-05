import type React from 'react'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { vipBadgeVariants, type VipBadgeVariantProps } from './vip-badge.variants'

const ICON_SIZES: Record<NonNullable<VipBadgeVariantProps['size']>, number> = {
	xs: 8,
	sm: 10,
	md: 12,
	lg: 14,
}

const ICON_ONLY_SIZES: Record<NonNullable<VipBadgeVariantProps['size']>, string> = {
	xs: 'w-3.5 h-3.5 p-0',
	sm: 'w-4.5 h-4.5 p-0',
	md: 'w-5.5 h-5.5 p-0',
	lg: 'w-6.5 h-6.5 p-0',
}

export interface VipBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VipBadgeVariantProps {
	iconOnly?: boolean
	text?: string
}

export function VipBadge({
	size = 'sm',
	variant = 'indigo',
	rounded = 'full',
	iconOnly = false,
	text = 'پرو',
	className,
	...props
}: VipBadgeProps) {
	const currentSize = size || 'sm'
	const iconSize = ICON_SIZES[currentSize] || 10

	return (
		<span
			className={cn(
				vipBadgeVariants({ variant, size, rounded }),
				iconOnly && [
					'aspect-square shrink-0 justify-center items-center',
					ICON_ONLY_SIZES[currentSize],
				],
				className
			)}
			{...props}
		>
			<Icon name="diamond" size={iconSize} />
			{!iconOnly && <span>{text}</span>}
		</span>
	)
}

export const ProBadge = VipBadge
export type ProBadgeProps = VipBadgeProps
