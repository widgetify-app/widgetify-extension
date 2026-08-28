import type React from 'react'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { vipBadgeVariants, type VipBadgeVariantProps } from './vip-badge.variants'

const ICON_SIZES: Record<NonNullable<VipBadgeVariantProps['size']>, number> = {
	xs: 9,
	sm: 10,
	md: 12,
	lg: 14,
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
	const iconSize = ICON_SIZES[size || 'sm'] || 10

	return (
		<span
			className={cn(
				vipBadgeVariants({ variant, size, rounded }),
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

export const ProBadge = VipBadge
export type ProBadgeProps = VipBadgeProps
