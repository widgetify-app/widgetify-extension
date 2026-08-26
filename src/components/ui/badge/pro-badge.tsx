import type React from 'react'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { proBadgeVariants, type ProBadgeVariantProps } from './pro-badge.variants'

const ICON_SIZES: Record<NonNullable<ProBadgeVariantProps['size']>, number> = {
	xs: 9,
	sm: 10,
	md: 12,
}

export interface ProBadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		ProBadgeVariantProps {
	iconOnly?: boolean
	text?: string
}

export function ProBadge({
	size = 'xs',
	variant = 'warning',
	rounded = 'lg',
	iconOnly = false,
	text = 'پرو',
	className,
	...props
}: ProBadgeProps) {
	const iconSize = ICON_SIZES[size || 'xs'] || 9

	return (
		<span
			className={cn(proBadgeVariants({ variant, size, rounded }), className)}
			{...props}
		>
			<Icon name="crown" size={iconSize} />
			{!iconOnly && <span>{text}</span>}
		</span>
	)
}

export const VipBadge = ProBadge
export type VipBadgeProps = ProBadgeProps

