import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { activityStyle } from '../../utils/activity-color'

type ActivityBubbleSize = 'sm' | 'lg'

interface ActivityBubbleProps {
	children: ReactNode
	size?: ActivityBubbleSize
	isInteractive?: boolean
	badge?: ReactNode
	color?: string | null
}

const BUBBLE_SIZES: Record<
	ActivityBubbleSize,
	{ slot: string; bubble: string; tailBig: string; tailSmall: string }
> = {
	sm: {
		slot: 'w-24 items-end',
		bubble: 'min-w-14 max-w-24 px-3 py-2 rounded-2xl text-2xs',
		tailBig: 'size-2.5 -bottom-1.5 -ml-6',
		tailSmall: 'size-1.5 -bottom-3.5 -ml-3',
	},
	lg: {
		slot: 'items-start',
		bubble: 'min-w-44 max-w-72 px-5 py-3.5 rounded-widget text-base',
		tailBig: 'size-4 -bottom-3 -ml-7',
		tailSmall: 'size-2.5 -bottom-5.5 -ml-3.5',
	},
}

export function ActivityBubble({
	children,
	size = 'sm',
	isInteractive,
	badge,
	color,
}: ActivityBubbleProps) {
	const sizes = BUBBLE_SIZES[size]
	const tint = activityStyle(color)

	return (
		<div className={cn('relative z-10 flex justify-center', sizes.slot)}>
			<div className="relative">
				<div
					className={cn(
						'leading-tight text-center bg-surface-3 shadow-sm text-fg transition-ui',
						sizes.bubble,
						isInteractive && 'cursor-pointer group-hover:scale-95'
					)}
					style={tint}
				>
					{children}
				</div>
				<span
					className={cn(
						'absolute block rounded-full left-1/2 bg-surface-3',
						sizes.tailBig
					)}
					style={tint}
				/>
				<span
					className={cn(
						'absolute block rounded-full left-1/2 bg-surface-3',
						sizes.tailSmall
					)}
					style={tint}
				/>
				{badge}
			</div>
		</div>
	)
}
