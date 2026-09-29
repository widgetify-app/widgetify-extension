import type React from 'react'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { vipBadgeVariants, type VipBadgeVariantProps } from './vip-badge.variants'

const ICON_SIZES: Record<NonNullable<VipBadgeVariantProps['size']>, number> = {
	xs: 8,
	sm: 10,
}

const ICON_ONLY_SIZES: Record<NonNullable<VipBadgeVariantProps['size']>, string> = {
	xs: 'w-3.5 h-3.5 p-0',
	sm: 'w-4.5 h-4.5 p-0',
}

interface VipBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VipBadgeVariantProps {
	iconOnly?: boolean
	text?: string
}

export function VipBadge({
	size = 'sm',
	variant = 'solid',
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
				vipBadgeVariants({ variant, size }),
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
